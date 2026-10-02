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
| `/tools/gguf-size-calculator` | GGUF type payload estimates and storage savings versus FP16 / FP32 |
| `/tools/llm-cost-calculator` | User-supplied rates, billable tokens, and daily request counts |
| `/tools/llm-throughput-calculator` | Steady-state concurrency and aggregate output demand |
| `/tools/llm-token-calculator` | Local token counts using the o200k_base encoding |
| `/tools/llm-context-window-calculator` | Input/output budget against a model context limit |
| `/tools/llm-batch-size-calculator` | Memory-bounded maximum sequences from GPU and KV-cache budgets |

All calculations run client-side. Defaults are illustrative. Memory is displayed in **GiB**, not decimal GB. Every page includes formulas and limitations. No provider pricing or model architectures are asserted from unmaintained presets.

## Development plan

This checklist reflects the current shipped status of the calculator suite and the next items still to build.

### LLM

- [x] Token calculator — available at `/tools/llm-token-calculator` (o200k_base encoding).
- [x] LLM cost calculator — available at `/tools/llm-cost-calculator`.
- [x] VRAM calculator — available at `/tools/llm-vram-calculator`.
- [x] Context window calculator — available at `/tools/llm-context-window-calculator`.
- [x] KV-cache calculator — included in the `llm-vram-calculator` estimate and sizing model.
- [x] Batch-size calculator — available at `/tools/llm-batch-size-calculator`.
- [x] Throughput calculator — available at `/tools/llm-throughput-calculator`.

### RAG

- [ ] Chunk size calculator
- [ ] Chunk overlap calculator
- [ ] Embedding cost calculator
- [ ] Vector DB storage calculator
- [ ] Retrieval precision calculator

### GPU

- [x] GPU VRAM calculator — available at `/tools/llm-vram-calculator` and `/tools/gpu-compatibility-checker`.
- [ ] Multi-GPU calculator
- [ ] GPU utilization calculator
- [x] Model fitting calculator — available at `/tools/gpu-compatibility-checker`.

### AI deployment

- [x] API cost calculator — available at `/tools/llm-cost-calculator`.
- [ ] Server capacity calculator
- [x] Requests/sec calculator — available at `/tools/llm-throughput-calculator`.
- [x] Concurrency calculator — available at `/tools/llm-throughput-calculator`.
- [ ] Latency calculator

### Notes

- The current toolset already includes the LLM memory, cost, and throughput calculators.
- Planned RAG and GPU expansion items still need dedicated calculator pages and validation.
- Planned tools do not have placeholder indexed routes.

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
