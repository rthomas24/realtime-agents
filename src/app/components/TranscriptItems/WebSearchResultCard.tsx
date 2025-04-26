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
    <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden my-2 border border-gray-200 max-w-md transform transition-shadow duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
      {imageUrl && (
        <div className="relative w-full h-36 bg-gray-100 flex items-center justify-center border-b border-gray-200">
          <Image src={imageUrl!} alt={title || 'Search Result Image'} fill className="object-contain p-1" />
        </div>
      )}
      <div className="p-4">
        {title && (
          <h3 className="text-md font-semibold text-gray-800 mb-1 break-words">
            {title}
          </h3>
        )}
        {link && (
          <div className="flex items-center text-xs text-gray-500 mb-2">
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
              className="truncate text-indigo-600 hover:underline"
            >
              {displayUrl}
            </a>
          </div>
        )}
        {description && (
          <div className="text-sm text-gray-700 break-words">
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
              className="text-xs text-blue-500 mt-1 hover:underline focus:outline-none"
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
