# AI Dev Tools

Free calculators and utilities for LLMs, GPUs, RAG and local AI. A lightweight Next.js + TypeScript starter for GitHub → Vercel deployment. MIT licensed.

## Run locally

Use Node.js 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

## Available tools

| Route | Function |
| --- | --- |
| `/tools/llm-vram-calculator` | Raw weights + architecture-aware KV cache + manual runtime overhead |
| `/tools/gpu-compatibility-checker` | Single-GPU memory budget and headroom |
| `/tools/gguf-size-calculator` | Nominal weight payload; explicitly excludes format overhead |
| `/tools/quantization-calculator` | FP32 / FP16 / INT8 / INT4 raw storage comparison |
| `/tools/llm-cost-calculator` | User-supplied rates, billable tokens, and daily request counts |
| `/tools/llm-throughput-calculator` | Steady-state concurrency and aggregate output demand |

All calculations run client-side. Defaults are illustrative. Memory is displayed in **GiB**, not decimal GB. Every page includes formulas and limitations. No provider pricing or model architectures are asserted from unmaintained presets.

## Roadmap

- Token counter: exact counts only for supported tokenizers; label approximations.
- RAG chunking playground: visualize boundaries and overlap with an explicit tokenizer.
- Embedding similarity: optional small browser model, model download consent, and worker execution.
- VLM image token estimates: provider-specific rules with source links and update dates.
- Add actual model metadata and GGUF tensor inspection before exact model recommendations.
- Add Tailwind if useful as the design system grows; this initial version uses plain CSS.

Planned tools do not have placeholder indexed routes.

## Deploy on Vercel

1. Import `MeAmarP/aidevtools` into Vercel.
2. Select Next.js; root directory is the repository root. Default install/build settings work (`npm ci` / `npm run build`). No database or API keys required.
3. Use the repository's default branch, `master`, for production.
4. After obtaining the actual deployment URL, set `NEXT_PUBLIC_SITE_URL` to its HTTPS origin and redeploy. Later replace it with your verified custom domain. This enables canonical tool URLs and sitemap entries without claiming an unregistered domain.
5. Confirm `/robots.txt`, `/sitemap.xml`, and the calculator pages on your deployment. Keep preview deployments out of search indexing using Vercel's deployment controls.

Vercel Hobby is limited to non-commercial personal use. Use a plan permitting commercial use for an ad-supported site. See https://vercel.com/docs/plans/hobby and https://vercel.com/docs/limits/fair-use-guidelines.

AdSense, analytics, and tracking are **not configured**. Before adding them, update privacy disclosures, implement applicable consent handling, and configure your publisher/account identifiers. No fabricated `ads.txt` entry is supplied.

## Validation

```sh
npm run lint
npm test
npm run build
npm run typecheck
```

CI runs these checks on pushes to `master` and pull requests. Calculation tests cover binary units, GQA cache sizing, concurrency, costs, and invalid inputs.

## Project structure

- `app/`: static landing page, tool routes, about/privacy pages, metadata, sitemap, robots.
- `components/calculator.tsx`: interactive browser-only calculator forms.
- `lib/calculations.ts`: pure numerical functions.
- `lib/tools.ts`: tool catalog, formulas, assumptions, and roadmap.
- `tests/`: numerical regression checks.

## Contributing

Open an issue or pull request at https://github.com/MeAmarP/aidevtools. Keep formulas testable and document approximations. Do not commit secrets or user data.
