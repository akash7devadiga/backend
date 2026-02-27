/**
 * Stub API server: login, logout, me.
 * Runs at http://localhost:3000 (or PORT env).
 */

const express = require("express");
const cors = require("cors");
const debugLogger = require("./middleware/debugLogger");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const systemRoutes = require("./routes/system");
const auditRoutes = require("./routes/audit");
const manualUploadRoutes = require("./routes/manualUpload");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(debugLogger);

app.get("/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/manual-upload", manualUploadRoutes);

app.listen(PORT, () => {
  console.log("[SERVER] Stub API server started", { port: PORT, baseUrl: `http://localhost:${PORT}` });
  console.log("[SERVER] Routes: GET /health, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me, POST /api/auth/change-password, GET /api/profile/me, GET /api/system/info, GET /api/audit/logs, POST /api/manual-upload");
});
