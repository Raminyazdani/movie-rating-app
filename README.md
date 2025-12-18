# Movie Rating App (Full‑Stack Monorepo)

A full‑stack movie/TV discovery and personalization app.

- **Client:** React + Redux Toolkit + Material UI + Firebase Auth
- **Server:** Node.js + Express + MySQL (mysql2)
- **External APIs:** OMDb + TMDb for movie/TV metadata

This repository is organized as a small monorepo with a `client/` (frontend) and `server/` (backend). The backend persists **users**, **favorites**, **ratings**, and **reviews** in MySQL and exposes a REST API the client consumes.

> Note: The repo currently includes `.env` files with real-looking API keys/credentials. Don’t treat those as safe. Rotate keys and remove secrets from git history before publishing.

---

## Table of contents

- [What’s in this repo](#whats-in-this-repo)
- [Features](#features)
- [High-level architecture](#high-level-architecture)
- [Project structure](#project-structure)
- [Quick start (Windows / PowerShell)](#quick-start-windows--powershell)
- [Configuration (environment variables)](#configuration-environment-variables)
  - [Server env](#server-env)
  - [Client env](#client-env)
- [Backend: REST API](#backend-rest-api)
  - [Base URL](#base-url)
  - [Endpoints](#endpoints)
  - [Payloads and response shapes](#payloads-and-response-shapes)
  - [Behavior notes / quirks](#behavior-notes--quirks)
- [Database](#database)
  - [Automatic initialization](#automatic-initialization)
  - [Schema (tables)](#schema-tables)
- [Frontend](#frontend)
  - [State management](#state-management)
  - [Key UI components](#key-ui-components)
  - [Client API layer](#client-api-layer)
- [Testing](#testing)
  - [Client tests (Jest / RTL)](#client-tests-jest--rtl)
  - [Client tests (Cypress)](#client-tests-cypress)
  - [Server tests](#server-tests)
- [Troubleshooting](#troubleshooting)
- [Security notes](#security-notes)
- [Contributing](#contributing)
- [License](#license)

---

## What’s in this repo

This repo contains:

- A **React** application in `client/`.
- An **Express** API server in `server/`.
- Database schema helpers that auto-create tables at server start.
- A large test suite organized by **Cypress**, **Jest**, and **React Testing Library** conventions inside `client/src/tests/` and server tests inside `server/test/`.

---

## Features

- **Authentication** via Firebase (email/password and Google provider).
- **Search** and discovery via external movie databases.
- **Favorites** management, tracked per user in MySQL.
- **Ratings** (add/update/remove), tracked per user in MySQL.
- **Reviews** (text), tracked per user in MySQL.
- **Recommendations** based on:
  - The user’s favorites
  - The user’s high-rated items (rating > 3)
  - Similar users’ favorites/high ratings (collaborative filtering style)

---

## High-level architecture

1. The **client** authenticates the user with Firebase.
2. The client talks to the **server REST API** to:
   - create/check users
   - fetch/add/remove favorites
   - fetch/add/update/remove ratings
   - fetch/add/update/remove reviews
   - request recommendations
3. The **server** reads its MySQL connection settings from the root `.env`, connects via a pool, and auto-creates tables if needed.
4. The client fetches metadata from **OMDb/TMDb** (titles, posters, etc.) and combines it with user-specific data from the server.

---

## Project structure

Top-level:

- `client/` — React frontend
- `server/` — Express backend
- `website.js` — helper script in the repo root (often used to start or wire up the site; see file for exact behavior)
- `package.json` — root package (minimal; does not orchestrate client/server scripts by default)

Client (`client/src/`) highlights:

- `api/clients/` — axios clients for backend API, OMDb, TMDb
- `api/services/` — domain services (carousel/grid/detail/etc.)
- `components/` — UI components (NavBar, MovieGrid, Rating, Review, etc.)
- `features/` — Redux Toolkit slices (auth, favorite, rating, recommendation, review, user)
- `app/store.js` — Redux store wiring
- `styles/` — CSS and theme
- `tests/` — organized test suites (Cypress, Jest, RTL)

Server (`server/`) highlights:

- `app.js` — Express app entrypoint
- `routes/` — Express routers (users/favorites/ratings/reviews/recommendations)
- `controllers/` — request handlers and DB queries
- `config/` — MySQL pooling config, env wiring
- `utils/initializeDatabase.js` — creates tables automatically
- `utils/dbSchemas/` — table creation SQL
- `test/` — unit and integration tests

---

## Quick start (Windows / PowerShell)

### Prerequisites

- Node.js (LTS recommended)
- npm
- A running MySQL server (local or remote)

### 1) Install dependencies

```powershell
cd "C:\Users\yazda\OneDrive\Desktop\codings\githubs\movie-rating-app"

cd server
npm install

cd ..\client
npm install
```

### 2) Configure environment variables

- Server reads DB settings from the **root** `.env`.
- Client reads frontend settings from `client/.env`.

See [Configuration (environment variables)](#configuration-environment-variables).

### 3) Start the backend

```powershell
cd "C:\Users\yazda\OneDrive\Desktop\codings\githubs\movie-rating-app\server"
node app.js
```

By default the server listens on `http://localhost:3001` (or `PORT` if set).

### 4) Start the frontend

```powershell
cd "C:\Users\yazda\OneDrive\Desktop\codings\githubs\movie-rating-app\client"
npm start
```

React dev server runs on `http://localhost:3000`.

---

## Configuration (environment variables)

There are two environment files in use:

- **Root:** `.env` (used by the server)
- **Client:** `client/.env` (used by the React app; variables must start with `REACT_APP_`)

### Server env

The backend loads environment variables using `dotenv` in:

- `server/app.js` (`require('dotenv').config({ path: '../.env' })`)
- `server/config/mysql-config.js` (`require('dotenv').config({ path: '../.env' })`)

Expected variables (root `.env`):

- `DB_HOST` — MySQL host
- `DB_PORT` — MySQL port (e.g., `3306`)
- `DB_USER` — MySQL username
- `DB_PASSWORD` — MySQL password
- `DB_DATABASE` — MySQL database name
- `PORT` *(optional)* — Express port (defaults to `3001`)

### Client env

The frontend reads from `client/.env` (Create React App conventions). Key variables referenced in code:

- Backend API:
  - `REACT_APP_API_BASE_URL` — defaults to `http://localhost:3001` if not set (`client/src/api/clients/apiClient.js`)
- OMDb:
  - `REACT_APP_OMDB_API_KEY` (`client/src/api/clients/apiMovieOMDB.js`)
- TMDb:
  - `REACT_APP_TMDB_API_KEY` (`client/src/api/clients/apiMovieTMDB.js`)
- Firebase:
  - `REACT_APP_FIREBASE_API_KEY`
  - `REACT_APP_FIREBASE_AUTH_DOMAIN`
  - `REACT_APP_FIREBASE_PROJECT_ID`
  - `REACT_APP_FIREBASE_STORAGE_BUCKET`
  - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
  - `REACT_APP_FIREBASE_APP_ID`
  - `REACT_APP_FIREBASE_MEASUREMENT_ID`

> Tip: In production, don’t commit any `.env` files. Use deployment secrets and add `.env` to `.gitignore`.

---

## Backend: REST API

### Base URL

Default during local development:

- `http://localhost:3001/api`

Routes are mounted in `server/app.js`:

- `/api/users`
- `/api/favorites`
- `/api/ratings`
- `/api/reviews`
- `/api/recommendations`

### Endpoints

#### Users (`/api/users`)

| Method | Path | Purpose |
|---|---|---|
| GET | `/checkUser/:email` | Returns whether a user exists (by email) |
| POST | `/createUser` | Creates a user record (by email) |
| GET | `/getUserId/:email` | Fetches the user row(s) for email (used by client to obtain id) |

#### Favorites (`/api/favorites`)

| Method | Path | Purpose |
|---|---|---|
| GET | `/:userId` | Fetch all favorites for a user |
| POST | `/` | Add favorite (idempotent insert) |
| DELETE | `/:userId/:imdbId/:type` | Remove favorite |

#### Ratings (`/api/ratings`)

| Method | Path | Purpose |
|---|---|---|
| GET | `/:userId` | Fetch all ratings for a user |
| POST | `/` | Add or update a rating |
| DELETE | `/:userId/:movieId/:type` | Remove a rating |

#### Reviews (`/api/reviews`)

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Fetch reviews (supports query params; see notes) |
| POST | `/` | Add or update a review |
| DELETE | `/:userId/:movieId/:type` | Delete a review |

#### Recommendations (`/api/recommendations`)

| Method | Path | Purpose |
|---|---|---|
| GET | `/:userId` | Generate recommendations for a user |

### Payloads and response shapes

Below are the payloads/shapes as implemented in controllers. This is intended to help you integrate quickly.

#### `GET /api/users/checkUser/:email`

Response:

```json
{ "exists": true }
```

#### `POST /api/users/createUser`

Body:

```json
{ "email": "user@example.com" }
```

Response:

```json
{ "userId": 123, "message": "User created successfully" }
```

#### `GET /api/users/getUserId/:email`

Response: array of user rows (MySQL results), commonly like:

```json
[{ "id": 123, "email": "user@example.com" }]
```

#### `GET /api/favorites/:userId`

Response: array of favorites:

```json
[{ "movie_id": "tt0133093", "type": "movie" }]
```

#### `POST /api/favorites`

Body:

```json
{ "userId": 123, "imdbId": "tt0133093", "type": "movie" }
```

Response: updated favorites list (same shape as GET).

#### `DELETE /api/favorites/:userId/:imdbId/:type`

Response: updated favorites list.

#### `GET /api/ratings/:userId`

Response: array of single-key objects:

```json
[
  { "tt0133093": { "rating": 5, "type": "movie" } },
  { "tt0468569": { "rating": 4, "type": "movie" } }
]
```

#### `POST /api/ratings`

Body:

```json
{ "userId": 123, "movieId": "tt0133093", "rating": 5, "type": "movie" }
```

Response: updated ratings list (same shape as GET).

#### `DELETE /api/ratings/:userId/:movieId/:type`

Response: updated ratings list.

#### `POST /api/reviews`

Body:

```json
{ "userId": 123, "movieId": "tt0133093", "review": "Great sci-fi.", "type": "movie" }
```

Response: array of single-key objects:

```json
[
  { "tt0133093": { "review": "Great sci-fi.", "type": "movie" } }
]
```

#### `GET /api/reviews?userId=123&movieId=...&type=...`

Response: array of single-key objects (same shape as POST).

#### `DELETE /api/reviews/:userId/:movieId/:type`

Response:

```json
{ "message": "Review deleted successfully" }
```

#### `GET /api/recommendations/:userId`

Response:

```json
{ "recommendations": [ { "movie_id": "tt...", "type": "movie" } ] }
```

If the system can’t compute collaborative recommendations (e.g., only one user exists), it may return a fallback:

```json
{
  "recommendations": [ { "movie_id": "tt...", "type": "movie" } ],
  "reason": "Fallback to user favorites and high-rated movies due to insufficient user data"
}
```

### Behavior notes / quirks

A few implementation details worth knowing when integrating:

- **`GET /api/users/getUserId/:email`** returns *rows*, not a single `{ userId }` object. Your client likely needs `results[0].id`.
- **Reviews GET filtering:** `reviewsController.getReviews` parses `userId`, `movieId`, `type` from query params, but currently performs a fixed query by `userId` when returning results.
- **Reviews table has a `rating` column** in the schema, but the current review endpoints use only `review` text.

---

## Database

### Automatic initialization

On server startup (`server/app.js`), `initializeDatabase()` runs and attempts to:

1. Connect to MySQL via the pool from `server/config/db.js`.
2. Create tables if they don’t exist via `server/utils/dbSchemas/*`.

You must create the database itself (named via `DB_DATABASE`) ahead of time, and ensure the configured user has permissions to create tables.

### Schema (tables)

The server currently creates (if missing):

#### `users`

- `id` INT, AUTO_INCREMENT, PRIMARY KEY
- `email` VARCHAR(255), NOT NULL, UNIQUE

#### `favorites`

- `id` INT, AUTO_INCREMENT, PRIMARY KEY
- `user_id` INT, foreign key → `users(id)`
- `movie_id` VARCHAR(255)
- `type` VARCHAR(255)

#### `ratings`

- `id` INT, AUTO_INCREMENT, PRIMARY KEY
- `user_id` INT, foreign key → `users(id)`
- `movie_id` VARCHAR(255)
- `rating` INT
- `type` VARCHAR(255)

#### `reviews`

- `id` INT, AUTO_INCREMENT, PRIMARY KEY
- `user_id` INT, foreign key → `users(id)`
- `movie_id` VARCHAR(255)
- `rating` INT
- `review` TEXT
- `type` VARCHAR(255)

---

## Frontend

### State management

The client uses **Redux Toolkit** with slices under `client/src/features/`:

- `auth/` — Firebase auth state + snackbar messages
- `user/` — user id lookup from backend
- `favorite/` — favorites list + persistence
- `rating/` — ratings + persistence
- `review/` — reviews + persistence
- `recommendation/` — recommendation results

The store is defined in `client/src/app/store.js`.

### Key UI components

Notable components under `client/src/components/`:

- `NavBar` — navigation + auth modals
- `SignInModal`, `SignUpModal` — authentication UI
- `MovieCarousel` — featured/trending section
- `SearchBar` — search experience
- `MovieGrid` — displays results or lists
- `Favorite`, `Rating`, `Review` — user actions & persistence
- `HistoryTable` — history display
- `DashBoard` — layout container
- `footer` — app footer

### Client API layer

The app uses axios clients:

- `client/src/api/clients/apiClient.js` — REST calls to the backend (`REACT_APP_API_BASE_URL`)
- `client/src/api/clients/apiMovieOMDB.js` — OMDb calls (`REACT_APP_OMDB_API_KEY`)
- `client/src/api/clients/apiMovieTMDB.js` — TMDb calls (`REACT_APP_TMDB_API_KEY`)

Service modules under `client/src/api/services/` provide higher-level operations (carousel/grid/detail/title/etc.) and helper utilities live under `client/src/api/helpers/`.

---

## Testing

This repository includes tests for both client and server.

### Client tests (Jest / RTL)

The client uses Create React App’s Jest runner.

```powershell
cd "C:\Users\yazda\OneDrive\Desktop\codings\githubs\movie-rating-app\client"
npm test
```

Test locations:

- `client/src/tests/Jest/` — Jest tests
- `client/src/tests/React Testing Library (RTL)/` — component tests

### Client tests (Cypress)

Cypress is installed in the client dev dependencies.

```powershell
cd "C:\Users\yazda\OneDrive\Desktop\codings\githubs\movie-rating-app\client"
npx cypress open
# or
npx cypress run
```

Cypress tests live under:

- `client/src/tests/Cypress/`

### Server tests

Server tests live under:

- `server/test/unit/`
- `server/test/integration/`

The current `server/package.json` doesn’t define a runnable test command. If you want to run them, check the test framework used in `server/test/` (and add scripts later). This README intentionally does not modify any package scripts.

---

## Troubleshooting

**Server won’t start / DB connection fails**

- Verify MySQL is running.
- Verify root `.env` contains correct `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`.
- Ensure the database exists and the user has permission to create tables.

**Client can’t reach server / CORS errors**

- Confirm backend is on `http://localhost:3001`.
- Confirm `REACT_APP_API_BASE_URL` points to the backend.
- Server enables CORS globally (`app.use(cors())`).

**Port already in use**

- Change `PORT` in root `.env` for the server.
- Or stop the conflicting process using Windows tools.

**Changes to `.env` not picked up**

- Restart the server/client after editing env files.
- For CRA, env vars are read at build/start time.

---

## Security notes

- Don’t commit `.env` files to source control.
- Rotate any keys that have already been committed.
- Treat Firebase keys and third-party API keys as sensitive project configuration.
- Use least-privilege accounts for MySQL.

---

## Contributing

Contributions are welcome.

A good workflow:

1. Fork the repo
2. Create a feature branch
3. Add/adjust tests where applicable
4. Open a PR describing changes and how they were verified

---

## License

No license file is currently included in the repo root. If you plan to distribute this project, add a `LICENSE` file and update this section accordingly.

