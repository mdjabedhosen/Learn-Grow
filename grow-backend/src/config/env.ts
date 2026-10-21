import path from "path";
import fs from "fs";
import dotenv from "dotenv";

/**
 * Load the backend's own .env deterministically.
 *
 * Relying on `process.cwd()` is fragile: starting the server from the repo
 * root silently loads the root `.env` (which holds different, placeholder
 * values) instead of `grow-backend/.env`. The path is resolved relative to
 * this module so it is identical for `src/config/env.ts` (ts-node/tsx) and
 * `dist/config/env.js` (compiled).
 */
const backendEnvPath = path.resolve(__dirname, "../../.env");
if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath, quiet: true });
} else {
  dotenv.config({ quiet: true });
}

/** Split a comma separated list into trimmed, non-empty entries. */
const splitList = (value: string | undefined): string[] =>
  (value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

/**
 * Placeholder secrets that used to be the committed defaults. A server that
 * still runs on one of them can mint a valid token for ANY user id, so
 * startup fails instead of silently accepting them.
 */
export const INSECURE_PLACEHOLDER_SECRETS = [
  "your_jwt_secret_key_change_in_production",
  "your_refresh_secret_key_change_in_production",
  "your_super_secret_jwt_key_change_in_production",
  "secret",
  "your-secret-key",
  "test",
];

/** A secret that is too short to be safe for signing. */
const MIN_SECRET_LENGTH = 32;

/**
 * Read a required secret from the environment.
 *
 * There is deliberately NO fallback: a hardcoded default means the signing
 * key ships with the repository, and anyone who clones it can forge tokens
 * for any account.
 */
const requiredSecret = (name: string): string => {
  const value = (process.env[name] || "").trim();

  if (!value) {
    throw new Error(
      `[config] ${name} is not set. It must be provided by the environment ` +
        "(deployment secret manager / .env that is NOT committed). " +
        "Refusing to start with a missing secret."
    );
  }

  if (INSECURE_PLACEHOLDER_SECRETS.includes(value.toLowerCase())) {
    throw new Error(
      `[config] ${name} still holds a known placeholder value. ` +
        "Rotate it to a high-entropy random value before starting. " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
    );
  }

  if (value.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `[config] ${name} is too short (${value.length} characters, ` +
        `minimum ${MIN_SECRET_LENGTH}). Use a high-entropy random value.`
    );
  }

  return value;
};

/**
 * The Google OAuth callback URLs this server is allowed to ask Google for.
 *
 * `GOOGLE_CALLBACK_URLS` accepts a comma separated list so that ONE Google
 * Cloud Console registration can cover several environments (production +
 * local dev). The first entry is the primary/default one.
 */
const googleCallbackUrls = (() => {
  const list = splitList(process.env.GOOGLE_CALLBACK_URLS);
  const primary = (
    process.env.GOOGLE_CALLBACK_URL ||
    "https://learnandgrow.io/api/auth/google/callback"
  ).trim();
  return list.length > 0 ? list : [primary];
})();

/**
 * The frontend URLs this server may redirect the browser to after auth.
 *
 * Same idea as GOOGLE_CALLBACK_URLS: a comma separated allow-list, with the
 * entry matching the originating request picked at redirect time. Only
 * configured URLs are ever used, so this cannot become an open redirect.
 */
const frontendUrls = (() => {
  const list = splitList(process.env.FRONTEND_URLS);
  const primary = (process.env.FRONTEND_URL || "https://learnandgrow.io").trim();
  return list.length > 0 ? list : [primary];
})();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),

  // MongoDB - can be overridden by environment variable
  // Falls back to hardcoded values in mongoose.ts if not set
  MONGODB_URI: process.env.MONGODB_URI || "",

  // JWT - both secrets are REQUIRED. A committed default would let anyone
  // forge a token for any account, so the server refuses to start without
  // real, high-entropy values.
  JWT_SECRET: requiredSecret("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  JWT_REFRESH_SECRET: requiredSecret("JWT_REFRESH_SECRET"),
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  
  // Twilio SMS
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || "",

  // Google OAuth - driven by the environment, never hardcoded in source.
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",

  /** The primary callback URL (used when no host-specific match is found). */
  GOOGLE_CALLBACK_URL: googleCallbackUrls[0],

  /** Every callback URL this server may present to Google. */
  GOOGLE_CALLBACK_URLS: googleCallbackUrls,

  // Frontend URL
  FRONTEND_URL: frontendUrls[0],

  /** Every frontend URL this server may redirect the browser to. */
  FRONTEND_URLS: frontendUrls,
  
  // Backend URL
  BACKEND_URL: process.env.BACKEND_URL || "https://learnandgrow.io",

  // Optional: external payment gateway health check URL
  PAYMENT_HEALTH_URL: process.env.PAYMENT_HEALTH_URL || "",
};

/** Compare the host of a URL against a candidate host string. */
const hostMatches = (url: string, host: string): boolean => {
  try {
    return new URL(url).host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
};

/** Compare only the hostname (ignoring the port). */
const hostnameMatches = (url: string, host: string): boolean => {
  try {
    const candidate = new URL(url).hostname.toLowerCase();
    const target = host.toLowerCase().replace(/:\d+$/, "");
    return candidate === target;
  } catch {
    return false;
  }
};

/** The port a URL points at, or "" when it uses the scheme default. */
const portOf = (url: string): string => {
  try {
    return new URL(url).port;
  } catch {
    return "";
  }
};

/**
 * Pick the Google callback URL that matches the incoming request's host.
 *
 * Google only accepts a `redirect_uri` that is pre-registered in the Cloud
 * Console, so the server must present a URI the console already knows about.
 * Only URLs from the configured allow-list are ever returned - the raw
 * `Host` header is never used to build a URL, so this cannot be abused for
 * host-header injection.
 *
 * The `Host` header normally carries the port, so an exact match is enough.
 * When it does not (some proxies strip it), the entry that matches the port
 * this server is actually listening on wins - that keeps local development
 * working across the common 5000/5005 port pair.
 */
export const resolveGoogleCallbackUrl = (host?: string | null): string => {
  if (!host) return ENV.GOOGLE_CALLBACK_URL;

  const exact = ENV.GOOGLE_CALLBACK_URLS.find((url) => hostMatches(url, host));
  if (exact) return exact;

  // Host without a usable port: prefer the entry on the port we serve on.
  const onOurPort = ENV.GOOGLE_CALLBACK_URLS.find(
    (url) => hostnameMatches(url, host) && portOf(url) === String(ENV.PORT)
  );
  if (onOurPort) return onOurPort;

  const sameHost = ENV.GOOGLE_CALLBACK_URLS.find((url) => hostnameMatches(url, host));
  return sameHost ?? ENV.GOOGLE_CALLBACK_URL;
};

/**
 * Pick the frontend URL that matches where the sign-in request came from.
 *
 * The browser navigates to the backend from the frontend, so the `Referer`
 * (or `Origin`) header identifies the frontend host. Only URLs from the
 * configured allow-list are returned - the raw header is never used to build
 * a URL, so this cannot be abused for open-redirect.
 */
export const resolveFrontendUrl = (req?: {
  get?: (name: string) => string | undefined;
}): string => {
  const candidates = [
    req?.get?.("referer"),
    req?.get?.("origin"),
  ].filter((value): value is string => typeof value === "string" && value.length > 0);

  for (const candidate of candidates) {
    let host: string;
    try {
      host = new URL(candidate).host;
    } catch {
      continue;
    }
    const matched = ENV.FRONTEND_URLS.find((url) => hostMatches(url, host));
    if (matched) return matched;
  }

  return ENV.FRONTEND_URL;
};
