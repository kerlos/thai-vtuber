import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { QueryProvider } from "@/components/QueryProvider";
import { AppLayout } from "@/components/AppLayout";
import { GoogleAnalytics } from '@next/third-parties/google';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const googleAnalyticId = process.env.NEXT_PUBLIC_GTAG_ID;

export const metadata: Metadata = {
  title: "Thai VTuber",
  description: "Analytics dashboard for Thai VTuber channels with statistics, rankings, and insights",
  openGraph: {
    title: "Thai VTuber",
    description: "Analytics dashboard for Thai VTuber channels with statistics, rankings, and insights",
    url: "https://vtuber.kerlos.in.th",
    siteName: "Thai VTuber",
    images: [
      {
        url: "https://vtuber.kerlos.in.th/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "Thai VTuber Analytics Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      {googleAnalyticId && (
        <GoogleAnalytics gaId={googleAnalyticId} />
      )}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
