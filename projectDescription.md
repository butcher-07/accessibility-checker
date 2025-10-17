# Accessibility Scanner

A comprehensive web accessibility analysis tool that crawls websites and identifies WCAG compliance issues in real-time.

## Features

### 🔍 Comprehensive Accessibility Analysis
- **WCAG Compliance Checking**: Detects violations against Web Content Accessibility Guidelines using Axe-core
- **Impact Classification**: Categorizes issues by severity (Critical, Serious, Moderate, Minor)
- **Detailed Reporting**: Provides context, selectors, and remediation suggestions for each issue
- **WCAG Criteria Mapping**: Links issues to specific WCAG success criteria

### 🕷️ Intelligent Web Crawling
- **Link Discovery**: Automatically discovers and analyzes internal links
- **Domain-Scoped Analysis**: Restricts crawling to the target domain
- **Smart Filtering**: Excludes communication links (mailto, tel, etc.) and external URLs
- **URL Normalization**: Handles relative URLs, removes parameters and fragments for consistency
- **Duplicate Prevention**: Avoids reprocessing the same URLs

### ⚡ Performance Optimized
- **Browser Pool**: Maintains a pool of 3 Puppeteer browsers for parallel processing
- **Batch Processing**: Processes URLs in batches of 10 with 3 parallel workers
- **Resource Optimization**: Blocks images, fonts, and media during analysis for faster loading
- **Retry Logic**: Implements robust error handling with automatic retries

### 📊 Real-time Progress Tracking
- **WebSocket Integration**: Live progress updates during analysis
- **Batch Progress**: Shows current batch being processed
- **URL Counter**: Displays processed vs remaining URLs
- **Cancellation Support**: Allows users to stop analysis mid-process

### 💾 Data Management
- **SQLite Database**: Stores URL crawl state and processing status
- **Drizzle ORM**: Type-safe database operations with schema validation
- **Automatic Cleanup**: Clears previous analysis data on new scans

### 📤 Export Capabilities
- **CSV Export**: Export findings in spreadsheet-friendly format
- **JSON Export**: Machine-readable format for integration with other tools
- **Comprehensive Reports**: Include all issue details, WCAG mapping, and remediation guidance

## Technology Stack

### Backend
- **Express.js**: RESTful API server with TypeScript
- **Puppeteer**: Headless browser automation for page analysis
- **Axe-core**: Industry-standard accessibility testing engine
- **WebSocket**: Real-time communication with client
- **SQLite + Drizzle ORM**: Database management with type safety
- **Cheerio**: Server-side HTML parsing for link extraction

### Frontend
- **React 18**: Modern UI with hooks and functional components
- **Vite**: Fast build tool and development server
- **Wouter**: Lightweight client-side routing
- **TanStack Query**: Server state management and caching
- **Tailwind CSS**: Utility-first styling framework
- **shadcn/ui**: Accessible component library built on Radix UI
- **Framer Motion**: Smooth animations and transitions

### Development Tools
- **TypeScript**: Full type safety across the stack
- **ESBuild**: Fast production builds
- **Zod**: Runtime type validation and schema definition

## Architecture

### Monorepo Structure
```
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route components
│   │   ├── lib/         # Utilities and configurations
│   │   └── hooks/       # Custom React hooks
├── server/          # Express.js backend
│   ├── index.ts     # Server entry point
│   ├── routes.ts    # API route definitions
│   ├── utils.ts     # URL processing utilities
│   └── vite.ts      # Development server integration
├── db/              # Database layer
│   ├── schema.ts    # Database schema definitions
│   └── index.ts     # Database connection
└── package.json     # Dependencies and scripts
```

### Database Schema

#### URLs Table
- `id`: Primary key (auto-increment)
- `url`: Unique URL being analyzed
- `parentUrl`: URL that linked to this page
- `domain`: Domain for scoping analysis
- `processed`: Boolean flag for tracking completion
- `createdAt`: Timestamp of URL discovery

#### Users Table
- `id`: Primary key (auto-increment)
- `username`: Unique username
- `password`: Hashed password
- *(Currently unused - prepared for future authentication)*

### API Endpoints

#### POST `/api/check`
Initiates accessibility analysis for a given URL.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "issues": [...],
  "processedUrls": [...],
  "totalProcessed": 15,
  "cancelled": false
}
```

#### GET `/api/pending-urls`
Retrieves unprocessed URLs for a domain.

**Query Parameters:**
- `domain`: Target domain to query

### WebSocket Events

#### Client → Server
- `cancel`: Stop the current analysis

#### Server → Client
- `processing_url`: Currently analyzing URL with remaining count
- `url_processed`: URL completed with updated counters
- `batch_start`: New batch beginning with progress info

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Development Setup
```bash
# Install dependencies
npm install

# Start development server (client + server with hot reload)
npm run dev

# The application will be available at http://localhost:5000
```

### Production Build
```bash
# Build client and server
npm run build

# Start production server
npm start
```

### Database Commands
```bash
# Push schema changes to database
npm run db:push

# Type check the entire project
npm run check
```

## Usage

1. **Enter URL**: Input the website URL you want to analyze
2. **Start Analysis**: Click "Check Accessibility" to begin crawling
3. **Monitor Progress**: Watch real-time updates as pages are processed
4. **Review Results**: Examine issues categorized by severity level
5. **Export Reports**: Download findings in CSV or JSON format
6. **Cancel Anytime**: Stop analysis if needed - partial results will be shown

### Understanding Results

**Issue Severity Levels:**
- **Critical**: Blocks accessibility for many users
- **Serious**: Significant barriers to accessibility
- **Moderate**: Some accessibility barriers
- **Minor**: Minor accessibility improvements needed

**Issue Information:**
- **Message**: Description of the accessibility problem
- **Context**: HTML snippet where the issue was found
- **Selector**: CSS selector to locate the problematic element
- **WCAG Criteria**: Relevant WCAG success criteria
- **Suggestion**: How to fix the issue
- **Source URL**: Which page contained this issue

## Configuration

### Browser Settings
The application is configured for various deployment environments including Replit, with optimized Puppeteer settings for performance and compatibility.

### Path Aliases
- `@db` → Database connection and schema
- `@/*` → Client source directory

### Environment Variables
The application automatically detects the environment and adjusts accordingly:
- Development: Uses Vite dev server with hot reload
- Production: Serves static files from build output

## Performance & Processing Logic

### Parallel URL Processing Architecture

The system uses **true parallel processing** with intelligent URL discovery and real-time progress tracking:

#### **Core Processing Flow:**
1. **Initial URL**: User submits a starting URL
2. **Link Discovery**: Each analyzed page discovers internal links via DOM crawling
3. **Parallel Analysis**: Multiple URLs (up to 5) analyze simultaneously using separate Puppeteer instances
4. **Real-time Results**: Each completed URL immediately sends results via WebSocket
5. **Dynamic URL Queue**: New discovered links are added to the processing queue in real-time

#### **URL Counter Logic:**
```javascript
// Predictive counter system prevents fluctuating numbers
totalUrlsDiscovered = initialUrls + newlyDiscoveredUrls
totalUrlsCompleted = fullyProcessedUrls
inProgressUrls = currentlyBeingAnalyzed (for race condition prevention only)

// Remaining count only decreases when URLs actually complete processing
remainingUrls = totalUrlsDiscovered - totalUrlsCompleted
```

**Key Behavior:**
- ✅ Count only decreases when URLs finish processing (not when they start)
- ✅ In-progress URLs are tracked separately to prevent race conditions
- ✅ New URL discoveries immediately increase the total count
- ✅ Provides accurate "work remaining" vs "work in progress" distinction

#### **Parallel Processing Implementation:**
- **Worker Pool**: Maintains pool of 3 Puppeteer browsers for analysis
- **Concurrent Limit**: Processes 5 URLs simultaneously per batch
- **Batch Management**: Continuously processes batches of 5 URLs until queue is empty
- **Race Condition Prevention**: URLs marked as "in-progress" before analysis starts
- **Dynamic Discovery**: New URLs discovered during crawling are added to queue immediately

#### **Real-time Communication:**
- **WebSocket Events**:
  - `analysis_started`: Initial scan begins
  - `processing_url`: Individual URL analysis starts
  - `url_completed`: Individual URL analysis completes with full results
- **Progressive Results**: Users see accessibility issues as each URL completes
- **Live Counter Updates**: Remaining URL count updates immediately per completion

#### **Performance Optimizations:**
- **Browser Pool**: Maintains 3 concurrent Puppeteer instances for parallel execution
- **Resource Blocking**: Images, fonts, and media are blocked during analysis for speed
- **Network Idle Strategy**: Waits for network activity to settle before analysis
- **Timeout Handling**: 15-second timeout per page with automatic retry logic
- **Memory Management**: In-progress URL tracking prevents database race conditions

## Contributing

The codebase follows TypeScript strict mode with comprehensive type safety. Key patterns:
- Functional React components with hooks
- Zod schemas for runtime validation
- Drizzle ORM for type-safe database operations
- Error boundaries and graceful degradation
- Responsive design with Tailwind CSS

## License

MIT License