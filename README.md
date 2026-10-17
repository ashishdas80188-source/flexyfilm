# FlexyFilm — Premium Movie Streaming Platform

> **Your Cinema. Your Language. Your Flex.**

FlexyFilm is an ultra-premium, full-stack MERN movie streaming platform inspired by the modern user experience of Netflix, engineered with original branding, responsive dark cinematic aesthetics, and deep regional linguistic cinema integration across India and the globe.

---

## 🌟 Key Highlights & Features

- 🎬 **Original Visual Identity**: Dark `#080808` background, vivid crimson `#E50914` accents, and custom glassmorphism navigation.
- 🇮🇳 **Regional & Global Cinema Hubs**: Dedicated hubs and filters for:
  - **Bollywood** (Hindi)
  - **Hollywood** (English & Global)
  - **Tollywood** (Telugu)
  - **Ollywood** (Odia)
  - **Sandalwood** (Kannada)
  - **Kollywood** (Tamil) & **Mollywood** (Malayalam)
  - **Regional Cinema** (Punjabi, Bengali, Marathi)
- 🍿 **Cinematic Hero Banner**: Large showcase featuring trending blockbusters with dynamic trailers, synopsis, IMDb ratings, age certifications, and quick play buttons.
- 🔁 **Continue Watching & Watch History**: Real-time progress bar tracking watch time down to the minute, with resume capability.
- 📋 **My List / Personalized Watchlist**: 1-click optimistic bookmarking with instant synchronization.
- 🔍 **Live Search & Multi-Facet Filtering**: Real-time keyword matching across movie titles, actors, directors, genres, languages, and release years.
- 📺 **Official Studio Video Player**: Integrated modal supporting verified YouTube trailer embeds and authorized HTML5 web video streams.
- 🛡️ **Role-Based Admin Console**:
  - Dashboard KPIs (Total Titles, Web Series, Registered Users, Streams Logged)
  - Add, Edit, and Delete Movie Metadata
  - Hero Banner Showcase Toggle
  - Registered User Governance
- ⚡ **Zero-Config Resilience**: Dual-mode storage engine that seamlessly connects to MongoDB if available, or transparently falls back to an in-memory/seed catalog with 100% full CRUD and authentication capability out of the box.

---

## 🛠️ Tech Stack

- **Frontend**: React.js 19, Vite 8, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js REST API
- **Database**: MongoDB with Mongoose (with automated local fallback store)
- **Authentication**: JWT (JSON Web Tokens) with secure bcrypt password hashing
- **Metadata**: TMDB API integration with environment variable configuration

---

## 📂 Project Structure

```text
flexyfilm/
├── client/                     # Frontend (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── api/                # Centralized API client (Fetch/Axios)
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroBanner.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── MovieRow.jsx
│   │   │   ├── VideoPlayerModal.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   └── LoadingScreen.jsx
│   │   ├── context/            # Global React Contexts
│   │   │   ├── AuthContext.jsx
│   │   │   ├── WatchlistContext.jsx
│   │   │   └── PlayerContext.jsx
│   │   ├── pages/              # Application Pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── MoviesPage.jsx
│   │   │   ├── SeriesPage.jsx
│   │   │   ├── LanguagesPage.jsx
│   │   │   ├── MovieDetailsPage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── MyListPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend (Node.js + Express + Mongoose)
│   ├── src/
│   │   ├── config/             # DB & environment configuration
│   │   ├── controllers/        # Express route controllers
│   │   │   ├── authController.js
│   │   │   ├── movieController.js
│   │   │   ├── watchlistController.js
│   │   │   ├── historyController.js
│   │   │   └── adminController.js
│   │   ├── middleware/         # Auth & role-based middleware
│   │   ├── models/             # Mongoose schemas (User, Movie, Watchlist, WatchHistory)
│   │   ├── routes/             # REST API endpoint blueprints
│   │   ├── services/           # TMDB proxy, seed data, and storage engine
│   │   └── server.js           # Server entrypoint
│   ├── .env                    # Active server environment variables
│   └── package.json
│
├── .env.example                # Template configuration
├── .gitignore
├── package.json                # Monorepo orchestration scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB** *(Optional)*: Runs locally on port 27017 or remote via `MONGO_URI`. If MongoDB is not active, FlexyFilm automatically operates in its high-speed in-memory store!

### 2. Installation
From the root project directory, run:
```bash
npm run install:all
```
*(This installs root, backend, and frontend dependencies.)*

### 3. Environment Variables
A default `.env` is already configured in `server/.env`. You can adjust settings or add your free TMDB API key:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/flexyfilm
JWT_SECRET=flexyfilm_ultra_secure_jwt_secret_key_2025_cinema
TMDB_API_KEY=your_optional_tmdb_api_key_here
```

### 4. Running the Application
To run both backend and frontend concurrently:
```bash
npm run dev
```

Or run them individually in separate terminals:
- **Backend Server**:
  ```bash
  npm run dev:server
  # Runs on http://localhost:5000
  ```
- **Frontend Client**:
  ```bash
  npm run dev:client
  # Runs on http://localhost:5173
  ```

---

## 🔑 Quick Test Credentials

The authentication modal includes **1-Click Test Login Buttons** so you can log in instantly without typing:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@flexyfilm.com` | `admin123` | Full access to Admin Hub, Movie CRUD, Banner Toggles, User deletion |
| **Member** | `user@flexyfilm.com` | `user123` | Standard streaming, Watchlist, Continue Watching, Profile customization |

---

## 📡 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve current authenticated profile
- `PUT /api/auth/profile` — Update display name, avatar, and preferred languages
- `PUT /api/auth/password` — Change account password

### Movies & Series (`/api/movies`)
- `GET /api/movies` — Filterable catalogue (genre, language, industry, rating, year, sort)
- `GET /api/movies/featured` — Retrieve hero banner spotlights
- `GET /api/movies/search` — Search by title, actor, director
- `GET /api/movies/industries` — Regional cinema breakdown
- `GET /api/movies/:id` — Detailed metadata, cast & crew, similar titles

### Watchlist (`/api/watchlist`)
- `GET /api/watchlist` — Get user's saved list
- `POST /api/watchlist` — Add title to list
- `DELETE /api/watchlist/:movieId` — Remove title from list
- `GET /api/watchlist/status/:movieId` — Instant check

### Watch History (`/api/history`)
- `GET /api/history` — Get continue watching list
- `POST /api/history/progress` — Record playback progress
- `DELETE /api/history` — Clear history

### Admin Hub (`/api/admin`) *(Admin Only)*
- `GET /api/admin/stats` — KPI analytics
- `POST /api/admin/movies` — Add new movie metadata
- `PUT /api/admin/movies/:id` — Update existing title
- `DELETE /api/admin/movies/:id` — Delete title
- `PATCH /api/admin/movies/:id/feature` — Toggle hero showcase banner
- `GET /api/admin/users` — List registered users
- `DELETE /api/admin/users/:id` — Remove user

---

## 📜 Legal & Streaming Compliance

FlexyFilm respects intellectual property rights. All movie metadata, backdrops, and posters are sourced in accordance with TMDB API guidelines. Video playback uses official YouTube studio trailers and authorized public domain/licensed streams (`Big Buck Bunny`, `Tears of Steel`, `Elephants Dream`).
