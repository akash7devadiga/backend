const express = require("express");
const router = express.Router();
const requireSession = require("../middleware/requireSession");

/**
 * GET /api/manual-upload/orders
 * Authorization: Bearer <sessionId>
 * Returns a static list of orders (stub data) for the Manual Upload page.
 */
router.get("/orders", requireSession, (req, res) => {
  const session = req.session;

  console.log("[MANUAL_UPLOAD] list orders request", {
    userId: session.userId,
    username: session.username,
  });

  const orders = [
    { id: 1, lot: "AJTL51", destination: "AFC Basement (172.16.65)", poid: "2259" },
    { id: 2, lot: "AJTL52", destination: "AFC Basement (172.16.67)", poid: "2260" },
    { id: 3, lot: "AJTL53", destination: "AFC Basement (172.16.68)", poid: "2261" },
  ];

  return res.status(200).json({
    success: true,
    data: {
      orders,
    },
  });
});

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

  console.log("[MANUAL_UPLOAD] upload payload", {
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

