const express = require("express");
const router = express.Router();
const { getSession } = require("../store/sessionStore");

/**
 * GET /api/system/info
 * Authorization: Bearer <sessionId>
 * Returns: 200 { success, data: { system } } or 401
 */
router.get("/info", (req, res) => {
  const auth = req.headers.authorization || "";
  const sessionId = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  console.log("[SYSTEM] /info request", { hasSessionId: !!sessionId });

  if (!sessionId) {
    console.log("[SYSTEM] /info failed", { reason: "missing_authorization" });
    return res.status(401).json({
      success: false,
      message: "Missing or invalid authorization",
    });
  }

  const session = getSession(sessionId);
  if (!session) {
    console.log("[SYSTEM] /info failed", { reason: "session_invalid_or_expired" });
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid",
    });
  }

  const system = {
    product: "QualiShield",
    model: "SA3342",
    system: "Serializer",
    version: "1.2",
    backendStartedAt: new Date().toISOString(),
  };

  console.log("[SYSTEM] /info success", { userId: session.userId, username: session.username });
  return res.status(200).json({
    success: true,
    data: { system },
  });
});

module.exports = router;

