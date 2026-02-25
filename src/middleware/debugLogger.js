/**
 * Logs incoming request and outgoing response with [DEBUG] prefix.
 */

function debugLogger(req, res, next) {
  const start = Date.now();
  const method = req.method;
  const path = req.path;
  const query = req.query && Object.keys(req.query).length ? req.query : undefined;
  const headers = { ...req.headers };
  if (headers["authorization"]) headers["authorization"] = "Bearer ***";
  const body = req.body;

  console.log("[DEBUG] Request:", {
    method,
    path,
    ...(query && { query }),
    headers,
    ...(body && Object.keys(body).length ? { body } : {}),
  });

  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - start;
    let parsed;
    try {
      parsed = typeof data === "string" ? JSON.parse(data) : data;
    } catch {
      parsed = data;
    }
    console.log("[DEBUG] Response:", {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      body: parsed,
    });
    return originalSend.call(this, data);
  };

  next();
}

module.exports = debugLogger;
