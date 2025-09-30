'use client';

import { Search, Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DashboardFilters } from '@/types/vtuber';

interface SearchAndFiltersProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  totalResults: number;
}

export const SearchAndFilters = ({ filters, onFiltersChange, totalResults }: SearchAndFiltersProps) => {
  const t = useTranslations();
  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleShowOriginalVtuberChange = (showOriginalVtuber: boolean) => {
    onFiltersChange({ ...filters, showOriginalVtuber });
  };

  const handleShowInactiveChange = (showInactive: boolean) => {
    onFiltersChange({ ...filters, showInactive });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-4 h-4" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="show-inactive"
                  checked={filters.showInactive}
                  onChange={(e) => handleShowInactiveChange(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <label htmlFor="show-inactive" className="text-sm font-medium text-gray-700 cursor-pointer">
                  {t('Show inactive channels')}
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-original-vtuber"
                checked={filters.showOriginalVtuber}
                onChange={(e) => handleShowOriginalVtuberChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
              />
              <label htmlFor="show-original-vtuber" className="text-sm font-medium text-gray-700 cursor-pointer">
                {t('Show original vtuber')}
              </label>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

