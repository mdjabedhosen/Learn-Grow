import { createApp } from "./app.js";
import { config } from "./config/index.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./database/mongoose.js";
import { ensureAdminUsers } from "./utils/ensureAdmin.js";
import {
  probeRedirectUris,
  detectPortDrift,
  consoleInstructions,
  cacheRedirectUriVerdicts,
} from "./utils/googleRedirectCheck.js";

const logGoogleOauthSetup = () => {
  if (!ENV.GOOGLE_CLIENT_ID || !ENV.GOOGLE_CLIENT_SECRET) {
    console.warn(
      "[google-oauth] Disabled - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not set. " +
        "Google sign-in will not work."
    );
    return;
  }

  console.log("[google-oauth] redirect_uri(s) that MUST be registered in the Google Cloud Console:");
  for (const url of ENV.GOOGLE_CALLBACK_URLS) {
    console.log(`[google-oauth]   - ${url}`);
  }
  console.log(
    "[google-oauth] A Google error `redirect_uri_mismatch` means the URI the server sent " +
      "is not on that list - add it to the OAuth client's Authorized redirect URIs."
  );
  console.log("[google-oauth] Verify with: npm run google:oauth:check");
};

/**
 * Ask Google which of the configured redirect URIs are actually registered.
 *
 * Runs in the background so it never delays startup, but it turns Google's
 * cryptic "Access blocked / redirect_uri_mismatch" page into a clear message
 * in the terminal - including the usual cause, port drift.
 */
const verifyGoogleOauthSetup = async () => {
  if (!ENV.GOOGLE_CLIENT_ID || !ENV.GOOGLE_CLIENT_SECRET) return;

  try {
    const probes = await probeRedirectUris(ENV.GOOGLE_CALLBACK_URLS);
    // Cache the verdicts so the /google route can refuse to hand the browser
    // to Google when the URI it would send is known to be unregistered.
    cacheRedirectUriVerdicts(probes);
    const rejected = probes.filter((p) => p.verdict !== "ACCEPTED");

    for (const { uri, verdict } of probes) {
      console.log(`[google-oauth] ${verdict === "ACCEPTED" ? "ok      " : "MISSING "} ${uri}`);
    }

    if (rejected.length === 0) {
      console.log("[google-oauth] All configured redirect URIs are registered.");
      return;
    }

    const drift = await detectPortDrift(probes);

    console.warn(
      "[google-oauth] WARNING: some redirect URIs are NOT registered - " +
        "Google sign-in will fail with `redirect_uri_mismatch`."
    );

    if (drift) {
      console.warn(
        `[google-oauth] Port drift: this server sends port ${drift.currentPort}, ` +
          `but Google has port ${drift.registeredPort} registered.`
      );
      console.warn(`[google-oauth]   Add this URI: ${drift.configuredUri}`);
    }

    console.warn(`[google-oauth]   ${consoleInstructions()}`);
    console.warn("[google-oauth]   Re-check with: npm run google:oauth:check");
  } catch (error) {
    // Never let a network hiccup affect startup.
    console.warn(
      `[google-oauth] Could not verify redirect URIs: ${(error as Error).message}`
    );
  }
};

const start = async () => {
  try {
    // check database connection env
    const dbConnectionEnv = config.MONGODB_URI;

    logGoogleOauthSetup();

    // Fire-and-forget: never blocks startup, never fails it.
    void verifyGoogleOauthSetup();

    await connectDB();
    await ensureAdminUsers();
    const app = createApp();
    app.listen(config.PORT, () => {
    });
  } catch (err) {
    process.exit(1);
  }
};

start();
