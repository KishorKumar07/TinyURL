# TinyLink Frontend

Modern, responsive web application for TinyLink URL shortener built with Next.js and React.

## 🚀 Deployment

**Live URL:** https://tiny-link-frontend-lime.vercel.app

## 📋 What's Implemented

### Core Features
- ✅ **Dashboard** - Main page for managing all links
- ✅ **Create Short Links** - Form to create new short URLs with optional custom codes
- ✅ **Link Management** - View, search, and delete links
- ✅ **Statistics Page** - Detailed analytics for individual links
- ✅ **Search & Filter** - Search links by code, URL, or title
- ✅ **Pagination** - Navigate through multiple pages of links
- ✅ **Copy to Clipboard** - One-click copy for short URLs
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Dashboard - List all links, create new links, search/filter |
| `/code/:code` | Statistics page - View detailed analytics for a specific link |
| `/healthz` | Health check endpoint |

### UI/UX Features
- **Clean Interface** - Modern, polished design with thoughtful spacing
- **Loading States** - Skeleton loaders and loading indicators
- **Error Handling** - User-friendly error messages and alerts
- **Form Validation** - Inline validation with helpful error messages
- **Empty States** - Informative messages when no data is available
- **Animations** - Smooth transitions and animations for better UX
- **Responsive Tables** - Adapts to different screen sizes
- **Modal Dialogs** - For creating links and confirmations

### Analytics Dashboard
- **Click Statistics** - Total clicks, last clicked time
- **Charts & Graphs** - Visual representation of click data
- **Device Analytics** - Breakdown by device type, browser, OS
- **Time-based Analytics** - Daily/weekly click trends
- **Recent Activity** - Latest clicks with detailed information

## 🛠️ Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **Recharts** - Chart library for analytics visualization
- **Lucide React** - Icon library
- **date-fns** - Date utility library

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (or use deployed backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TinyLink-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://tinylink-backend-tw9p.onrender.com
   ```
   
   For local development:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will start on port 3001. Open [http://localhost:3001](http://localhost:3001) in your browser.
   
   **Note:** The frontend runs on port 3001 to avoid conflicts with the backend which runs on port 3000.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Features in Detail

### Dashboard (`/`)
- **Link Table** - Displays all links with:
  - Short code
  - Target URL (truncated with ellipsis)
  - Total clicks
  - Last clicked time
  - Actions (view stats, delete)
- **Create Link Modal** - Form with:
  - Original URL input (with validation)
  - Optional custom short code (6-8 alphanumeric)
  - Optional title and description
  - Optional expiration date
- **Search Bar** - Real-time search with debouncing
- **Pagination** - Navigate through pages of links

### Statistics Page (`/code/:code`)
- **Overview Cards** - Key metrics at a glance
- **Charts** - Multiple chart types:
  - Line chart for click trends
  - Bar chart for daily clicks
  - Pie chart for device distribution
- **Recent Activity** - Table of recent clicks with details
- **Link Information** - Original URL, short URL, creation date
- **Copy Functionality** - Easy copy buttons for URLs

### Components
- **LinkTable** - Responsive table component
- **CreateLinkForm** - Form with validation
- **Modal** - Reusable modal dialog
- **Alert** - Error/success notifications
- **Button** - Consistent button styling
- **Input** - Form input components
- **Skeleton** - Loading state placeholders
- **CopyButton** - One-click copy functionality

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (required)

### Tailwind Configuration

The project uses Tailwind CSS with custom configuration for:
- Color scheme (primary, secondary colors)
- Animations
- Responsive breakpoints
- Custom utilities

## 📁 Project Structure

```
TinyLink-Frontend/
├── app/
│   ├── code/
│   │   └── [code]/
│   │       └── page.tsx      # Statistics page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Dashboard
│   └── globals.css           # Global styles
├── components/
│   ├── forms/
│   │   └── CreateLinkForm.tsx
│   ├── links/
│   │   └── LinkTable.tsx
│   └── ui/                   # Reusable UI components
├── lib/
│   └── api.ts                # API client
├── store/
│   └── useLinkStore.ts       # Zustand state management
├── types/
│   └── index.ts              # TypeScript types
├── package.json
└── README.md
```

## 🎯 Key Features

### State Management
- Uses Zustand for global state
- Manages links, pagination, search, loading states
- Optimistic updates for better UX

### API Integration
- Centralized API client using Axios
- Type-safe API calls with TypeScript
- Error handling and retry logic

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interactions

### Performance
- Client-side routing with Next.js
- Optimized re-renders
- Debounced search input
- Lazy loading for charts

## 🚀 Deployment

The frontend is deployed on Vercel. To deploy:

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable `NEXT_PUBLIC_API_URL`
4. Deploy

## 📄 License

ISC

