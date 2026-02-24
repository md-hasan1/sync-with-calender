# Google Calendar Sync - Copilot Instructions

## Project Overview
A full-stack Next.js application with TypeScript that automatically syncs events from Google Calendar to a personal calendar interface.

## Technology Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **API Integration**: Google Calendar API v3
- **Package Manager**: npm

## Project Structure
```
├── app/
│   ├── api/              # API routes (auth, sync, events)
│   ├── components/       # React components
│   ├── dashboard/        # Dashboard page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── services/             # Business logic
│   ├── googleCalendarService.ts
│   └── calendarSyncService.ts
├── lib/                  # Utilities
└── .env.local           # Environment variables
```

## Setup Instructions

### 1. Environment Setup
- Copy `.env.example` to `.env.local`
- Add your Google OAuth credentials:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback`

### 2. Google Cloud Setup
1. Create a project in Google Cloud Console
2. Enable Google Calendar API
3. Create OAuth 2.0 Desktop Application credentials
4. Add redirect URI: `http://localhost:3000/api/auth/callback`

### 3. Installation
```bash
npm install
```

### 4. Development
```bash
npm run dev
```
Visit `http://localhost:3000`

### 5. Production Build
```bash
npm run build
npm run start
```

## Key Features Implemented

### Authentication
- OAuth 2.0 integration with Google
- Secure credential storage in HTTP-only cookies
- Login/logout functionality

### Calendar Sync
- Automatic sync every hour
- Manual sync via dashboard button
- Event caching and transformation

### UI Components
- Calendar month view with event display
- Event list view with details
- Dashboard with sync controls
- Responsive design

### API Endpoints
- `GET/POST /api/sync` - Sync events
- `GET /api/events` - Fetch events
- `GET /api/auth/login` - Initiate OAuth
- `GET /api/auth/callback` - OAuth callback

## Important Notes

1. **Security**: Credentials use HTTP-only cookies (dev only, needs DB in production)
2. **State Management**: In-memory sync service (stateless, use DB for persistence)
3. **Sync Interval**: Configurable via `SYNC_INTERVAL` environment variable
4. **Date Range**: Syncs events 1 month back, 2 months forward

## Development Checklist

- [x] Project scaffolding with Next.js
- [x] TypeScript setup
- [x] Google Calendar API integration
- [x] Authentication flow
- [x] Calendar sync service
- [x] Calendar UI component
- [x] Event list component
- [x] Dashboard page
- [x] Landing page
- [x] API routes

## Future Enhancements

- Implement user database for persistent credentials
- Support multiple calendars
- Event creation through the app
- Notifications for upcoming events
- Dark mode
- Multi-language support

## Troubleshooting

### Authentication Issues
- Check Google Cloud Console OAuth settings
- Verify redirect URI matches exactly
- Ensure credentials are in `.env.local`

### Sync Issues
- Verify Google Calendar API is enabled
- Check browser console for errors
- Ensure calendar has events in the date range

### Build Issues
- Run `npm install` to ensure all dependencies
- Check TypeScript errors with `npm run lint`
