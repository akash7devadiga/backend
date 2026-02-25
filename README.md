# Backend stub API (Login / Logout)

Stub APIs for login and logout with in-memory session store. No database required.

## Commands to run

From the project root (where this README is):

```bash
# 1. Install dependencies
npm install

# 2. Start the server (production)
npm start

# 3. Or start with auto-reload on file changes (development)
npm run dev
```

Server runs at **http://localhost:3000** (or set `PORT` env var).

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/auth/login` | Login (returns `sessionId`) |
| POST | `/api/auth/logout` | Logout (invalidates session) |
| GET | `/api/auth/me` | Get current user from session |

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"password\"}"
```

Stub credentials (no `@` in username, to match frontend validation): **username** `stubuser`, **password** `password`. Or **email** `user@example.com`, **password** `password` (e.g. for API clients).

### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"<sessionId-from-login>\"}"
```

Or with header:

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <sessionId-from-login>"
```

## Debug logs

Every request and response is logged to the console with `[DEBUG]`:

- Request: method, path, query, headers, body
- Response: statusCode, duration, body

## Database note

Sessions are stored **in memory** (no DB). Restarting the server clears all sessions. For production, replace `src/store/sessionStore.js` with Redis or your database.

## Frontend (my-electron-poc)

The Electron app is wired to these APIs: login uses `POST /api/auth/login` (sends `username` + `password`), and logout uses `POST /api/auth/logout` with the stored session. Default base URL is `http://localhost:3000`; set `VITE_API_URL` in the frontend `.env` to override.
