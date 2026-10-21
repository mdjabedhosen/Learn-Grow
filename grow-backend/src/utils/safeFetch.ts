/**
 * Safe outbound HTTP fetch.
 *
 * The team-member image endpoint accepted an arbitrary URL and fetched it
 * server-side, then uploaded the response body to Cloudinary and returned
 * the public URL. That is a blind SSRF with full response exfiltration:
 * `http://169.254.169.254/latest/meta-data/` and every other internal
 * endpoint were reachable.
 *
 * This helper refuses anything that is not a plain public HTTP(S) URL, and
 * it resolves the hostname and rejects private, loopback, link-local and
 * other reserved ranges - both for the initial request and for every
 * redirect it follows.
 */
import dns from "dns/promises";
import net from "net";

/** Only plain HTTP(S) is allowed. */
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/** Ports that are never legitimate for an image fetch. */
const BLOCKED_PORTS = new Set([
  22, 23, 25, 53, 110, 143, 465, 587, 993, 995, 1433, 1521, 3306, 5432,
  6379, 9200, 11211, 27017, 27018, 5000, 5005, 8080, 9200, 2375, 2376,
]);

/** Maximum response size we will buffer (10 MB). */
const MAX_BYTES = 10 * 1024 * 1024;

/** Request timeout. */
const TIMEOUT_MS = 10_000;

/** How many redirects to follow. */
const MAX_REDIRECTS = 3;

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsafeUrlError";
  }
}

/** True for an IP address in a private / reserved range. */
export const isPrivateAddress = (address: string): boolean => {
  const ip = address.replace(/^::ffff:/i, "");

  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
      return true;
    }
    const [a, b] = parts;

    if (a === 0) return true;                       // 0.0.0.0/8
    if (a === 10) return true;                      // 10.0.0.0/8
    if (a === 127) return true;                     // 127.0.0.0/8 loopback
    if (a === 169 && b === 254) return true;        // 169.254.0.0/16 link-local (cloud metadata)
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true;        // 192.168.0.0/16
    if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 carrier NAT
    if (a === 192 && b === 0) return true;         // 192.0.0.0/24
    if (a === 198 && (b === 18 || b === 19)) return true; // 198.18.0.0/15 benchmarking
    if (a >= 224) return true;                     // multicast + reserved
    return false;
  }

  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === "::" || lower === "::1") return true;
    if (lower.startsWith("fe80")) return true;         // link-local
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local
    if (lower.startsWith("ff")) return true;           // multicast
    // IPv4-mapped
    const mapped = lower.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateAddress(mapped[1]);
    return false;
  }

  return true; // not an IP at all -> not safe to connect to directly
};

/**
 * Validate a URL and resolve its hostname, rejecting private addresses.
 */
export const assertSafeUrl = async (rawUrl: string): Promise<URL> => {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new UnsafeUrlError("Invalid URL");
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    throw new UnsafeUrlError(`Only http and https URLs are allowed (got ${url.protocol})`);
  }

  if (url.port && BLOCKED_PORTS.has(Number(url.port))) {
    throw new UnsafeUrlError(`Port ${url.port} is not allowed`);
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "");

  // A literal IP address must be public.
  if (net.isIP(hostname)) {
    if (isPrivateAddress(hostname)) {
      throw new UnsafeUrlError("Private or reserved IP addresses are not allowed");
    }
    return url;
  }

  // A hostname must resolve only to public addresses. This blocks DNS
  // rebinding to an internal address.
  let addresses: Array<{ address: string }>;
  try {
    addresses = await dns.lookup(hostname, { all: true });
  } catch {
    throw new UnsafeUrlError(`Could not resolve host "${hostname}"`);
  }

  if (!addresses.length) {
    throw new UnsafeUrlError(`Could not resolve host "${hostname}"`);
  }

  for (const { address } of addresses) {
    if (isPrivateAddress(address)) {
      throw new UnsafeUrlError(
        `Host "${hostname}" resolves to a private or reserved address`
      );
    }
  }

  return url;
};

/**
 * Fetch a URL safely: public addresses only, no internal targets, size and
 * time capped, and every redirect re-validated.
 */
export const safeFetch = async (
  rawUrl: string,
  options: { maxBytes?: number; timeoutMs?: number } = {}
): Promise<{ buffer: Buffer; contentType: string; finalUrl: string }> => {
  const maxBytes = options.maxBytes ?? MAX_BYTES;
  const timeoutMs = options.timeoutMs ?? TIMEOUT_MS;

  let currentUrl = rawUrl;

  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect++) {
    const url = await assertSafeUrl(currentUrl);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetch(url, {
        redirect: "manual",
        signal: controller.signal,
        headers: { "User-Agent": "LearnGrow-ImageFetcher/1.0" },
      });
    } catch (error: any) {
      clearTimeout(timer);
      throw new UnsafeUrlError(`Request failed: ${error.message}`);
    }
    clearTimeout(timer);

    // Follow the redirect ourselves so the new target is validated too.
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        throw new UnsafeUrlError("Redirect without a Location header");
      }
      currentUrl = new URL(location, url).toString();
      continue;
    }

    if (!response.ok) {
      throw new UnsafeUrlError(`Request failed with status ${response.status}`);
    }

    const contentLength = Number(response.headers.get("content-length") || "0");
    if (contentLength && contentLength > maxBytes) {
      throw new UnsafeUrlError("Response is too large");
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length > maxBytes) {
      throw new UnsafeUrlError("Response is too large");
    }

    return { buffer, contentType, finalUrl: url.toString() };
  }

  throw new UnsafeUrlError("Too many redirects");
};
