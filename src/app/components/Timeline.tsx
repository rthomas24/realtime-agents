"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTranscript } from "@/app/contexts/TranscriptContext";
import { TranscriptItem } from "@/app/types";
import WebSearchResultCard from './TranscriptItems/WebSearchResultCard';

export interface TimelineProps {
  isExpanded: boolean;
}

function Timeline({ isExpanded }: TimelineProps) {
  const [prevItems, setPrevItems] = useState<TranscriptItem[]>([]);
  const [timelineItems, setTimelineItems] = useState<TranscriptItem[]>([]);
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);
  const { getTimelineItems } = useTranscript();
  
  useEffect(() => {
    const currentItems = getTimelineItems();
    setTimelineItems(currentItems);
    
    const hasNewItem = currentItems.length > prevItems.length;

    if (isExpanded && hasNewItem && timelineContainerRef.current) {
      timelineContainerRef.current.scrollTop = timelineContainerRef.current.scrollHeight;
    }

    if (hasNewItem) {
      setPrevItems(currentItems);
    }
  }, [isExpanded, getTimelineItems, prevItems.length]);

  return (
    <div
      className={
        (isExpanded ? "w-1/2 overflow-auto" : "w-0 overflow-hidden opacity-0") +
        " transition-all rounded-xl duration-200 ease-in-out flex flex-col"
      }
      ref={timelineContainerRef}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: isExpanded ? '1px' : '0' }}
    >
      {isExpanded && (
        <div>
          <div 
            className="font-semibold px-6 py-4 sticky top-0 z-10 text-base border-b"
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              borderColor: 'var(--border)',
              color: 'var(--foreground)'
            }}
          >
            Timeline
          </div>
          <div className="p-4">
            {timelineItems.length === 0 ? (
              <div 
                className="text-center py-4"
                style={{ color: 'var(--foreground)', opacity: '0.6' }}
              >
                No web search results yet. Ask a question that requires web information.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {timelineItems.map((item) => (
                  <div 
                    key={item.itemId} 
                    className="border-b pb-4"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div 
                      className="text-xs mb-1"
                      style={{ color: 'var(--foreground)', opacity: '0.6' }}
                    >
                      {item.timestamp}
                    </div>
                    <WebSearchResultCard
                      title={item.data?.title}
                      description={item.data?.description}
                      imageUrl={item.data?.imageUrl}
                      link={item.data?.link}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Timeline; 