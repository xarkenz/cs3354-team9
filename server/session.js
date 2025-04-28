// server/session.js
const sessions = {};

function getSessionToken(req) {
  const raw = req.headers.mycookies || '';
  return raw.split(';')
            .map(c => c.trim().split('='))
            .find(([k]) => k==='session')?.[1] || null;
}

module.exports = { sessions, getSessionToken };
