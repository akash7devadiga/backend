const express = require("express");
const router = express.Router();
const requireSession = require("../middleware/requireSession");

/**
 * POST /api/manual-upload
 * Authorization: Bearer <sessionId>
 * Body: { station: 'server' | 'next' | 'both', orders: Array<{ id, lot, destination, poid }> }
 * Returns: 200 { success, data: { uploadedCount, jobId }, message }
 */
router.post("/", requireSession, (req, res) => {
  const session = req.session;

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

