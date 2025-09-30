'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Languages } from 'lucide-react';
import { useTransition } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    
    startTransition(() => {
      // @ts-expect-error -- TypeScript will validate that only known locales
      // are used in combination with pathnames. Since the two will always
      // match for the current route, we can skip runtime checks.
      router.replace(pathname, {locale: newLocale});
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Languages className="w-4 h-4 text-gray-600" />
      <select
        value={locale}
        onChange={(e) => switchLocale(e.target.value)}
        disabled={isPending}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 cursor-pointer disabled:opacity-50"
      >
        <option value="en">English</option>
        <option value="th">ไทย</option>
      </select>
    </div>
  );
}
