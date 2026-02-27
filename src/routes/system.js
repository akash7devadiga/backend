const express = require("express");
const router = express.Router();
const requireSession = require("../middleware/requireSession");

/**
 * GET /api/system/info
 * Authorization: Bearer <sessionId>
 * Returns: 200 { success, data: { system } } or 401
 */
router.get("/info", requireSession, (req, res) => {
  const session = req.session;

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

