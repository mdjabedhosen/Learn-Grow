/**
 * Live verification of Google OAuth redirect URIs.
 *
 * Google only accepts a `redirect_uri` that is already registered on the
 * OAuth client. When it is not, Google answers with
 *
 *     Access blocked: This app's request is invalid
 *     Error 400: redirect_uri_mismatch
 *
 * which is famously unhelpfully vague. This module asks Google directly,
 * so the exact mismatch is visible instead of guessed at.
 *
 * It also detects the most common cause of a local-only mismatch: **port
 * drift** - the OAuth client was registered against `http://localhost:5000`
 * while the backend now runs on `http://localhost:5005` (for example because
 * macOS' AirPlay Receiver permanently occupies port 5000).
 */
import { ENV } from "../config/env.js";

export type RedirectUriVerdict = "ACCEPTED" | "REJECTED" | "UNKNOWN";

export interface RedirectUriProbe {
  uri: string;
  verdict: RedirectUriVerdict;
}

export interface PortDriftHint {
  /** the URI this server is configured to send, which Google rejects */
  configuredUri: string;
  /** a URI Google does accept, on the same host and path but another port */
  acceptedUri: string;
  /** the port the server is running on */
  currentPort: string;
  /** the port Google has registered */
  registeredPort: string;
}

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";

/** Ports worth probing when the configured URI is rejected. */
const CANDIDATE_PORTS = [
  "3000", "3001", "4000", "4200", "5000", "5001", "5005", "5173", "8000", "8080",
];

const CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";

/**
 * Ask Google whether a redirect_uri would be accepted for this client.
 *
 * A mismatch is served as a redirect to Google's "Access blocked" page, so we
 * follow the redirect chain and look for that marker.
 */
export const probeRedirectUri = async (
  redirectUri: string,
  timeoutMs = 20000
): Promise<RedirectUriVerdict> => {
  if (!ENV.GOOGLE_CLIENT_ID) return "UNKNOWN";

  const url =
    `${AUTH_ENDPOINT}?response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent("profile email")}` +
    `&client_id=${encodeURIComponent(ENV.GOOGLE_CLIENT_ID)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": CHROME_UA, "Accept-Language": "en-US,en;q=0.9" },
    });
    const body = await response.text();

    if (/Access blocked/i.test(body) || /redirect_uri_mismatch/i.test(body)) {
      return "REJECTED";
    }
    if (
      /consent|Sign in|ServiceLogin|Choose an account|Create an account/i.test(body)
    ) {
      return "ACCEPTED";
    }
    return "UNKNOWN";
  } catch {
    return "UNKNOWN";
  } finally {
    clearTimeout(timer);
  }
};

/** Probe several URIs concurrently. */
export const probeRedirectUris = async (
  uris: string[],
  timeoutMs = 20000
): Promise<RedirectUriProbe[]> => {
  const probes = await Promise.all(
    uris.map(async (uri) => ({ uri, verdict: await probeRedirectUri(uri, timeoutMs) }))
  );
  return probes;
};

/**
 * Look for a port-drift explanation: the same host+path registered on a
 * different port than the one this server is configured to use.
 */
export const detectPortDrift = async (
  probes: RedirectUriProbe[]
): Promise<PortDriftHint | null> => {
  for (const probe of probes) {
    if (probe.verdict !== "REJECTED") continue;

    let url: URL;
    try {
      url = new URL(probe.uri);
    } catch {
      continue;
    }

    const currentPort = url.port || "80";
    const rejected = new Set([currentPort]);

    for (const port of CANDIDATE_PORTS) {
      if (rejected.has(port)) continue;
      rejected.add(port);

      const candidate = `${url.protocol}//${url.hostname}:${port}${url.pathname}`;
      const verdict = await probeRedirectUri(candidate);
      if (verdict === "ACCEPTED") {
        return {
          configuredUri: probe.uri,
          acceptedUri: candidate,
          currentPort,
          registeredPort: port,
        };
      }
    }
  }

  return null;
};

/** Human-readable instructions for the Google Cloud Console. */
export const consoleInstructions = (): string =>
  [
    "Google Cloud Console > APIs & Services > Credentials",
    "  > your OAuth client (Web application)",
    "    > Authorized redirect URIs > Add URI",
  ].join("\n  ");

/* ------------------------------------------------------------------ */
/* verdict cache                                                       */
/*                                                                     */
/* The startup probe writes into this cache so that the OAuth start     */
/* route can refuse to hand the browser to Google when the URI it is   */
/* about to send is known to be unregistered. That turns Google's        */
/* cryptic "Access blocked" page into an actionable message.            */
/* ------------------------------------------------------------------ */

const verdictCache = new Map<string, RedirectUriVerdict>();

export const cacheRedirectUriVerdicts = (probes: RedirectUriProbe[]): void => {
  for (const { uri, verdict } of probes) {
    verdictCache.set(uri, verdict);
  }
};

export const getRedirectUriVerdict = (
  uri: string
): RedirectUriVerdict | undefined => verdictCache.get(uri);

/** Clear the cache (used by tests). */
export const clearRedirectUriVerdicts = (): void => verdictCache.clear();
