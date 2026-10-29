export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");
  const config = useRuntimeConfig(event);
  try {
    const checks: Promise<unknown>[] = [
      $fetch<{ data?: { __typename?: string } }>(config.public.graphqlHttpEndpoint, {
        method: "POST", body: { query: "query AuthReadiness { __typename }" }, timeout: 6000, retry: 0,
      }).then(result => {
        if (result.data?.__typename !== "query_root") throw new Error("GraphQL is starting");
      }),
    ];
    if (config.authHealthEndpoint) {
      checks.push($fetch<{ status?: string }>(config.authHealthEndpoint, { timeout: 6000, retry: 0 }).then(result => {
        if (result.status !== "ok") throw new Error("Authentication is starting");
      }));
    }
    await Promise.all(checks);
    return { ready: true };
  }
  catch {
    setResponseHeader(event, "Retry-After", "2");
    throw createError({ statusCode: 503, statusMessage: "The kitchen is starting. Please try again shortly." });
  }
});
