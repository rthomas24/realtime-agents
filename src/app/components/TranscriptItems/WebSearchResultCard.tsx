import React, { useState } from 'react';
import Image from 'next/image';

interface WebSearchResultCardProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  link?: string;
}

const WebSearchResultCard: React.FC<WebSearchResultCardProps> = ({ 
  title,
  description,
  imageUrl,
  link 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayUrl = link?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

  return (
    <div 
      className="rounded-lg shadow-sm overflow-hidden my-2 border max-w-md transform transition-shadow duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
      style={{ 
        backgroundColor: 'var(--secondary)',
        borderColor: 'var(--border)',
        boxShadow: '0 1px 2px var(--shadow)'
      }}
    >
      {imageUrl && (
        <div 
          className="relative w-full h-36 flex items-center justify-center border-b"
          style={{ 
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border)'
          }}
        >
          <Image src={imageUrl!} alt={title || 'Search Result Image'} fill className="object-contain p-1" />
        </div>
      )}
      <div className="p-4">
        {title && (
          <h3 
            className="text-md font-semibold mb-1 break-words"
            style={{ color: 'var(--foreground)' }}
          >
            {title}
          </h3>
        )}
        {link && (
          <div 
            className="flex items-center text-xs mb-2"
            style={{ color: 'var(--foreground)', opacity: '0.6' }}
          >
            {/* <Image
              src={`https://www.google.com/s2/favicons?domain=${displayUrl}`}
              alt=""
              width={16}
              height={16}
              className="mr-1"
            /> */}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              {displayUrl}
            </a>
          </div>
        )}
        {description && (
          <div 
            className="text-sm break-words"
            style={{ color: 'var(--foreground)' }}
          >
            <div 
              className={`overflow-y-auto transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-16 overflow-hidden'}`}
            >
              <p className="leading-relaxed">{description}</p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-xs mt-1 hover:underline focus:outline-none"
              style={{ color: 'var(--accent)' }}
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebSearchResultCard;
