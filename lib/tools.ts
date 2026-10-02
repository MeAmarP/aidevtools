export const tools = [
  {
    slug: "llm-vram-calculator",
    title: "LLM VRAM Calculator",
    question: "How much VRAM do I need to run an LLM?",
    category: "Local inference",
    mark: "01",
    description:
      "Estimate the GPU memory needed to run an LLM, including model weights, KV cache, and runtime overhead.",
    formula:
      "Total GiB = parameter count × GGUF effective bits per weight / 8 / 2³⁰ + KV cache GiB + overhead GiB.",
    detail:
      "Select a GGUF tensor type to estimate weight storage, then adjust context length, model architecture, and concurrent sequences. KV cache bytes = 2 × layers × KV heads × head dimension × context tokens × concurrent sequences × bytes per cache element. Enter the actual model architecture; parameter count alone cannot determine cache size. Defaults are illustrative, not a named model.",
    caveat:
      "This is a planning estimate for dense decoder models. Effective bits per weight account for common block overhead where available, but mixed tensor types, temporary buffers, runtime allocation, sliding-window attention, hybrid architectures, and GPU sharing can change actual usage. Some listed GGUF tensor types are for scalar data or intermediate results rather than model weights.",
  },
  {
    slug: "gpu-compatibility-checker",
    title: "GPU Compatibility Checker",
    question: "Will this LLM configuration fit on my GPU?",
    category: "Local inference",
    mark: "02",
    description:
      "Compare the estimated memory requirement with your GPU’s available VRAM and reserved memory.",
    formula:
      "Headroom GiB = GPU capacity GiB − reserved GPU memory GiB − estimated inference GiB.",
    detail:
      "The VRAM Calculator answers “How much memory do I need?” This checker answers “Does this configuration fit my GPU?” Adjust reserved memory for your display, OS, and other processes. If the estimate exceeds the budget, reduce context length, concurrent sequences, or weight precision.",
    caveat:
      "All results are estimates. Fitting in memory does not guarantee runtime support or inference speed. This checks memory capacity only, for one GPU with full residency.",
  },
  {
    slug: "gguf-size-calculator",
    title: "GGUF Size Calculator",
    question: "How large is this GGUF, and how much storage does quantization save?",
    category: "Model memory",
    mark: "03",
    description:
      "Estimate GGUF weight payload for a selected tensor type and compare storage with FP16 and FP32.",
    formula:
      "Payload GiB = parameters × effective bits per weight / 8 / 2³⁰; storage saved = (1 − selected payload / baseline payload) × 100%.",
    detail:
      "Select a GGUF tensor type to estimate its raw weight payload and compare it with FP16 and FP32 storage for the same parameter count. The selector includes the formats in Hugging Face’s GGUF quantization table and shows effective bits per weight, including block overhead where available. An actual file may mix tensor types; its tensor inventory and file size are authoritative.",
    caveat:
      "The displayed payload excludes GGUF metadata and alignment, and does not account for mixed or unquantized tensors; an actual GGUF file may be larger. Mixed quantizations such as Q4_K_M are not a single tensor type. Some listed types are intended for intermediate or scalar tensors. Storage savings do not predict accuracy or speed. KV cache and runtime memory are excluded.",
  },
  {
    slug: "llm-cost-calculator",
    title: "LLM API Cost Calculator",
    question: "How much will my LLM API usage cost?",
    category: "API planning",
    mark: "04",
    description:
      "Project daily, monthly, and annual costs using your provider's current rates.",
    formula:
      "Daily USD = requests per day × (input tokens × input rate + output tokens × output rate) / 10⁶.",
    detail:
      "Enter prices in USD per million tokens from your provider's pricing page. Monthly totals use 30 days and annual totals use 365 days. Rates here are illustrative, not provider quotes.",
    caveat:
      "Cached input, reasoning tokens, batch discounts, images, tools, taxes, and currency conversion are not included. Enter billable token counts for your workload.",
  },
  {
    slug: "llm-throughput-calculator",
    title: "Throughput / Concurrency",
    question: "What throughput and concurrency should I plan for?",
    category: "Serving capacity",
    mark: "05",
    description:
      "Estimate aggregate token demand and average in-flight requests.",
    formula:
      "Average concurrency = requests per second × average request latency in seconds.",
    detail:
      "Little's Law connects arrival rate and time in the system under steady-state conditions. Token demand equals requests per second multiplied by average output tokens per request.",
    caveat:
      "This is workload sizing, not a hardware benchmark. Actual capacity depends on prefill, batching, queueing, runtime, and model. Burst traffic requires additional headroom.",
  },
] as const;
export const plannedTools = [
  "Token Counter",
  "RAG Chunking Calculator",
  "Embedding Similarity",
  "VLM Image Token Calculator",
];
export type ToolSlug = (typeof tools)[number]["slug"];
