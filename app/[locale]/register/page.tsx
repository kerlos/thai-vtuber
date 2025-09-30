'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader, AlertCircle, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

interface ChannelIdResponse {
  channelId: string;
}

interface RegisterResponse {
  message: string;
}

export default function SubmitChannelPage() {
  const t = useTranslations();
  const [channelUrl, setChannelUrl] = useState('');
  const [channelType, setChannelType] = useState<'1' | '2'>('1');
  const [fetchedChannelId, setFetchedChannelId] = useState<string | null>(null);

  // Mutation to lookup channel ID from URL
  const lookupMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await fetch('/api/youtube/id-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelUrl: url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch channel ID');
      }

      return response.json() as Promise<ChannelIdResponse>;
    },
    onSuccess: (data) => {
      setFetchedChannelId(data.channelId);
    },
  });

  // Mutation to register the channel
  const registerMutation = useMutation({
    mutationFn: async ({ channelId, channelType }: { channelId: string; channelType: string }) => {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId, channelType }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.error || 'Failed to register channel');
      }

      return response.json() as Promise<RegisterResponse>;
    },
    onSuccess: () => {
      // Reset form on success
      setChannelUrl('');
      setChannelType('1');
      setFetchedChannelId(null);
      lookupMutation.reset();
    },
  });

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelUrl.trim()) return;
    
    lookupMutation.mutate(channelUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fetchedChannelId) return;

    registerMutation.mutate({
      channelId: fetchedChannelId,
      channelType,
    });
  };

  const handleReset = () => {
    setChannelUrl('');
    setFetchedChannelId(null);
    lookupMutation.reset();
    registerMutation.reset();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('Submit a Channel')}</h1>
        <p className="mt-2 text-gray-600">
          {t('Submit a Thai VTuber channel to be included in our database')}
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        {/* Step 1: Channel URL Lookup */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('Step 1: Enter Channel URL')}
          </h2>
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label htmlFor="channelUrl" className="block text-sm font-medium text-gray-700 mb-2">
                {t('YouTube Channel URL')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="channelUrl"
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  placeholder="https://www.youtube.com/@channelname"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={lookupMutation.isPending || Boolean(fetchedChannelId)}
                />
                {!fetchedChannelId && (
                  <button
                    type="submit"
                    disabled={!channelUrl.trim() || lookupMutation.isPending}
                    className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {lookupMutation.isPending ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        {t('lookingUp')}
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4" />
                        {t('Lookup')}
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {t('enterChannelUrlHint')}
              </p>
            </div>

            {/* Lookup Error */}
            {lookupMutation.isError && (
              <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">{t('Failed to lookup channel')}</p>
                  <p className="text-sm text-red-600 mt-1">
                    {lookupMutation.error instanceof Error ? lookupMutation.error.message : t('Unknown error')}
                  </p>
                </div>
              </div>
            )}

            {/* Channel Found Success */}
            {fetchedChannelId && (
              <div className="flex items-start gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">{t('Channel found!')}</p>
                  <p className="text-sm text-green-600 mt-1 font-mono break-all">
                    {t('Channel ID:') + ' ' + fetchedChannelId}
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="cursor-pointer text-sm text-green-700 hover:text-green-800 underline mt-2"
                  >
                    {t('Use a different channel')}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Step 2: Channel Type and Submit */}
        {fetchedChannelId && (
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('Step 2: Select Channel Type')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('Channel Type')}
                </label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="radio"
                      name="channelType"
                      value="1"
                      checked={channelType === '1'}
                      onChange={(e) => setChannelType(e.target.value as '1' | '2')}
                      className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{t('Original Vtuber')}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {t('Thai VTubers who started as VTubers')}
                      </div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="radio"
                      name="channelType"
                      value="2"
                      checked={channelType === '2'}
                      onChange={(e) => setChannelType(e.target.value as '1' | '2')}
                      className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{t('All Vtuber')}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {t('All VTubers including those who rebranded')}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="cursor-pointer flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      {t('submitting')}
                    </>
                  ) : (
                    t('Submit Channel')
                  )}
                </button>
              </div>

              {/* Register Error */}
              {registerMutation.isError && (
                <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">{t('Failed to submit channel')}</p>
                    <p className="text-sm text-red-600 mt-1">
                      {registerMutation.error instanceof Error ? registerMutation.error.message : t('Unknown error')}
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Register Success - Shown outside Step 2 so it remains visible after reset */}
        {registerMutation.isSuccess && (
          <div className="flex items-start gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">{t('Registration successful!')}</p>
              <p className="text-sm text-green-600 mt-1">
                {t('channelSubmittedMessage')}
              </p>
              <div className="flex gap-3 mt-3">
                <Link
                  href="/"
                  className="inline-block text-sm text-green-700 hover:text-green-800 underline font-medium"
                >
                  {t('Return to home page')}
                </Link>
                <button
                  type="button"
                  onClick={() => registerMutation.reset()}
                  className="cursor-pointer text-sm text-green-700 hover:text-green-800 underline font-medium"
                >
                  {t('Submit another channel')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          {t('Submission Guidelines')}
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>{t('Only Thai VTuber channels should be submitted')}</li>
          <li>{t('The channel must be active on YouTube')}</li>
          <li>{t('Choose "Original Vtuber" for channels that started as VTubers')}</li>
          <li>{t('Choose "All Vtuber" for channels that rebranded to VTubers')}</li>
        </ul>
      </div>
    </div>
  );
}
