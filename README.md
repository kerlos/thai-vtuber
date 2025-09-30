# Thai VTuber

A comprehensive analytics dashboard for Thai VTuber channels, providing real-time statistics, rankings, and insights into the Thai VTuber community. This platform helps users discover and explore Thai VTuber channels with detailed analytics including subscriber counts, video metrics, and activity status.

## Features

- **Channel Analytics**: Browse and explore Thai VTuber channels with detailed statistics
- **Real-time Data**: Live subscriber counts, video metrics, and channel activity status
- **Video Tracking**: Upcoming streams, live content, and trending videos from Thai VTubers
- **Advanced Filtering**: Filter channels by activity status, rebranding status, and search functionality
- **Rankings & Insights**: Comprehensive rankings and analytics for the Thai VTuber community
- **Internationalization**: Full support for English and Thai languages with automatic fallback
- **Responsive Design**: Modern, mobile-friendly interface built with Next.js and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Internationalization**: next-intl
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Getting Started

This project uses [pnpm](https://pnpm.io/) as the package manager. Make sure you have pnpm installed:

```bash
npm install -g pnpm
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Build the application for production:

```bash
pnpm build
```

### Start Production Server

Start the production server:

```bash
pnpm start
```

## Project Structure

- `/app` - Next.js app router pages and API routes
  - `/[locale]` - Internationalized pages (English and Thai)
- `/components` - Reusable React components
- `/hooks` - Custom React hooks for data fetching
- `/messages` - i18n translation files (en.json, th.json)
- `/types` - TypeScript type definitions
- `/utils` - Utility functions and helpers

## Internationalization

The application supports both English and Thai languages. The i18n implementation uses `next-intl` with:

- **Automatic Language Detection**: Based on user's browser preferences
- **Language Switcher**: Easy switching between English and Thai
- **Message Keys**: Uses the original English text as translation keys
- **Fallback**: Displays the original message if no translation exists

### Supported Languages

- English (en) - Default
- Thai (th)

### Adding Translations

1. Add new translation keys to both `/messages/en.json` and `/messages/th.json`
2. Use the key as the original English message
3. The system will automatically fall back to the key if a translation is missing

## Data Source

This application is powered by comprehensive data provided by [vtuber.chuysan.com](https://vtuber.chuysan.com/)

### Channel Registration

VTuber channel owners can register their channels directly through the [vtuber registration portal](https://vtuber.kerlos.in.th/register) to ensure their channels are included in the analytics and to keep their information up to date.
