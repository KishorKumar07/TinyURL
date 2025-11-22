# TinyLink - URL Shortener Service


## 🌐 Live Deployment

- **Frontend (Vercel):** [https://tiny-link-frontend-lime.vercel.app](https://tiny-link-frontend-lime.vercel.app)
- **Backend API (Render):** [https://tinylink-backend-tw9p.onrender.com](https://tinylink-backend-tw9p.onrender.com)
- **Health Check:** [https://tinylink-backend-tw9p.onrender.com/healthz](https://tinylink-backend-tw9p.onrender.com/healthz)


## 🎯 About

TinyLink is a URL shortener service that allows users to:
- Create short, memorable links from long URLs
- Use custom short codes (6-8 alphanumeric characters)
- Track click statistics and analytics
- Manage and delete links
- View detailed analytics for each link

The application consists of two main components:
- **Frontend:** Next.js-based React application with a modern UI
- **Backend:** Express.js REST API with PostgreSQL database

## ✨ Features

### Core Functionality
- ✅ **Create Short Links** - Convert long URLs to short, shareable links
- ✅ **Custom Short Codes** - Optionally provide custom codes (6-8 alphanumeric characters)
- ✅ **URL Validation** - Validates URLs before saving
- ✅ **Redirect System** - HTTP 302 redirects to original URLs
- ✅ **Click Tracking** - Automatically tracks clicks and updates statistics
- ✅ **Link Management** - View, search, filter, and delete links
- ✅ **Analytics Dashboard** - Detailed statistics for each link
- ✅ **Health Check** - System monitoring endpoint

### User Interface
- 🎨 **Modern Design** - Clean, polished interface with thoughtful spacing
- 📱 **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- 🔍 **Search & Filter** - Real-time search by code, URL, or title
- 📊 **Data Visualization** - Charts and graphs for analytics
- ⚡ **Loading States** - Skeleton loaders and loading indicators
- ✅ **Form Validation** - Inline validation with helpful error messages
- 🎭 **Error Handling** - User-friendly error messages and alerts

## 🛠️ Technologies

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **Recharts** - Chart library for analytics visualization
- **Lucide React** - Icon library
- **date-fns** - Date utility library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - ORM for database management
- **PostgreSQL** - Database (hosted on Neon)
- **express-validator** - Request validation
- **nanoid** - Short code generation
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Relational database
- **Neon** - Serverless Postgres platform

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

## 📁 Project Structure

```
TinyURL/
├── TinyLink-Frontend/          # Next.js frontend application
│   ├── app/                    # Next.js app directory
│   │   ├── code/[code]/        # Statistics page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Dashboard
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── forms/              # Form components
│   │   ├── links/              # Link-related components
│   │   └── ui/                 # Reusable UI components
│   ├── lib/                    # Utilities
│   │   └── api.ts              # API client
│   ├── store/                  # State management
│   │   └── useLinkStore.ts     # Zustand store
│   ├── types/                  # TypeScript types
│   └── package.json
│
└── TinyLink-Backend/           # Express.js backend API
    ├── src/
    │   ├── controllers/        # Request handlers
    │   ├── routes/             # API routes
    │   ├── middleware/         # Custom middleware
    │   ├── db/                 # Database configuration
    │   ├── utils/              # Utility functions
    │   └── server.js           # Express app entry point
    ├── prisma/
    │   ├── schema.prisma       # Database schema
    │   └── migrations/         # Database migrations
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL database** (or Neon account for free hosting)
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd TinyURL
```

#### 2. Backend Setup

```bash
cd TinyLink-Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # Or create manually
```

Edit the `.env` file:
```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
BASE_URL="http://localhost:3001"
PORT=3000
NODE_ENV=development
```

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

The backend will start on `http://localhost:3000`

#### 3. Frontend Setup

```bash
cd TinyLink-Frontend

# Install dependencies
npm install

# Create .env.local file
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

```bash
# Start development server
npm run dev
```

The frontend will start on `http://localhost:3001`

### Available Scripts

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📡 API Documentation

### Base URL
- **Local:** `http://localhost:3000`
- **Production:** `https://tinylink-backend-tw9p.onrender.com`

### Endpoints

#### Create Link
**POST** `/api/links`

Request body:
```json
{
  "originalUrl": "https://example.com",
  "shortCode": "example"  // optional, 6-8 alphanumeric characters
}
```

Response (201):
```json
{
  "success": true,
  "message": "Short link created successfully",
  "data": {
    "link": {
      "id": "...",
      "shortCode": "example",
      "originalUrl": "https://example.com",
      "shortUrl": "http://localhost:3001/example",
      "clicks": 0,
      "createdAt": "..."
    }
  }
}
```

Error (409) - Code already exists:
```json
{
  "success": false,
  "message": "Short code already exists"
}
```

#### Get All Links
**GET** `/api/links?page=1&limit=10&search=query`

Response:
```json
{
  "success": true,
  "data": {
    "links": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

#### Get Link Stats
**GET** `/api/links/:code`

Response:
```json
{
  "success": true,
  "data": {
    "link": {
      "shortCode": "example",
      "originalUrl": "https://example.com",
      "clicks": 42,
      "lastClicked": "...",
      "analytics": [...]
    }
  }
}
```

#### Delete Link
**DELETE** `/api/links/:code`

Response:
```json
{
  "success": true,
  "message": "Link deleted successfully"
}
```

#### Redirect
**GET** `/:shortCode`

Returns HTTP 302 redirect to original URL and increments click count.

Returns 404 if link doesn't exist or has been deleted.

#### Health Check
**GET** `/healthz`

Response:
```json
{
  "ok": true,
  "version": "1.0"
}
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Application
BASE_URL="http://localhost:3001"
PORT=3000
NODE_ENV=development
```

### Frontend (.env.local)

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production:
```env
NEXT_PUBLIC_API_URL=https://tinylink-backend-tw9p.onrender.com
```

## 🚢 Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Connect repository to Render
3. Create a new Web Service
4. Set environment variables:
   - `DATABASE_URL` - Your Neon PostgreSQL connection string
   - `BASE_URL` - Your frontend URL
   - `NODE_ENV=production`
5. Set build command: `npm install && npm run prisma:generate`
6. Set start command: `npm start`
7. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL
4. Deploy

### Database Setup (Neon)

1. Create a free account on [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Use it as `DATABASE_URL` in your backend environment variables

## 📊 Database Schema

### Link Model
- `id` - Unique identifier
- `shortCode` - Short code (6-8 alphanumeric, unique)
- `originalUrl` - Original long URL
- `title` - Optional title
- `description` - Optional description
- `clicks` - Total click count
- `isActive` - Whether link is active
- `expiresAt` - Optional expiration date
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Analytics Model
- `id` - Unique identifier
- `linkId` - Reference to Link
- `ipAddress` - Visitor IP address
- `userAgent` - Browser user agent
- `referer` - Referrer URL
- `country` - Visitor country
- `city` - Visitor city
- `deviceType` - Device type (mobile/desktop/tablet)
- `browser` - Browser name
- `os` - Operating system
- `clickedAt` - Click timestamp

## ✅ Testing Checklist

The application follows the specification for automated testing:

- ✅ `/healthz` returns 200
- ✅ Creating a link works
- ✅ Duplicate codes return 409
- ✅ Redirect works and increments click count
- ✅ Deletion stops redirect (404)
- ✅ UI meets expectations (layout, states, form validation, responsiveness)

## 📝 Code Rules

- Short codes follow pattern: `[A-Za-z0-9]{6,8}`
- Custom codes are globally unique
- Deleted links return 404
- Redirects use HTTP 302
- All endpoints follow RESTful conventions


## 📄 License

ISC



