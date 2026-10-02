export const tools = [
  {
    slug: "llm-vram-calculator",
    title: "LLM VRAM Calculator",
    category: "Local inference",
    mark: "01",
    description:
      "Estimate weights, KV cache, and runtime memory for dense transformer inference.",
    formula:
      "Total GiB = parameter count × bits / 8 / 2³⁰ + KV cache GiB + overhead GiB.",
    detail:
      "KV cache bytes = 2 × layers × KV heads × head dimension × context tokens × concurrent sequences × bytes per cache element. Enter the actual model architecture; parameter count alone cannot determine cache size. Defaults are illustrative, not a named model.",
    caveat:
      "This is a planning estimate for dense decoder models. Temporary buffers, quantization metadata, runtime allocation, sliding-window attention, hybrid architectures, and GPU sharing can change actual usage.",
  },
  {
    slug: "gpu-compatibility-checker",
    title: "GPU Compatibility Checker",
    category: "Local inference",
    mark: "02",
    description:
      "Compare an inference memory estimate with your available GPU memory.",
    formula:
      "Headroom GiB = GPU capacity GiB − reserved GPU memory GiB − estimated inference GiB.",
    detail:
      "Adjust reserved memory for your display, OS, and other processes. Use actual KV architecture and concurrency to assess the memory budget.",
    caveat:
      "A positive memory margin does not guarantee execution, backend support, or acceptable speed. This checks memory capacity only, for one GPU with full residency.",
  },
  {
    slug: "gguf-size-calculator",
    title: "GGUF Size Calculator",
    category: "Model memory",
    mark: "03",
    description:
      "Estimate the raw weight payload before quantization metadata and GGUF overhead.",
    formula:
      "Weight payload GiB = parameters in billions × 10⁹ × bits per weight / 8 / 2³⁰.",
    detail:
      "Select the nominal precision to compare raw weight payloads. GGUF files may contain tensors at mixed precisions and quantization block scales. An actual file's tensor types and size are authoritative.",
    caveat:
      "This is a lower-bound payload estimate, not an exact GGUF file size. Q4_K_M and similar mixed formats are not exactly four bits per parameter. KV cache and runtime memory are excluded.",
  },
  {
    slug: "quantization-calculator",
    title: "Quantization Calculator",
    category: "Model memory",
    mark: "04",
    description:
      "Compare theoretical FP32, FP16, INT8, and INT4 weight storage.",
    formula: "Raw weight bytes = parameters × nominal bits per weight / 8.",
    detail:
      "Compare weight storage at four precisions for the same parameter count. Quantization scales, zero points, unquantized tensors, and implementation choices add overhead.",
    caveat:
      "Memory savings do not predict accuracy or speed. These numbers exclude KV cache, activations, gradients, optimizer state, and runtime buffers.",
  },
  {
    slug: "llm-cost-calculator",
    title: "LLM API Cost Calculator",
    category: "API planning",
    mark: "05",
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
    category: "Serving capacity",
    mark: "06",
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
