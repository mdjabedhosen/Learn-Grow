/**
 * Google OAuth redirect_uri checker.
 *
 * Google only accepts a `redirect_uri` that is already registered under the
 * OAuth client's "Authorized redirect URIs". When that list is out of date
 * Google replies with:
 *
 *     Access blocked: This app's request is invalid
 *     Error 400: redirect_uri_mismatch
 *
 * This script asks Google directly which of the candidate URIs are accepted,
 * so you can see exactly what still has to be registered instead of guessing
 * from the browser error page. It also detects the usual cause of a
 * local-only mismatch: the client was registered for a different local port.
 *
 * Usage:
 *   npm run google:oauth:check
 *   npm run google:oauth:check -- <extra-url> [<extra-url> ...]
 *
 * Exit code 0 = every URI is registered, 1 = at least one is missing.
 */
import {
  probeRedirectUris,
  detectPortDrift,
  consoleInstructions,
} from "../utils/googleRedirectCheck.js";
import { ENV } from "../config/env.js";

const run = async () => {
  if (!ENV.GOOGLE_CLIENT_ID) {
    console.error(
      "GOOGLE_CLIENT_ID is not set - the OAuth client is unknown. " +
        "Check grow-backend/.env."
    );
    process.exit(1);
  }

  const extra = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const candidates = Array.from(
    new Set([...ENV.GOOGLE_CALLBACK_URLS, ...extra])
  );

  console.log(`OAuth client : ${ENV.GOOGLE_CLIENT_ID}`);
  console.log(`Running on   : port ${ENV.PORT}`);
  console.log(
    `Configured   : ${ENV.GOOGLE_CALLBACK_URLS.join("\n                ")}`
  );
  if (extra.length) {
    console.log(`Extra        : ${extra.join("\n                ")}`);
  }
  console.log("");

  const probes = await probeRedirectUris(candidates);
  let missing = 0;

  for (const { uri, verdict } of probes) {
    const mark = verdict === "ACCEPTED" ? "[ok]  " : "[MISS]";
    console.log(`  ${mark} ${uri}  -> ${verdict}`);
    if (verdict !== "ACCEPTED") missing++;
  }

  if (missing > 0) {
    const drift = await detectPortDrift(probes);

    console.log("");
    if (drift) {
      console.log("!! Port drift detected.");
      console.log(`   This server sends : ${drift.configuredUri}  (port ${drift.currentPort})`);
      console.log(`   Google has       : ${drift.acceptedUri}  (port ${drift.registeredPort})`);
      console.log("");
      console.log("   The OAuth client was registered for a different local port.");
      console.log("   Two ways to fix it:");
      console.log("");
      console.log("   (a) Add the URI this server actually sends - 30 seconds:");
      console.log(`         ${drift.configuredUri}`);
      console.log("");
      console.log("   (b) Or run this server on the port Google already has:");
      console.log(`         PORT=${drift.registeredPort}`);
      console.log("");
      console.log("   Add it under:");
      console.log(`  ${consoleInstructions()}`);
    } else {
      console.log(`${missing} redirect URI(s) are NOT registered.`);
      console.log("Add them under:");
      console.log(`  ${consoleInstructions()}`);
    }
    console.log("");
    console.log("A missing entry causes: Error 400: redirect_uri_mismatch");
  } else {
    console.log("");
    console.log("All redirect URIs are registered in the Google Cloud Console.");
  }

  process.exit(missing === 0 ? 0 : 1);
};

run();
