const express = require("express");
const router = express.Router();
const { getSession } = require("../store/sessionStore");

/**
 * GET /api/profile/me
 * Authorization: Bearer <sessionId>
 * Returns: 200 { success, data: { profile } } or 401
 */
router.get("/me", (req, res) => {
  const auth = req.headers.authorization || "";
  const sessionId = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  console.log("[PROFILE] /me request", { hasSessionId: !!sessionId });

  if (!sessionId) {
    console.log("[PROFILE] /me failed", { reason: "missing_authorization" });
    return res.status(401).json({
      success: false,
      message: "Missing or invalid authorization",
    });
  }

  const session = getSession(sessionId);
  if (!session) {
    console.log("[PROFILE] /me failed", { reason: "session_invalid_or_expired" });
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid",
    });
  }

  // For now, return a stubbed profile using session info and static fields.
  const profile = {
    id: session.userId,
    username: session.username,
    email: session.email,
    firstName: "Akash",
    lastName: "Devadiga",
    role: "Admin",
    phone: "+91 98765 43210",
    location: "Plot No. 62, Kandivali West, Mumbai, India",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  console.log("[PROFILE] /me success", { userId: session.userId, username: session.username });
  return res.status(200).json({
    success: true,
    data: { profile },
  });
});

module.exports = router;

