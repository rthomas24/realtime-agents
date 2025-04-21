import React from 'react';

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
  const displayUrl = link?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden my-2 border border-gray-200 max-w-md hover:shadow-md transition-shadow duration-200">
      {imageUrl && (
        <div className="w-full h-36 bg-gray-100 flex items-center justify-center border-b border-gray-200">
          <img src={imageUrl} alt={title || 'Search Result Image'} className="max-h-full max-w-full object-contain p-1" />
        </div>
      )}
      <div className="p-4">
        {title && (
          <h3 className="text-md font-semibold text-gray-800 mb-1 break-words">
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 hover:underline">
                {title}
              </a>
            ) : (
              title
            )}
          </h3>
        )}
        {link && (
           <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-700 hover:text-emerald-800 hover:underline mb-2 block truncate">
               {displayUrl}
           </a>
        )}
        {description && (
          <div className="text-sm text-gray-700 break-words max-h-32 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-gray-100">
             <p className="leading-relaxed">{description}</p> 
          </div>
        )}
      </div>
    </div>
  );
};

export default WebSearchResultCard;
