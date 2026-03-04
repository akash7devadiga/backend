const express = require("express");
const router = express.Router();
const requireSession = require("../middleware/requireSession");

// Stub orders for dropdowns (same shape as frontend mock)
const STUB_PRODUCTION_ORDERS = [
  { value: "po-001", label: "Production Order PO-001" },
  { value: "po-002", label: "Production Order PO-002" },
  { value: "po-003", label: "Production Order PO-003" },
];

const STUB_SHIPPING_ORDERS = [
  { value: "so-001", label: "Shipping Order SO-001" },
  { value: "so-002", label: "Shipping Order SO-002" },
  { value: "so-003", label: "Shipping Order SO-003" },
];

/**
 * GET /api/return-serials/orders
 * Authorization: Bearer <sessionId>
 * Returns: 200 { success, data: { productionOrders, shippingOrders } } or 401
 */
router.get("/orders", requireSession, (req, res) => {
  const session = req.session;
  console.log("[RETURN_SERIALS] /orders success", {
    userId: session.userId,
    username: session.username,
  });
  return res.status(200).json({
    success: true,
    data: {
      productionOrders: STUB_PRODUCTION_ORDERS,
      shippingOrders: STUB_SHIPPING_ORDERS,
    },
  });
});

/**
 * POST /api/return-serials/return
 * Authorization: Bearer <sessionId>
 * Body: { orderType: 'production' | 'shipping', orderId: string }
 * Returns: 200 { success, data: { returnedCount }, message } or 401
 */
router.post("/return", requireSession, (req, res) => {
  const session = req.session;
  const orderType = (req.body.orderType || "production").toString();
  const orderId = (req.body.orderId || "").toString();

  console.log("[RETURN_SERIALS] /return payload", {
    userId: session.userId,
    username: session.username,
    orderType,
    orderId,
  });

  // Stub: deterministic count from orderId for demo, e.g. 50–250
  const hash = orderId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const returnedCount = 50 + (hash % 201);

  return res.status(200).json({
    success: true,
    message: "Serials returned successfully",
    data: {
      returnedCount,
      orderType,
      orderId,
    },
  });
});

module.exports = router;
