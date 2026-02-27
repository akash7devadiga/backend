const express = require("express");
const router = express.Router();
const { getSession } = require("../store/sessionStore");

/**
 * POST /api/manual-upload
 * Authorization: Bearer <sessionId>
 * Body: { station: 'server' | 'next' | 'both', orders: Array<{ id, lot, destination, poid }> }
 * Returns: 200 { success, data: { uploadedCount, jobId }, message }
 */
router.post("/", (req, res) => {
  const auth = req.headers.authorization || "";
  const sessionId = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  console.log("[MANUAL_UPLOAD] request", { hasSessionId: !!sessionId });

  if (!sessionId) {
    console.log("[MANUAL_UPLOAD] failed", { reason: "missing_authorization" });
    return res.status(401).json({
      success: false,
      message: "Missing or invalid authorization",
    });
  }

  const session = getSession(sessionId);
  if (!session) {
    console.log("[MANUAL_UPLOAD] failed", { reason: "session_invalid_or_expired" });
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid",
    });
  }

  const station = (req.body.station || "server").toString();
  const orders = Array.isArray(req.body.orders) ? req.body.orders : [];

  console.log("[MANUAL_UPLOAD] payload", {
    userId: session.userId,
    username: session.username,
    station,
    ordersCount: orders.length,
  });

  const jobId = `job-${Date.now()}`;

  return res.status(200).json({
    success: true,
    message: "Manual upload accepted",
    data: {
      uploadedCount: orders.length,
      station,
      jobId,
    },
  });
});

module.exports = router;

