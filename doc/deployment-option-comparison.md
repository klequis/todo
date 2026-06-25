# Deployment Option Comparison

Assumes: SolidJS full-stack app, daily but light usage (personal/small team), Node.js backend, persistent database.

## Railway vs Vercel vs AWS SST

| | Railway | Vercel | AWS SST |
|---|---|---|---|
| **Pros** | Full-stack in one place (frontend + server + DB) | Best DX, instant deploys, huge ecosystem | Full AWS power, scales infinitely, no vendor lock-in |
| | Persistent server (not serverless) — great for WebSockets, long tasks | Generous free tier for frontend/serverless | Fine-grained cost control at scale |
| | Simple pricing, predictable costs | Automatic preview deployments per PR | SolidStart preset built-in |
| | Low config, git-push deploys | Global CDN out of the box | Production-grade from day one |
| **Cons** | Smaller ecosystem than Vercel/AWS | Backend = serverless only (no persistent connections) | Steep setup and learning curve |
| | No persistent DB on free tier (must pay ~$5/mo for hobby) | DB must be hosted externally (Neon, Turso, etc.) | AWS console complexity |
| | Less global CDN coverage than Cloudflare/Vercel | Cold starts on serverless functions | Overkill for a personal app |
| | Smaller community / fewer integrations | Costs spike if serverless functions run long | Harder to estimate costs upfront |
| **Est. cost (light use)** | ~$5/mo (Hobby plan covers server + DB) | ~$0/mo frontend + ~$0–10/mo external DB | ~$1–5/mo (Lambda + S3 + minimal traffic) |

## Recommendation

**Start with Railway.** $5/mo covers everything — server, database, deploys — with minimal configuration. Switch to AWS SST only if you need to scale or want full infrastructure control.
