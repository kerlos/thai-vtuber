'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChannelDetail } from '@/types/vtuber';
import { formatDistanceToNow } from 'date-fns';
import { enUS, th } from 'date-fns/locale';
import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

interface ChannelHeaderProps {
  channel: ChannelDetail;
}

// Format numbers for display
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Format date to relative time
const formatDate = (dateString: string, locale: string, unknownText: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: locale === 'th' ? th : enUS,
    });
  } catch {
    return unknownText;
  }
};

// Enhanced Description Component
function ChannelDescription({ description }: { description: string }) {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // Temporarily remove line-clamp to measure actual content height
      const element = textRef.current;
      const originalClasses = element.className;
      element.className = element.className.replace('line-clamp-10', '');
      
      const computedStyle = window.getComputedStyle(element);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const maxHeight = lineHeight * 10; // 10 lines
      const actualHeight = element.scrollHeight;
      
      // Restore original classes
      element.className = originalClasses;
      
      // Show button if content exceeds 10 lines (with small tolerance for rounding)
      setShowMoreButton(actualHeight > maxHeight + 2);
    }
  }, [description]);

  // Function to render text with clickable links
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.startsWith('http')) {
        return (
          <Link
            key={index}
            href={part}
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  const formattedDescription = description.split('\n').map((line, index, array) => (
    <span key={index}>
      {renderTextWithLinks(line)}
      {index < array.length - 1 && <br />}
    </span>
  ));

  return (
    <div className="mb-3">
      <div
        ref={textRef}
        className={`text-sm text-gray-700 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-none' : 'line-clamp-10'
        }`}
        style={{ whiteSpace: 'pre-line' }}
      >
        {formattedDescription}
      </div>
      
      {showMoreButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer mt-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              <span>{t('Show less')}</span>
              <svg className="w-4 h-4 transform rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          ) : (
            <>
              <span>{t('showMore')}</span>
              <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default function ChannelHeader({ channel }: ChannelHeaderProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Channel Avatar */}
          <div className="flex-shrink-0">
            <Link
              href={`https://www.youtube.com/channel/${channel.channel_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
              prefetch={false}
            >
              <Image
                src={channel.thumbnail_icon_url}
                alt={channel.title}
                unoptimized={true}
                width={128}
                height={128}
                className="w-24 h-24 md:w-24 md:h-24 rounded-full cursor-pointer transform transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-gray-400/30 group-hover:ring-4 group-hover:ring-blue-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.includes('yt3.ggpht.com')) {
                    target.src = target.src.replace('yt3.ggpht.com', 'yt3.googleusercontent.com');
                  }
                }}
              />
            </Link>
          </div>
          
          {/* Channel Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  <Link
                    href={`https://www.youtube.com/channel/${channel.channel_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block relative cursor-pointer transform transition-all duration-300 ease-in-out hover:text-blue-600 hover:scale-105 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
                    prefetch={false}
                  >
                    {channel.title}
                  </Link>
                </h1>
                
                <div className="flex flex-wrap items-center gap-1 mb-3 text-sm text-gray-600">
                  <span>{formatNumber(channel.subscribers)} {t('subscribers')}</span>
                  <span className="mx-1">•</span>
                  <span>{formatNumber(channel.videos)} {t('videos')}</span>
                </div>
                
                {channel.description && (
                  <ChannelDescription description={channel.description} />
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {!channel.is_rebranded && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                    {t('Original Channel')}
                  </span>
                  )}
                  
                  {channel.last_published_video_at && (
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {t('Latest video')} {formatDate(channel.last_published_video_at, locale, t('Unknown'))}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 flex-shrink-0">
                <Link
                  href={`https://www.youtube.com/channel/${channel.channel_id}?sub_confirmation=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  prefetch={false}
                  className="bg-red-700 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-colors inline-block"
                >
                  {t('Subscribe')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}