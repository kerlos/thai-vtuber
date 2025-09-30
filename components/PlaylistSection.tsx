'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useYouTubePlaylist } from '@/hooks/useYouTubeData';
import { formatDistanceToNow } from 'date-fns';
import { enUS, th } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';

interface PlaylistSectionProps {
  channelId: string;
}

// Mock playlist data for demonstration
const mockPlaylists = [
  {
    id: 'PLrAXtmRdnEQy8Q8N8Q8Q8Q8Q8Q8Q8Q8Q',
    title: 'Fun Games',
    description: 'Collection of fun and exciting game videos',
    videoCount: 25,
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    lastUpdated: '2024-01-15T10:00:00Z',
  },
  {
    id: 'PLrAXtmRdnEQy123456789abcdefghijk',
    title: 'Tutorials & Learning',
    description: 'Various educational and tutorial videos',
    videoCount: 12,
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    lastUpdated: '2024-01-10T15:30:00Z',
  },
];

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

// Playlist card component
const PlaylistCard = ({ playlist, onSelect, t, locale }: { playlist: any; onSelect: (id: string) => void; t: any; locale: string }) => (
  <div 
    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    onClick={() => onSelect(playlist.id)}
  >
    <div className="relative aspect-video">
      <Image
        unoptimized={true}
        src={playlist.thumbnail}
        alt={playlist.title}
        fill
        className="object-cover"
      />
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
        {playlist.videoCount} {t('videos')}
      </div>
    </div>
    
    <div className="p-4">
      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
        {playlist.title}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
        {playlist.description}
      </p>
      <p className="text-xs text-gray-500">
        {t('Updated')} {formatDate(playlist.lastUpdated, locale, t('Unknown'))}
      </p>
    </div>
  </div>
);

// Playlist detail component
const PlaylistDetail = ({ playlistId, onBack, t, locale }: { playlistId: string; onBack: () => void; t: any; locale: string }) => {
  const { data: videos, isLoading, error } = useYouTubePlaylist(playlistId, 20);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          {t('Back to Playlists')}
        </button>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-32 h-18 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          {t('Back to Playlists')}
        </button>
        <div className="text-center py-8">
          <p className="text-red-600">{t('Unable to load playlist')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Playlists
      </button>
      
      <div className="space-y-4">
        {videos?.map((video, index) => (
          <div key={video.id} className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex-shrink-0 w-8 text-gray-500 text-sm font-medium">
              {index + 1}
            </div>
            
            <div className="relative w-32 aspect-video flex-shrink-0">
              <Image
                unoptimized={true}
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover rounded"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 line-clamp-2 mb-1">
                {video.title}
              </h4>
              <p className="text-sm text-gray-600 mb-1">
                {video.author}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{video.views.toLocaleString()} {t('views')}</span>
                <span>•</span>
                <span>{formatDate(video.published, locale, t('Unknown'))}</span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Link
                href={`https://www.youtube.com/watch?v=${video.videoId}&list=${playlistId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                {t('Play')}
              </Link>
            </div>
          </div>
        )) || (
          <div className="text-center py-8 text-gray-500">
            {t('No videos found in this playlist')}
          </div>
        )}
      </div>
    </div>
  );
};

export default function PlaylistSection({ channelId }: PlaylistSectionProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  if (selectedPlaylist) {
    return (
      <PlaylistDetail 
        playlistId={selectedPlaylist} 
        onBack={() => setSelectedPlaylist(null)}
        t={t}
        locale={locale}
      />
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('Playlists')}</h2>
      
      {mockPlaylists.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('No playlists yet')}</h3>
          <p className="text-gray-500">{t("This channel hasn't created any playlists")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onSelect={setSelectedPlaylist}
              t={t}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
