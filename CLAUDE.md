# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle (client + server)
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

### Database
- Database operations use Drizzle ORM with SQLite
- Local SQLite database file: `./accessibility.db`
- Schema defined in `db/schema.ts`
- Connection configured in `db/index.ts`

## Architecture Overview

### Full-Stack Structure
This is a monorepo containing both client and server code:

**Client (`/client`)**
- React SPA using Vite for bundling
- Wouter for routing instead of React Router
- TanStack Query for server state management
- Tailwind CSS + shadcn/ui components
- Main entry: `client/src/App.tsx`

**Server (`/server`)**
- Express.js backend with TypeScript
- WebSocket support for real-time communication
- Database: PostgreSQL with Drizzle ORM
- Main entry: `server/index.ts`

### Key Application Flow
1. **Web Accessibility Scanner**: Users input URLs for accessibility analysis
2. **Batch Processing**: Analyzes pages in batches of 5 using Puppeteer + Axe-core
3. **Link Discovery**: Crawls internal links and stores them in database
4. **Real-time Updates**: WebSocket connection provides progress updates
5. **WCAG Compliance**: Reports violations with WCAG criteria mapping

### Database Schema
- `users` table: User authentication (currently unused)
- `urls` table: Tracks discovered URLs and processing status
  - `url`, `parentUrl`, `domain`, `processed` fields
  - Used to manage crawl state and prevent reprocessing

### Path Aliases
TypeScript paths configured in `tsconfig.json`:
- `@db` → `./db/index.ts`
- `@db/*` → `./db/*`
- `@/*` → `./client/src/*`

## Key Technical Details

### Puppeteer Configuration
- Configured for Replit environment with specific Chromium path
- Headless mode with security flags for sandboxed environments
- Network idle wait strategy for SPA compatibility

### WebSocket Integration
- Real-time progress updates during batch processing
- Cancel functionality to stop analysis mid-process
- Connected at `/ws` endpoint

### Build System
- Vite for client bundling
- ESBuild for server bundling
- Development mode uses Vite dev server integration

### Accessibility Analysis
- Uses `@axe-core/puppeteer` for WCAG compliance checking
- Categorizes issues by impact: critical, serious, moderate, minor
- Extracts WCAG criteria tags and formats them for reporting
- Provides context, selectors, and remediation suggestions

### Component Structure
- `shadcn/ui` components in `client/src/components/ui/`
- Custom components: `UrlForm`, `AccessibilityResults`, `CheckProgress`
- Main page: `Home.tsx` orchestrates form and results display

## Environment Notes
- Built for Replit deployment (see `.replit` config)
- Uses Nix for package management
- Local SQLite database for simple setup - no external database required
- Database file `accessibility.db` created automatically on first run