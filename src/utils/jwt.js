// Shared JWT helpers. Decoding here is for DISPLAY/CLIENT-STATE purposes
// only (who does the UI think is logged in) — the server independently
// verifies the real signature on every request; nothing here is trusted
// as authentication.

export function decodeTokenPayload(token) {
  try {
    // JWTs are base64URL (-/_ , no padding), not plain base64 (+//).
    // atob() expects plain base64, so it must be converted first or it
    // throws (or silently mis-decodes) on many real tokens.
    const base64url = token.split(".")[1];
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeTokenPayload(token);
  if (!payload || !payload.exp) return true;
  return payload.exp * 1000 < Date.now();
}
