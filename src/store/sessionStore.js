/**
 * In-memory session store. No database.
 * Restarting the server clears all sessions.
 */

const { v4: uuidv4 } = require("uuid");

/** Session lifetime in milliseconds (e.g. 30 minutes). */
const SESSION_TTL_MS = 30 * 60 * 1000;

/** @type {Map<string, { userId: string, email: string, username: string, createdAt: number }>} */
const sessions = new Map();

/**
 * Create a new session for a user.
 * @param {{ userId: string, email: string, username: string }} user
 * @returns {string} sessionId
 */
function createSession(user) {
  const sessionId = uuidv4();
  sessions.set(sessionId, {
    userId: user.userId,
    email: user.email,
    username: user.username,
    createdAt: Date.now(),
  });
  console.log("[SESSION] createSession", { sessionId, userId: user.userId, username: user.username });
  return sessionId;
}

/**
 * Get session by id.
 * @param {string} sessionId
 * @returns {{ userId: string, email: string, username: string, createdAt: number } | undefined}
 */
function getSession(sessionId) {
  const session = sessions.get(sessionId);
  const now = Date.now();

  if (!session) {
    console.log("[SESSION] getSession", {
      sessionId: sessionId ? `${sessionId.slice(0, 8)}...` : "(empty)",
      found: false,
    });
    return undefined;
  }

  const ageMs = now - session.createdAt;
  const expired = ageMs > SESSION_TTL_MS;

  if (expired) {
    sessions.delete(sessionId);
    console.log("[SESSION] getSession", {
      sessionId: `${sessionId.slice(0, 8)}...`,
      found: true,
      expired: true,
      ageMs,
    });
    return undefined;
  }

  console.log("[SESSION] getSession", {
    sessionId: `${sessionId.slice(0, 8)}...`,
    found: true,
    expired: false,
    ageMs,
  });
  return session;
}

/**
 * Delete a session (e.g. on logout).
 * @param {string} sessionId
 * @returns {boolean} true if a session was removed
 */
function deleteSession(sessionId) {
  const removed = sessions.delete(sessionId);
  console.log("[SESSION] deleteSession", { sessionId: sessionId ? `${sessionId.slice(0, 8)}...` : "(empty)", removed });
  return removed;
}

module.exports = {
  createSession,
  getSession,
  deleteSession,
  SESSION_TTL_MS,
};
