# Google Calendar Sync Application

A full-stack Next.js application that automatically syncs events from your Google Calendar to a personal calendar interface.

## Features

- 🔐 **OAuth2 Authentication** - Secure Google Calendar integration
- ⚡ **Automatic Sync** - Events sync automatically every hour
- 📅 **Calendar Views** - Both calendar grid and list views
- 🎨 **Modern UI** - Built with Tailwind CSS
- 📱 **Responsive Design** - Works on desktop and mobile
- 🚀 **Full-Stack TypeScript** - Uses Next.js with TypeScript



## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Google API**: Google Calendar API v3
- **Package Manager**: npm

## Prerequisites

Before running this application, you need to:

1. Create a Google Cloud Project
2. Enable the Google Calendar API
3. Create OAuth 2.0 credentials (Desktop Application)
4. Redirect URI: `http://localhost:3000/api/auth/callback`

## Environment Setup

Create `.env.local` with your Google OAuth credentials:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Building for Production

```bash
npm run build
npm run start
```

## Key Features

- **Automatic Sync**: Events sync automatically every hour  
- **Beautiful Calendar View**: Month view with event indicators
- **Event List**: See all upcoming events in a list
- **Secure OAuth**: Google Calendar API integration
- **Responsive Design**: Works on all devices
