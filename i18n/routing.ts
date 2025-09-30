import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'th'],

  // Used when no locale matches
  defaultLocale: 'en',
  
  // Only use locale prefix for non-default locales
  localePrefix: 'as-needed'
});
