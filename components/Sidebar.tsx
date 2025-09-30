'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { 
  BarChart3, 
  Home, 
  Menu, 
  X,
  ChevronLeft,
  Activity,
  Play,
  ExternalLink,
  Plus,
  Github
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

export const Sidebar = ({ isCollapsed, onToggle, isMobileOpen, onMobileToggle }: SidebarProps) => {
  const pathname = usePathname();
  const t = useTranslations();
  
  const navigation = [
    { name: t('Home'), href: '/', icon: Home },
    { name: t('Videos'), href: '/videos', icon: Play },
    { name: t('Analytics'), href: '/analytics', icon: BarChart3 },
  ];

  const NavItem = ({ item, mobile = false }: { item: typeof navigation[0]; mobile?: boolean }) => {
    const isActive = pathname === item.href;
    
    return (
      <Link
        href={item.href}
        onClick={() => mobile && onMobileToggle()}
        className={`
          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
          ${isActive 
            ? 'bg-blue-100 text-blue-700' 
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          }
          ${isCollapsed && !mobile ? 'justify-center px-2' : ''}
        `}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {(!isCollapsed || mobile) && (
          <span className="truncate">{item.name}</span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Desktop Sidebar */}
      <div 
        className={`
          fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-30 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
          hidden lg:flex flex-col
        `}
      >
        {/* Header */}
        <div className={`flex items-center p-4 border-b border-gray-200 ${
          isCollapsed ? 'flex-col gap-2' : 'justify-between'
        }`}>
          <div className="flex items-center gap-2 justify-center">
            <Image 
              src="/images/logo.jpg" 
              alt="Thai Vtubers Logo" 
              width={isCollapsed ? 32 : 128}
              height={isCollapsed ? 32 : 128}
              className={`rounded-lg object-cover transition-all duration-300 ${
                isCollapsed ? 'w-8 h-8' : 'w-32 h-32'
              }`}
            />
          </div>
          <button
            onClick={onToggle}
            type='button'
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer text-gray-900"
          >
            <ChevronLeft 
              className={`w-4 h-4 transition-transform text-gray-900 cursor-pointer ${
                isCollapsed ? 'rotate-180' : ''
              }`} 
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavItem item={item} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Submit Channel Section */}
        <div className="px-4 py-2">
          <hr className="border-gray-200 mb-3" />
          <Link
            href="https://vtuber.kerlos.in.th/register"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              text-gray-700 hover:text-gray-900 hover:bg-gray-100
              ${isCollapsed ? 'justify-center px-2' : ''}
            `}
            prefetch={false}
          >
            <Plus className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="truncate">{t('Submit new channel')}</span>
            )}
          </Link>
          
          {/* GitHub Repository Link */}
          <Link
            href="https://github.com/kerlos/thai-vtuber"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              text-gray-700 hover:text-gray-900 hover:bg-gray-100 mt-2
              ${isCollapsed ? 'justify-center px-2' : ''}
            `}
            prefetch={false}
          >
            <Github className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="truncate">{t('Repository')}</span>
            )}
          </Link>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {!isCollapsed && (
            <LanguageSwitcher />
          )}
          <div className={`flex items-center gap-2 text-sm text-gray-700 ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <Activity className="w-4 h-4" />
            {!isCollapsed && (
              <div className="flex flex-col gap-1">
                <div>
                  {t('Made by')}{' '}
                  <Link
                    href="https://www.facebook.com/kerlosth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-600"
                    prefetch={false}
                  >
                    keRLos
                  </Link>
                </div>
                <div className="text-xs text-gray-600">
                  {t('in collaboration with')}{' '}
                  <Link
                    href="https://www.youtube.com/@KamaiSanCh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-600"
                    prefetch={false}
                  >
                    Kamai
                  </Link>
                  {' '}{t('and')}{' '}
                  <Link
                    href="https://x.com/chuymaster/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-600"
                    prefetch={false}
                  >
                    ChuyMaster
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div 
        className={`
          fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out lg:hidden
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Image 
              src="/images/logo.jpg" 
              alt="Thai Vtubers Logo" 
              width={64}
              height={64}
              className="w-16 h-16 rounded-lg object-cover" 
            />
          </div>
          <button
            onClick={onMobileToggle}
            type='button'
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-900" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavItem item={item} mobile />
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Submit Channel Section */}
        <div className="px-4 py-2">
          <hr className="border-gray-200 mb-3" />
          <Link
            href="https://vtuber.kerlos.in.th/register"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onMobileToggle}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            prefetch={false}
          >
            <Plus className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{t('Submit new channel')}</span>
          </Link>
          
          {/* GitHub Repository Link */}
          <Link
            href="https://github.com/kerlos/thai-vtuber"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onMobileToggle}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100 mt-2"
            prefetch={false}
          >
            <Github className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{t('Repository')}</span>
          </Link>
        </div>

        {/* Mobile Footer */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <LanguageSwitcher />
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Activity className="w-4 h-4" />
            <div className="flex flex-col gap-1">
              <div>
                {t('Made by')}{' '}
                <Link
                  href="https://www.facebook.com/kerlosth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-600"
                  prefetch={false}
                >
                  keRLos
                </Link>
              </div>
              <div className="text-xs text-gray-600">
                {t('in collaboration with')}{' '}
                <Link
                  href="https://www.youtube.com/@KamaiSanCh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-600"
                  prefetch={false}
                >
                  kamaitachi
                </Link>
                {' '}{t('and')}{' '}
                <Link
                  href="https://x.com/chuymaster/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-600"
                  prefetch={false}
                >
                  chuymaster
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
