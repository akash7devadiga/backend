const express = require("express");
const router = express.Router();
const requireSession = require("../middleware/requireSession");

/**
 * POST /api/backup/files
 * Authorization: Bearer <sessionId>
 * Body: { backupType, dateRange, dateRangeValue, sourcePath, destinationPath }
 * Returns stub response with a fake job id.
 */
router.post("/files", requireSession, (req, res) => {
  const session = req.session;
  const {
    backupType = "copy-log",
    dateRange = "all",
    dateRangeValue = "",
    sourcePath,
    destinationPath,
  } = req.body || {};

  console.log("[BACKUP] /files request", {
    userId: session.userId,
    username: session.username,
    backupType,
    dateRange,
    dateRangeValue,
    sourcePath,
    destinationPath,
  });

  if (!destinationPath) {
    return res.status(400).json({
      success: false,
      message: "Destination path is required",
    });
  }

  const jobId = `backup-files-${Date.now()}`;

  return res.status(200).json({
    success: true,
    message: "Backup files request accepted",
    data: {
      jobId,
      backupType,
      dateRange,
      dateRangeValue,
      sourcePath,
      destinationPath,
    },
  });
});

/**
 * POST /api/backup/database
 * Authorization: Bearer <sessionId>
 * Body: { auditOnly, sourceName, destinationPath }
 * Returns stub response with a fake job id.
 */
router.post("/database", requireSession, (req, res) => {
  const session = req.session;
  const { auditOnly = false, sourceName = "newtnt", destinationPath } = req.body || {};

  console.log("[BACKUP] /database request", {
    userId: session.userId,
    username: session.username,
    auditOnly,
    sourceName,
    destinationPath,
  });

  if (!destinationPath) {
    return res.status(400).json({
      success: false,
      message: "Destination path is required",
    });
  }

  const jobId = `backup-db-${Date.now()}`;

  return res.status(200).json({
    success: true,
    message: auditOnly
      ? "Audit-only database backup request accepted"
      : "Database backup request accepted",
    data: {
      jobId,
      auditOnly,
      sourceName,
      destinationPath,
    },
  });
});

/**
 * POST /api/backup/restore
 * Authorization: Bearer <sessionId>
 * Body: { sourcePath, destinationName }
 * Returns stub response with a fake job id.
 */
router.post("/restore", requireSession, (req, res) => {
  const session = req.session;
  const { sourcePath, destinationName = "newtnt" } = req.body || {};

  console.log("[BACKUP] /restore request", {
    userId: session.userId,
    username: session.username,
    sourcePath,
    destinationName,
  });

  if (!sourcePath) {
    return res.status(400).json({
      success: false,
      message: "Source backup path is required",
    });
  }

  const jobId = `restore-db-${Date.now()}`;

  return res.status(200).json({
    success: true,
    message: "Database restore request accepted",
    data: {
      jobId,
      sourcePath,
      destinationName,
    },
  });
});

module.exports = router;

