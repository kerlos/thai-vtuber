# Thai VTuber

A comprehensive analytics dashboard for Thai VTuber channels, providing real-time statistics, rankings, and insights into the Thai VTuber community. This platform helps users discover and explore Thai VTuber channels with detailed analytics including subscriber counts, video metrics, and activity status.

## Features

- **Channel Analytics**: Browse and explore Thai VTuber channels with detailed statistics
- **Real-time Data**: Live subscriber counts, video metrics, and channel activity status
- **Video Tracking**: Upcoming streams, live content, and trending videos from Thai VTubers
- **Advanced Filtering**: Filter channels by activity status, rebranding status, and search functionality
- **Rankings & Insights**: Comprehensive rankings and analytics for the Thai VTuber community
- **Responsive Design**: Modern, mobile-friendly interface built with Next.js and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
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
- `/components` - Reusable React components
- `/hooks` - Custom React hooks for data fetching
- `/types` - TypeScript type definitions
- `/utils` - Utility functions and helpers

## Data Source

This application is powered by comprehensive data provided by [vtuber.chuysan.com](https://vtuber.chuysan.com/)

### Channel Registration

VTuber channel owners can register their channels directly through the [vtuber registration portal](https://vtuber.kerlos.in.th/register) to ensure their channels are included in the analytics and to keep their information up to date.
