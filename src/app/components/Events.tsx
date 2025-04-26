"use client";

import React, { useRef, useEffect, useState } from "react";
import { useEvent } from "@/app/contexts/EventContext";
import { LoggedEvent } from "@/app/types";

export interface EventsProps {
  isExpanded: boolean;
}

function Events({ isExpanded }: EventsProps) {
  const [prevEventLogs, setPrevEventLogs] = useState<LoggedEvent[]>([]);
  const eventLogsContainerRef = useRef<HTMLDivElement | null>(null);

  const { loggedEvents, toggleExpand } = useEvent();

  const getDirectionArrow = (direction: string) => {
    if (direction === "client") return { symbol: "▲", color: "#7f5af0" };
    if (direction === "server") return { symbol: "▼", color: "#2cb67d" };
    return { symbol: "•", color: "var(--foreground)" };
  };

  useEffect(() => {
    const hasNewEvent = loggedEvents.length > prevEventLogs.length;

    if (isExpanded && hasNewEvent && eventLogsContainerRef.current) {
      eventLogsContainerRef.current.scrollTop =
        eventLogsContainerRef.current.scrollHeight;
    }

    setPrevEventLogs(loggedEvents);
  }, [loggedEvents, isExpanded]);

  return (
    <div
      className={
        (isExpanded ? "w-1/2 overflow-auto" : "w-0 overflow-hidden opacity-0") +
        " transition-all rounded-xl duration-200 ease-in-out flex flex-col"
      }
      ref={eventLogsContainerRef}
      style={{ 
        backgroundColor: 'var(--card-bg)', 
        borderColor: 'var(--card-border)', 
        borderWidth: isExpanded ? '1px' : '0' 
      }}
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
            Logs
          </div>
          <div>
            {loggedEvents.map((log) => {
              const arrowInfo = getDirectionArrow(log.direction);
              const isError =
                log.eventName.toLowerCase().includes("error") ||
                log.eventData?.response?.status_details?.error != null;

              return (
                <div
                  key={log.id}
                  className="border-t py-2 px-6 font-mono"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div
                    onClick={() => toggleExpand(log.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center flex-1">
                      <span
                        style={{ color: arrowInfo.color }}
                        className="ml-1 mr-2"
                      >
                      {arrowInfo.symbol}
                      </span>
                      <span
                        className="flex-1 text-sm"
                        style={{ 
                          color: isError ? '#ef4444' : 'var(--foreground)'
                        }}
                      >
                        {log.eventName}
                      </span>
                    </div>
                    <div 
                      className="ml-1 text-xs whitespace-nowrap"
                      style={{ color: 'var(--foreground)', opacity: '0.6' }}
                    >
                      {log.timestamp}
                    </div>
                  </div>

                  {log.expanded && log.eventData && (
                    <div style={{ color: 'var(--foreground)' }}>
                      <pre 
                        className="border-l-2 ml-1 whitespace-pre-wrap break-words font-mono text-xs mb-2 mt-2 pl-2"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        {JSON.stringify(log.eventData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
