"use-client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { TranscriptItem } from "@/app/types";
import Image from "next/image";
import { useTranscript } from "@/app/contexts/TranscriptContext";
import WebSearchResultCard from './TranscriptItems/WebSearchResultCard';

export interface TranscriptProps {
  userText: string;
  setUserText: (val: string) => void;
  onSendMessage: () => void;
  canSend: boolean;
}

function Transcript({
  userText,
  setUserText,
  onSendMessage,
  canSend,
}: TranscriptProps) {
  const { transcriptItems, toggleTranscriptItemExpand } = useTranscript();
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const [prevLogs, setPrevLogs] = useState<TranscriptItem[]>([]);
  const [justCopied, setJustCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function scrollToBottom() {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    const hasNewMessage = transcriptItems.length > prevLogs.length;
    const hasUpdatedMessage = transcriptItems.some((newItem, index) => {
      const oldItem = prevLogs[index];
      return (
        oldItem &&
        (newItem.title !== oldItem.title || newItem.data !== oldItem.data)
      );
    });

    if (hasNewMessage || hasUpdatedMessage) {
      scrollToBottom();
    }

    setPrevLogs(transcriptItems);
  }, [transcriptItems]);

  // Autofocus on text box input on load
  useEffect(() => {
    if (canSend && inputRef.current) {
      inputRef.current.focus();
    }
  }, [canSend]);

  const handleCopyTranscript = async () => {
    if (!transcriptRef.current) return;
    try {
      await navigator.clipboard.writeText(transcriptRef.current.innerText);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy transcript:", error);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px' }}>
      <div className="relative flex-1 min-h-0">
        <button
          onClick={handleCopyTranscript}
          className="absolute w-20 top-3 right-2 mr-1 z-10 text-sm px-3 py-2 rounded-full"
          style={{ 
            backgroundColor: 'var(--button-bg)', 
            color: 'var(--button-text)'
          }}
        >
          {justCopied ? "Copied!" : "Copy"}
        </button>

        <div
          ref={transcriptRef}
          className="overflow-auto p-4 flex flex-col gap-y-4 h-full"
        >
          {transcriptItems.map((item) => {
            const { itemId, type, role, data, expanded, timestamp, title = "", isHidden } = item;

            if (isHidden) {
              return null;
            }

            if (type === "MESSAGE") {
              const isUser = role === "user";
              const baseContainer = "flex justify-end flex-col";
              const containerClasses = `${baseContainer} ${isUser ? "items-end" : "items-start"}`;
              const bubbleStyle = isUser 
                ? { backgroundColor: 'var(--primary)', color: '#ffffff' }
                : { backgroundColor: 'var(--secondary)', color: 'var(--foreground)' };
              const isBracketedMessage = title.startsWith("[") && title.endsWith("]");
              const messageStyle = isBracketedMessage ? "italic text-gray-400" : "";
              const displayTitle = isBracketedMessage ? title.slice(1, -1) : title;

              return (
                <div key={itemId} className={containerClasses}>
                  <div className="max-w-lg p-3 rounded-xl" style={bubbleStyle}>
                    <div className="text-xs font-mono" style={{ color: isUser ? 'rgba(255, 255, 255, 0.7)' : 'var(--foreground)', opacity: '0.7' }}>
                      {timestamp}
                    </div>
                    <div className={`whitespace-pre-wrap ${messageStyle}`}>
                      <ReactMarkdown>{displayTitle}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            } else if (type === "BREADCRUMB") {
              return (
                <div
                  key={itemId}
                  className="flex flex-col justify-start items-start text-sm"
                  style={{ color: 'var(--foreground)', opacity: '0.7' }}
                >
                  <span className="text-xs font-mono">{timestamp}</span>
                  <div
                    className={`whitespace-pre-wrap flex items-center font-mono text-sm ${
                      data ? "cursor-pointer" : ""
                    }`}
                    style={{ color: 'var(--foreground)' }}
                    onClick={() => data && toggleTranscriptItemExpand(itemId)}
                  >
                    {data && (
                      <span
                        className={`mr-1 transform transition-transform duration-200 select-none font-mono ${
                          expanded ? "rotate-90" : "rotate-0"
                        }`}
                        style={{ color: 'var(--foreground)', opacity: '0.5' }}
                      >
                        ▶
                      </span>
                    )}
                    {title}
                  </div>
                  {expanded && data && (
                    <div className="text-left" style={{ color: 'var(--foreground)' }}>
                      <pre 
                        className="border-l-2 ml-1 whitespace-pre-wrap break-words font-mono text-xs mb-2 mt-2 pl-2"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        {JSON.stringify(data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            } else if (type === "WEB_SEARCH_RESULT") {
              return (
                <div key={itemId} className="flex flex-col items-start">
                  <WebSearchResultCard
                    title={data?.title}
                    description={data?.description}
                    imageUrl={data?.imageUrl}
                    link={data?.link}
                  />
                </div>
              );
            } else {
              // Fallback if type is neither MESSAGE nor BREADCRUMB
              return (
                <div
                  key={itemId}
                  className="flex justify-center text-sm italic font-mono"
                  style={{ color: 'var(--foreground)', opacity: '0.6' }}
                >
                  Unknown item type: {type}{" "}
                  <span className="ml-2 text-xs">{timestamp}</span>
                </div>
              );
            }
          })}
        </div>
      </div>

      <div className="p-4 flex items-center gap-x-2 flex-shrink-0" style={{ borderTopWidth: '1px', borderColor: 'var(--border)' }}>
        <input
          ref={inputRef}
          type="text"
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSend) {
              onSendMessage();
            }
          }}
          className="flex-1 px-4 py-2 focus:outline-none rounded-lg border"
          placeholder="Type a message..."
          style={{ 
            backgroundColor: 'var(--input-bg)', 
            color: 'var(--input-text)', 
            borderColor: 'var(--input-border)'
          }}
        />
        <button
          onClick={onSendMessage}
          disabled={!canSend || !userText.trim()}
          className="text-white rounded-full px-2 py-2 disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Image src="arrow.svg" alt="Send" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}

export default Transcript;
