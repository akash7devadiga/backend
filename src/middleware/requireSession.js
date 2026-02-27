const { getSession } = require("../store/sessionStore");

/**
 * Middleware to require a valid session based on Authorization: Bearer <sessionId>.
 * On success, attaches the session object to req.session and calls next().
 * On failure, responds with 401 and a consistent error body.
 */
function requireSession(req, res, next) {
  const auth = req.headers.authorization || "";
  const sessionId = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  console.log("[SESSION_MW] incoming request", {
    path: req.path,
    method: req.method,
    hasSessionId: !!sessionId,
  });

  if (!sessionId) {
    console.log("[SESSION_MW] missing authorization");
    return res.status(401).json({
      success: false,
      message: "Missing or invalid authorization",
    });
  }

  const session = getSession(sessionId);
  if (!session) {
    console.log("[SESSION_MW] session invalid or expired");
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid",
    });
  }

  req.session = session;
  console.log("[SESSION_MW] session ok", {
    userId: session.userId,
    username: session.username,
  });

  return next();
}

module.exports = requireSession;

