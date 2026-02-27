/**
 * Auth routes: login, logout, me.
 */

const express = require("express");
const router = express.Router();
const { createSession, getSession, deleteSession } = require("../store/sessionStore");
const requireSession = require("../middleware/requireSession");

/** Stub users: username or email - { password, user, mustChangePassword? } */
const STUB_USERS = [
  {
    username: "stubuser",
    email: "stubuser@example.com",
    password: "password",
    userId: "stub-user-1",
    mustChangePassword: false,
  },
  {
    username: "userexample.com",
    email: "user@example.com",
    password: "password",
    userId: "stub-user-2",
    mustChangePassword: false,
  },
  { username: "sumit.gupta", password: "Welcome@123", userId: "user-sumit", email: "sumit.gupta@example.com", mustChangePassword: false },
  { username: "operator1", password: "Welcome@123", userId: "user-operator1", email: "operator1@example.com", mustChangePassword: true },
  { username: "acg.admin", password: "Admin@1234", userId: "user-acg-admin", email: "acg.admin@example.com", mustChangePassword: true },
  { username: "client.user", password: "Client@123", userId: "user-client", email: "client.user@example.com", mustChangePassword: true },
  { username: "dummy", password: "dummy12345", userId: "user-dummy", email: "dummy@example.com", mustChangePassword: false },
  { username: "akash.devadiga", password: "Welcome@1234", userId: "user-akash", email: "akash.devadiga@example.com", mustChangePassword: true },
];

function findStubUser(loginId, password) {
  const trimmed = (loginId || "").trim().toLowerCase();
  const pwd = (password || "").trim();
  return STUB_USERS.find(
    (u) =>
      (u.username.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed) &&
      u.password === pwd
  );
}

/** Find stub user by username (for change-password). */
function findStubUserByUsername(username) {
  const trimmed = (username || "").trim().toLowerCase();
  return STUB_USERS.find((u) => u.username.toLowerCase() === trimmed);
}

/**
 * POST /api/auth/login
 * Body: { username?, email?, password }
 * Returns: 200 { success, data: { sessionId, user: { id, email, username, mustChangePassword } } } or 401
 */
router.post("/login", (req, res) => {
  const loginId = (req.body.username ?? req.body.email ?? "").trim();
  const password = req.body.password ?? "";
  console.log("[AUTH] login attempt", { loginId: loginId ? `${loginId.slice(0, 8)}...` : "(empty)" });

  const user = findStubUser(loginId, password);

  if (!user) {
    console.log("[AUTH] login failed", { reason: "invalid_credentials", loginId: loginId ? `${loginId.slice(0, 8)}...` : "(empty)" });
    return res.status(401).json({
      success: false,
      message: "Invalid username or password",
    });
  }

  const sessionId = createSession({
    userId: user.userId,
    email: user.email,
    username: user.username,
  });

  console.log("[AUTH] login success", { userId: user.userId, username: user.username });
  return res.status(200).json({
    success: true,
    data: {
      sessionId,
      user: {
        id: user.userId,
        email: user.email,
        username: user.username,
        mustChangePassword: user.mustChangePassword ?? false,
      },
    },
  });
});

/**
 * POST /api/auth/logout
 * Authorization: Bearer <sessionId> or body: { sessionId }
 * Returns: 200 { success, message }
 */
router.post("/logout", (req, res) => {
  let sessionId =
    req.body?.sessionId?.trim() ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.slice(7).trim()
      : "");

  console.log("[AUTH] logout request", { hasSessionId: !!sessionId });
  if (sessionId) {
    const removed = deleteSession(sessionId);
    console.log("[AUTH] logout completed", { removed });
  }

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

/**
 * GET /api/auth/me
 * Authorization: Bearer <sessionId>
 * Returns: 200 { success, data: { user } } or 401
 */
router.get("/me", requireSession, (req, res) => {
  const session = req.session;

  console.log("[AUTH] me success", { userId: session.userId, username: session.username });
  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: session.userId,
        email: session.email,
        username: session.username,
      },
    },
  });
});

/**
 * POST /api/auth/change-password
 * Authorization: Bearer <sessionId>
 * Body: { currentPassword, newPassword }
 * Returns: 200 { success, message } or 400 (validation) or 401 (unauthorized)
 */
router.post("/change-password", requireSession, (req, res) => {
  const session = req.session;
  const currentPassword = (req.body.currentPassword ?? "").trim();
  const newPassword = (req.body.newPassword ?? "").trim();

  if (!currentPassword) {
    console.log("[AUTH] change-password validation failed", { field: "currentPassword" });
    return res.status(400).json({
      success: false,
      message: "Current password is required",
    });
  }
  if (!newPassword) {
    console.log("[AUTH] change-password validation failed", { field: "newPassword" });
    return res.status(400).json({
      success: false,
      message: "New password is required",
    });
  }
  if (currentPassword === newPassword) {
    console.log("[AUTH] change-password validation failed", { reason: "new_same_as_current" });
    return res.status(400).json({
      success: false,
      message: "New password must be different from current password",
    });
  }
  if (newPassword.length < 8 || newPassword.length > 128) {
    return res.status(400).json({
      success: false,
      message: "New password must be 8–128 characters",
    });
  }

  const user = findStubUserByUsername(session.username);
  if (!user) {
    console.log("[AUTH] change-password failed", { reason: "user_not_found", username: session.username });
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }
  if (user.password !== currentPassword) {
    console.log("[AUTH] change-password failed", { reason: "current_password_incorrect" });
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  user.password = newPassword;
  user.mustChangePassword = false;
  console.log("[AUTH] change-password success", { userId: user.userId, username: user.username });

  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

module.exports = router;
