/**
 * Tests for the SSRF guard (audit H-12).
 *
 * The team-member image endpoint used to fetch any URL the caller supplied
 * and upload the response body to Cloudinary, which is a blind SSRF with
 * full response exfiltration.
 *
 * Run with:
 *   cd grow-backend && node --import tsx --test src/utils/__tests__/safeFetch.test.ts
 */
import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { isPrivateAddress, assertSafeUrl, UnsafeUrlError } from "../safeFetch";

describe("isPrivateAddress", () => {
  test("flags loopback", () => {
    assert.equal(isPrivateAddress("127.0.0.1"), true);
    assert.equal(isPrivateAddress("127.1.2.3"), true);
  });

  test("flags the cloud metadata endpoint", () => {
    assert.equal(isPrivateAddress("169.254.169.254"), true);
  });

  test("flags RFC1918 ranges", () => {
    assert.equal(isPrivateAddress("10.0.0.1"), true);
    assert.equal(isPrivateAddress("172.16.0.1"), true);
    assert.equal(isPrivateAddress("192.168.1.1"), true);
  });

  test("flags IPv6 loopback and link-local", () => {
    assert.equal(isPrivateAddress("::1"), true);
    assert.equal(isPrivateAddress("fe80::1"), true);
    assert.equal(isPrivateAddress("fc00::1"), true);
  });

  test("flags IPv4-mapped IPv6 loopback", () => {
    assert.equal(isPrivateAddress("::ffff:127.0.0.1"), true);
  });

  test("allows public addresses", () => {
    assert.equal(isPrivateAddress("8.8.8.8"), false);
    assert.equal(isPrivateAddress("1.1.1.1"), false);
    assert.equal(isPrivateAddress("93.184.216.34"), false);
  });
});

describe("assertSafeUrl", () => {
  test("rejects a non-http protocol", async () => {
    await assert.rejects(
      () => assertSafeUrl("file:///etc/passwd"),
      UnsafeUrlError
    );
  });

  test("rejects the cloud metadata endpoint", async () => {
    await assert.rejects(
      () => assertSafeUrl("http://169.254.169.254/latest/meta-data/"),
      UnsafeUrlError
    );
  });

  test("rejects loopback by literal IP", async () => {
    await assert.rejects(
      () => assertSafeUrl("http://127.0.0.1:8080/admin"),
      UnsafeUrlError
    );
  });

  test("rejects a blocked port", async () => {
    await assert.rejects(
      () => assertSafeUrl("http://8.8.8.8:6379/"),
      UnsafeUrlError
    );
  });

  test("rejects a malformed URL", async () => {
    await assert.rejects(() => assertSafeUrl("not a url"), UnsafeUrlError);
  });

  test("rejects a hostname that resolves to a private address", async () => {
    // `localhost` always resolves to a loopback address.
    await assert.rejects(
      () => assertSafeUrl("http://localhost:5005/api/secret"),
      UnsafeUrlError
    );
  });

  test("accepts a public https URL", async () => {
    const url = await assertSafeUrl("https://example.com/image.png");
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "example.com");
  });
});
