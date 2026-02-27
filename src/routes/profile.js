const express = require("express");
const router = express.Router();
const requireSession = require("../middleware/requireSession");

/**
 * GET /api/profile/me
 * Authorization: Bearer <sessionId>
 * Returns: 200 { success, data: { profile } } or 401
 */
router.get("/me", requireSession, (req, res) => {
  const session = req.session;

  // For now, returning a stubbed profile using session info and static fields.
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

