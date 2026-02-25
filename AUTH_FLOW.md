# Auth flow: login and logout

This document describes the full flow of the stub login and logout APIs and how the frontend (my-electron-poc) is wired to them.

---

## 1. Login flow

### 1.1 User submits the form

- User enters **username** (e.g. `stubuser`) and **password** in `LoginPage.jsx`.
- Submit runs validation (username pattern, password length, etc.).

### 1.2 Frontend calls the auth API

- `LoginPage` calls `authApi.login(formData.username, formData.password)`.
- In `src/api/auth.js` (frontend), that does:
  - `POST` to `http://localhost:3000/api/auth/login`
  - Body: `{ "username": "stubuser", "password": "password" }`
  - `Content-Type: application/json`

### 1.3 Backend receives the request

- **Express** in `backend/src/index.js` receives the request.
- **CORS** and **`express.json()`** run first.
- **`debugLogger`** middleware logs the incoming request (method, path, headers, body) with `[DEBUG]`.
- Request is then handled by **`/api/auth`** routes in `backend/src/routes/auth.js`.

### 1.4 Backend validates and creates a session

- Login handler reads `username` and `password` from `req.body`, trims them.
- It looks up a stub user (e.g. `stubuser` / `password`) in `STUB_USERS`.
- If no match → **401** with message "Invalid username or password".
- If match → **session** is created in `backend/src/store/sessionStore.js`:
  - `createSession()` generates a UUID and stores in an in-memory `Map`: `sessionId → { userId, email, createdAt }`.
  - No database; all in memory.

### 1.5 Backend sends the response

- Response: **200** with body:
  - `success: true`
  - `data.sessionId` (e.g. UUID)
  - `data.user`: `{ id, email, username }`
- **`debugLogger`** wraps `res.send` and logs the outgoing response (status, duration, body) with `[DEBUG]`.

### 1.6 Frontend handles the success response

- In `LoginPage`, after a successful `authApi.login()`:
  - **Session is stored:** `authApi.setStoredSessionId(result.data.sessionId)`  
    → `sessionStorage.setItem("auth_session_id", sessionId)` so the app can use it later.
  - **UI state is updated:** `onLogin(displayName, mustChangePassword)` is called.
- In **`AuthContext.jsx`**, `login(displayName, mustChangePassword)`:
  - Sets `loggedIn = true`, `username = displayName`, and related state.
- React re-renders; the app shows the authenticated (e.g. dashboard) view instead of the login page.

**Summary:** Form → `authApi.login` → backend validates & creates session → frontend stores `sessionId` and calls `login()` in context → user is "logged in" in the app.

---

## 2. Using the session later (e.g. "who is logged in?")

- The **only** place the session is stored in the frontend is **sessionStorage** under the key used in `auth.js` (e.g. `auth_session_id`).
- If you later call **`GET /api/auth/me`**, the frontend would send:
  - Header: `Authorization: Bearer <sessionId>`  
  with the value read from that same sessionStorage.
- Backend would take that `sessionId`, look it up in the in-memory `Map` in `sessionStore.js`, and return the user (or 401 if missing/expired).
- Right now the app doesn't need to call `/me` because it already has the username in **AuthContext** after login.

---

## 3. Logout flow

### 3.1 User triggers logout

- User clicks logout (e.g. in header/footer).
- That calls the **logout** function from **`useAuth()`** (from `AuthContext`).

### 3.2 Frontend runs logout

- In **`AuthContext.jsx`**, `logout()`:
  - Calls **`authApi.logout()`**.
- In **`src/api/auth.js`**, `logout()`:
  - Reads **sessionId** from sessionStorage (same key as on login).
  - If there is a sessionId:
    - Sends **`POST /api/auth/logout`** with:
      - Header: `Authorization: Bearer <sessionId>`
      - Body can also include `{ sessionId }` (backend accepts either).
  - In a `finally` (or after the request), it **clears** the stored session:  
    `setStoredSessionId(null)` → `sessionStorage.removeItem(...)`.

### 3.3 Backend invalidates the session

- In **`backend/src/routes/auth.js`**, the logout handler:
  - Gets `sessionId` from `req.body.sessionId` or from the `Authorization` header.
  - Calls **`deleteSession(sessionId)`** in `sessionStore.js`, which removes that entry from the in-memory `Map`.
  - Sends **200** with `{ success: true, message: "Logout successful" }`.

### 3.4 Frontend clears auth state

- Back in **`AuthContext`**, after `authApi.logout()` (whether the request succeeded or failed):
  - It sets `loggedIn = false`, `username = ""`, etc.
- The app re-renders and shows the **login page** again.

**Summary:** User clicks logout → context calls `authApi.logout()` → frontend sends sessionId to backend and then clears sessionStorage → backend deletes that session from the Map → context clears auth state → UI shows login.

---

## 4. Data flow diagram (conceptual)

```
LOGIN
─────
[User] → [LoginPage form] → authApi.login(username, password)
                → POST /api/auth/login { username, password }
                → [Backend: debugLogger → auth route → sessionStore.createSession]
                ← 200 { sessionId, user }
         ← sessionStorage.setItem("auth_session_id", sessionId)
         ← onLogin(displayName) → AuthContext.login() → loggedIn = true
[App shows dashboard]


LOGOUT
──────
[User clicks Logout] → AuthContext.logout()
                → authApi.logout() reads sessionId from sessionStorage
                → POST /api/auth/logout (Bearer sessionId)
                → [Backend: deleteSession(sessionId)]
                ← sessionStorage cleared
         ← AuthContext: loggedIn = false, username = ""
[App shows login page]
```

---

## 5. Important details

- **No database:** Sessions live only in the backend's in-memory `Map`. Restarting the backend wipes all sessions.
- **Session storage:** The frontend keeps the session only in **sessionStorage** (key used in `auth.js`). So it's tied to that browser tab; closing the tab loses the session on the client, and the server still has it until logout or server restart.
- **Debug logs:** Every request and response is logged by **`debugLogger`** in the backend so you can see exactly what was sent and returned.
- **Stub users:** Only the entries in **`STUB_USERS`** (e.g. `stubuser` / `password`) are accepted; no real user store or DB yet.

---

## 6. Stub credentials

| Username   | Password  | Notes                          |
|-----------|-----------|---------------------------------|
| `stubuser`| `password`| Matches frontend validation (no `@`) |
| `user@example.com` | `password` | For API clients that send email |
