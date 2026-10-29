type AuthError = {
  message?: string;
  statusCode?: number;
  response?: { status?: number };
  graphQLErrors?: { message?: string; extensions?: { code?: string } }[];
};

function details(error: unknown) {
  const value = error as AuthError | undefined;
  return [value?.message, ...(value?.graphQLErrors ?? []).map(item => `${item.extensions?.code ?? ""} ${item.message ?? ""}`)].join(" ");
}

export function invalidAuthSession(error: unknown) {
  return /invalid-jwt|jwt-invalid-claims|jwt.*expired|token.*expired|invalid token|unauthorized/i.test(details(error));
}

export function authErrorMessage(error: unknown, signup: boolean) {
  const message = details(error);
  if (/AUTH_UNAVAILABLE|not a valid json response|failed to fetch|network error|fetch failed/i.test(message))
    return "The kitchen is taking longer to connect. Please try again in a moment.";
  if (/invalid credentials/i.test(message))
    return "That email and password didn't match. Please try again.";
  if (signup && /user already exists|email.*already/i.test(message))
    return "An account already uses that email. Sign in instead.";
  if (signup && /username.*taken|username.*already/i.test(message))
    return "That kitchen name is already taken. Choose another.";
  return signup
    ? "We couldn't create your account. Check your details, or try a different email and kitchen name."
    : "We couldn't sign you in. Check your email and password, then try again.";
}

// Poll only read-only readiness checks. Never replay a signup or login mutation.
export async function waitForAuthBackend(check: () => Promise<unknown>, options: {
  timeoutMs?: number;
  delayMs?: number;
  now?: () => number;
  wait?: (milliseconds: number) => Promise<void>;
} = {}) {
  const now = options.now ?? Date.now;
  const wait = options.wait ?? (milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds)));
  const deadline = now() + (options.timeoutMs ?? 90_000);
  while (true) {
    try { await check(); return; }
    catch (error) {
      const value = error as AuthError;
      const status = value.statusCode ?? value.response?.status;
      if (status && ![408, 429, 502, 503, 504].includes(status)) throw error;
      if (now() >= deadline) throw new Error("AUTH_UNAVAILABLE");
      await wait(Math.min(options.delayMs ?? 1500, deadline - now()));
    }
  }
}
