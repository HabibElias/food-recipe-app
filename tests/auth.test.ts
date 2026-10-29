import assert from "node:assert/strict";
import test from "node:test";
import { authErrorMessage, invalidAuthSession, waitForAuthBackend } from "../shared/utils/auth.ts";

test("sleeping services are checked before the account request runs once", async () => {
  let clock = 0;
  let probes = 0;
  let mutations = 0;
  await waitForAuthBackend(async () => {
    assert.equal(mutations, 0);
    if (++probes < 3) throw { statusCode: 503 };
  }, { timeoutMs: 10, delayMs: 2, now: () => clock, wait: async duration => { clock += duration; } });
  mutations++;
  assert.equal(probes, 3);
  assert.equal(mutations, 1);
});

test("an unavailable service stops at the deadline without an account request", async () => {
  let clock = 0;
  let probes = 0;
  await assert.rejects(waitForAuthBackend(async () => {
    probes++;
    throw { response: { status: 503 } };
  }, { timeoutMs: 5, delayMs: 3, now: () => clock, wait: async duration => { clock += duration; } }), /AUTH_UNAVAILABLE/);
  assert.equal(clock, 5);
  assert.equal(probes, 3);
});

test("configuration and permission failures are not treated as sleeping services", async () => {
  let probes = 0;
  await assert.rejects(waitForAuthBackend(async () => {
    probes++;
    throw Object.assign(new Error("Missing route"), { statusCode: 404 });
  }), /Missing route/);
  assert.equal(probes, 1);
});

test("temporary backend errors do not invalidate a saved session", () => {
  for (const error of [new Error("AUTH_UNAVAILABLE"), { message: "not a valid json response from webhook" }, { message: "Failed to fetch" }])
    assert.equal(invalidAuthSession(error), false);
  assert.equal(invalidAuthSession({ graphQLErrors: [{ message: "Could not verify JWT", extensions: { code: "invalid-jwt" } }] }), true);
  assert.equal(invalidAuthSession(new Error("token is expired")), true);
});

test("account errors are helpful without showing backend diagnostics", () => {
  assert.match(authErrorMessage(new Error("invalid credentials"), false), /didn't match/);
  assert.match(authErrorMessage(new Error("user already exists"), true), /Sign in instead/);
  assert.match(authErrorMessage(new Error("username already taken"), true), /Choose another/);
  assert.match(authErrorMessage(new Error("AUTH_UNAVAILABLE"), false), /try again in a moment/);
  assert.doesNotMatch(authErrorMessage(new Error("private infrastructure diagnostics"), false), /private infrastructure/);
});
