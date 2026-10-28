# Deploy the frontend to Vercel

1. Import `HabibElias/food-recipe-app` from GitHub into Vercel. Use the repository
   root and the Nuxt framework preset. Select Node.js 22.x in project settings.
   The included `vercel.json` installs the pinned pnpm version through Corepack
   and builds the Nuxt server; do not configure a static output directory.
2. Set these environment variables for Production (and Preview if previews should
   use the same backend):

   | Variable | Example |
   | --- | --- |
   | `NUXT_PUBLIC_GRAPHQL_HTTP_ENDPOINT` | `https://your-hasura-service.onrender.com/v1/graphql` |
   | `NUXT_PUBLIC_GRAPHQL_WS_ENDPOINT` | `wss://your-hasura-service.onrender.com/v1/graphql` |

   Both URLs must point to the public Hasura service, not the Go API service.
   WebSocket subscriptions connect directly from the browser to Hasura. Use HTTPS
   and WSS in production. These settings are public and are also used during SSR.
3. Configure Hasura's allowed CORS origins to include the exact Vercel production
   domain and any preview domains you intend to use. Deploy/redeploy the Vercel
   project after changing environment settings.
4. Check the homepage, login, and recipe queries, then a notification subscription
   after signing in. Check Vercel server logs and Hasura logs when a page loads
   but data is missing.

Never expose `HASURA_GRAPHQL_ADMIN_SECRET`, database credentials, the JWT signing
secret, or a Turso token in `NUXT_PUBLIC_*`. Browsers authenticate using user JWTs;
Hasura needs the appropriate role permissions, actions, and relationships.

## Backend prerequisite

This frontend expects Hasura GraphQL tables/relationships including
`recipe_steps`, `recipe_ingredients`, `recipe_ratings`, categories, and comments,
plus fields such as `recipe.is_paid` and `recipe.prep_time`. They are not all
defined by the backend repository's current `init.sql`. Deployment configuration
does not resolve that mismatch: supply the matching database migrations and
Hasura metadata before treating recipe flows as working.

The current Hasura GraphQL Engine v2/PostgreSQL stack cannot use a Turso libSQL
URL as its PostgreSQL connection string. Keeping this frontend and Hasura stack
requires a supported database and matching metadata. Moving to Turso requires
an API/schema migration rather than changing these endpoint URLs.

## Local development

Copy `.env.example` to `.env`, keep Hasura on port 8080, and run
`corepack pnpm install --frozen-lockfile` followed by `corepack pnpm dev`.
The localhost endpoints remain the defaults when no environment variables are set.
