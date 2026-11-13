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
