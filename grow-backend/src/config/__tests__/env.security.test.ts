/**
 * Regression tests for the secret-handling rules (audit C-4 / C-1).
 *
 * The signing keys used to have committed defaults, which meant anyone who
 * cloned the repository could mint a valid token for any account. The config
 * module now refuses to load a missing, placeholder or short secret.
 *
 * Run with:
 *   cd grow-backend && node --import tsx --test src/config/__tests__/env.security.test.ts
 */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "child_process";
import path from "path";

const ENV_MODULE = path.resolve(__dirname, "../env.ts");

/**
 * Load the config module in a child process with a controlled environment so
 * that the module-level throw can be observed.
 */
const loadWith = (overrides: Record<string, string | undefined>): string => {
  const script = `
    try {
      require(${JSON.stringify(ENV_MODULE)});
      console.log("LOADED");
    } catch (error) {
      console.log("THREW:" + error.message);
    }
  `;

  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete env[key];
    else env[key] = value;
  }

  return execFileSync(
    process.execPath,
    ["--import", "tsx", "--eval", script],
    { env, encoding: "utf8", cwd: path.resolve(__dirname, "../../..") }
  );
};

describe("secret configuration", () => {
  test("rejects a missing JWT_SECRET", () => {
    const output = loadWith({ JWT_SECRET: "" });

    assert.match(output, /THREW:/);
    assert.match(output, /JWT_SECRET is not set/);
  });

  test("rejects a JWT_SECRET that is a known placeholder", () => {
    const output = loadWith({
      JWT_SECRET: "your_jwt_secret_key_change_in_production",
    });

    assert.match(output, /THREW:/);
    assert.match(output, /known placeholder/);
  });

  test("rejects a JWT_SECRET that is too short", () => {
    const output = loadWith({ JWT_SECRET: "short" });

    assert.match(output, /THREW:/);
    assert.match(output, /too short/);
  });

  test("rejects a missing JWT_REFRESH_SECRET", () => {
    const output = loadWith({ JWT_REFRESH_SECRET: "" });

    assert.match(output, /THREW:/);
    assert.match(output, /JWT_REFRESH_SECRET is not set/);
  });

  test("rejects a JWT_REFRESH_SECRET that is a known placeholder", () => {
    const output = loadWith({
      JWT_REFRESH_SECRET: "your_refresh_secret_key_change_in_production",
    });

    assert.match(output, /THREW:/);
    assert.match(output, /known placeholder/);
  });

  test("loads when both secrets are strong", () => {
    const output = loadWith({
      JWT_SECRET: "a".repeat(64),
      JWT_REFRESH_SECRET: "b".repeat(64),
    });

    assert.match(output, /LOADED/);
    assert.doesNotMatch(output, /THREW:/);
  });
});
