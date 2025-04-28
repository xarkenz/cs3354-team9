// server/common.js

/**
 * In-memory session store:
 *   key = sessionToken, value = { username, userId, isAdmin?, … }
 */
const sessions = {};

/**
 * Extract the “session” token from your custom header `mycookies`
 */
function getSessionToken(req) {
  const header = req.headers.mycookies || "";
  for (const part of header.split(";")) {
    const [k, v] = part.trim().split("=");
    if (k === "session") return v;
  }
  return null;
}

module.exports = { sessions, getSessionToken };
