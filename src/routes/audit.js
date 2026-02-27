const express = require("express");
const router = express.Router();
const requireSession = require("../middleware/requireSession");

// Stub audit log entries (same shape as frontend mock for now)
const STUB_AUDIT_LOGS = [
  { id: 1, userName: "ACG LSC", event: "Audit module clicked", description: "Audit module opened", modifiedDate: "22-12-2025 03:00 Pm", reasonToChange: "N/A" },
  { id: 2, userName: "Mumbai", event: "Reconciliation module clicked", description: "Return numbers module opened", modifiedDate: "24-12-2025 06:00 Pm", reasonToChange: "Reason 1" },
  { id: 3, userName: "Anjata", event: "Reconciliation data changed", description: "Return numbers module reopened", modifiedDate: "25-12-2025 09:00 Am", reasonToChange: "N/A" },
  { id: 4, userName: "Sun Pharma", event: "Reconciliation data saved", description: "Reconciliation module reopened", modifiedDate: "26-12-2025 12:00 Pm", reasonToChange: "Reason 2" },
  { id: 5, userName: "ACG Kandivali 62", event: "Audit module clicked", description: "Audit module opened", modifiedDate: "27-12-2025 02:00 Pm", reasonToChange: "N/A" },
  { id: 6, userName: "ACG LSC", event: "Return numbers module clicked", description: "Return numbers module opened", modifiedDate: "28-12-2025 04:00 Pm", reasonToChange: "Reason 1" },
  { id: 7, userName: "Mumbai", event: "Reconciliation module clicked", description: "Reconciliation module opened", modifiedDate: "29-12-2025 08:00 Am", reasonToChange: "N/A" },
  { id: 8, userName: "Anjata", event: "Audit module clicked", description: "Audit module reopened", modifiedDate: "30-12-2025 10:00 Am", reasonToChange: "Reason 2" },
  { id: 9, userName: "Sun Pharma", event: "Return numbers module clicked", description: "Return numbers module opened", modifiedDate: "31-12-2025 01:00 Pm", reasonToChange: "N/A" },
  { id: 10, userName: "ACG Kandivali 62", event: "Reconciliation data changed", description: "Reconciliation data saved", modifiedDate: "01-01-2026 03:00 Pm", reasonToChange: "Reason 1" },
];

/**
 * GET /api/audit/logs
 * Authorization: Bearer <sessionId>
 * Returns: 200 { success, data: { logs } } or 401
 */
router.get("/logs", requireSession, (req, res) => {
  const session = req.session;

  console.log("[AUDIT] /logs success", { userId: session.userId, username: session.username, count: STUB_AUDIT_LOGS.length });
  return res.status(200).json({
    success: true,
    data: { logs: STUB_AUDIT_LOGS },
  });
});

module.exports = router;

