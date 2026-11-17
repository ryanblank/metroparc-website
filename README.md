This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Website form checks

Keep `FUNNEL_ENABLED=false` during local QA. Use stubs for Funnel availability
and booking responses and a stub or test destination for DAM Ops intake. The
configured Funnel group 7380 is live.

Both write routes use the same Redis REST store. Set
`METROPARC_FORM_REDIS_URL`, `METROPARC_FORM_REDIS_TOKEN`, and a separate
`METROPARC_FORM_HMAC_KEY` on the server. The default
`METROPARC_FORM_LIMIT_MODE=observe` logs duplicate and rate-limit matches.
Switch to `enforce` after tuning against traffic. In enforce mode an
unavailable limiter returns HTTP 503 before writes. Enable
`METROPARC_TRUST_VERCEL_IP=1` only after verifying the trusted proxy header.

The initial thresholds allow eight distinct actions per normalized email
per minute and 40 per trusted IP per minute. Identical lead actions are held
for 30 seconds and identical bookings for 120 seconds, including after an
ambiguous upstream result. Check Funnel before replaying an ambiguous booking.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## NANPA snapshot refresh

Run `npm run refresh:nanpa` locally with Node 24 or newer. The command validates
all 800 NPAs, source dates and service values before atomically replacing
`src/data/nanpa.json`. Service removals stop the refresh for review.
The raw CSV and its SHA-256 are retained in the artifact.

Each site downloads the official source independently using the shared schema
and validation. Record its own retrieval timestamp, source date and checksum. Run `node --experimental-strip-types --test tests/nanpa.test.mjs`,
`node tests/website-phone-routes.cjs`, TypeScript, lint and the site build.
Review the data diff, commit the snapshot and related changes, then use each
site's separately approved normal Git release. Record the artifact version
with the release. Runtime data changes only after a release.

Keep enforcing the last validated snapshot if a refresh fails, regardless of
age. Missing, corrupt or invalid metadata falls back to structural validation.
Planned date-only activations remain provisionally accepted one day before
midnight UTC on the listed date.

## Weekly NANPA automation

The workflow runs Tuesdays at 12:23 UTC and supports manual dispatch on main.
It remains disabled until repository variable `NANPA_REFRESH_ENABLED=true`.
Before enabling, create a dedicated Vercel Deploy Hook for this Metro Parc
project and its production branch `main`, then store its URL as the repository
Actions secret `NANPA_VERCEL_DEPLOY_HOOK`. The URL itself grants deployment
access to that project/branch. No account-wide Vercel token is required.

GitHub Actions must allow contents write access and the refresh identity must
be allowed to push main. The workflow serializes refresh runs, refuses a moved
main branch, stages only the validated snapshot and never force-pushes. Failures
appear as failed Actions runs; enable GitHub Actions failure notifications.

Production delivery uses an explicit POST to that main-branch Deploy Hook after
the snapshot push. Whether this project's Vercel Git integration deploys a
GITHUB_TOKEN-authored push has not been verified. GitHub's workflow recursion
rules alone do not establish how an external Vercel integration behaves.
If both mechanisms trigger, a duplicate build is possible.

A hook response confirms a deployment request, not a Ready production release.
Vercel's deployment/check notifications must be monitored for build failures.
A later successful weekly run requests delivery when the official source changes.
For manual dispatch, select deploy_only to validate and deploy the committed
snapshot without a fresh download or new commit. Old valid committed snapshots remain eligible. Inspect ambiguous hook results before retrying.

Workflow failures are visible in GitHub Actions, and Vercel exposes failed
deployment status/checks. Personal notification delivery requires operator
verification. The current GitHub credential lacks notifications scope, so
email/subscription delivery has not been verified through the CLI.

Download/validation/test failures stop before committing or calling the hook.
Source-date regressions and unexpected in-service removals fail for review.
The deployed artifact stays in place until a later successful release.
The workflow is gated by the repository enable variable and uses a project-specific main-branch hook.


An identical raw CSV checksum leaves the entire artifact, including retrieval
metadata, byte-identical. The weekly workflow skips its commit and deployment
hook in that case. A validated changed checksum is eligible for a snapshot-only
commit and deployment. Manual deploy_only remains an explicit retry even when
the official source is unavailable. Invalid/future metadata, source-date
regressions and unexpected removals fail visibly and retain the prior artifact.
