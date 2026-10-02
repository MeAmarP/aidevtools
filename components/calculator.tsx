"use client";
import { useEffect, useState } from "react";
import type { ToolSlug } from "@/lib/tools";
import {
  memory,
  weights,
  cost,
  throughput,
  contextWindow,
  batchSize,
  ggufQuantizationTypes,
} from "@/lib/calculations";
import GgufQuantizationReference from "@/components/gguf-quantization-reference";
const defaults: Record<string, number | string> = {
  parametersB: 8,
  quantType: ggufQuantizationTypes.findIndex((type) => type.name === "Q4_K"),
  layers: 32,
  kvHeads: 8,
  headDim: 128,
  context: 8192,
  sequences: 1,
  cacheBytes: 2,
  overhead: 1,
  gpu: 16,
  reserved: 2,
  input: 1000,
  output: 500,
  inputRate: 1,
  outputRate: 3,
  requests: 1000,
  rps: 2,
  latency: 5,
  contextLimit: 8192,
  inputTokens: 6000,
  outputTokens: 1500,
  tokenText: "",
};
const labels: Record<string, string> = {
  parametersB: "Parameters (billions)",
  quantType: "GGUF tensor type",
  layers: "Transformer layers",
  kvHeads: "KV heads per layer",
  headDim: "Head dimension",
  context: "Context tokens per sequence",
  sequences: "Concurrent sequences",
  cacheBytes: "KV bytes per element",
  overhead: "Runtime overhead (GiB)",
  gpu: "GPU memory capacity (GiB)",
  reserved: "Reserved GPU memory (GiB)",
  input: "Input tokens per request",
  output: "Output tokens per request",
  inputRate: "Input USD / million tokens",
  outputRate: "Output USD / million tokens",
  requests: "Requests per day",
  rps: "Requests per second",
  latency: "Mean request latency (seconds)",
  contextLimit: "Model context limit (tokens)",
  inputTokens: "Input and history (tokens)",
  outputTokens: "Planned output (tokens)",
  tokenText: "Text to count",
};
const parameterHelp: Record<string, string> = {
  parametersB: "The model’s total parameter count, measured in billions.",
  quantType:
    "The GGUF tensor type used to estimate average storage per model weight.",
  layers: "The number of transformer blocks in the model architecture.",
  kvHeads: "The key-value attention heads stored in the KV cache per layer.",
  headDim: "The vector width of each attention head.",
  context: "The maximum tokens retained for each active sequence.",
  sequences: "The number of requests held in memory at the same time.",
  cacheBytes: "The bytes used for each KV-cache element, commonly 2 for FP16.",
  overhead: "Extra memory reserved for runtime buffers and allocations.",
  gpu: "The total physical VRAM available on the GPU being evaluated.",
  reserved: "VRAM kept available for the display, operating system, and other processes.",
  input: "The average number of input tokens sent in each request.",
  output: "The average number of output tokens generated per request.",
  inputRate: "Your provider’s price in USD per million input tokens.",
  outputRate: "Your provider’s price in USD per million output tokens.",
  requests: "The number of requests you expect to send each day.",
  rps: "The average number of requests arriving each second.",
  latency: "The average time, in seconds, from request arrival to completion.",
  contextLimit: "The total context capacity advertised for the target model.",
  inputTokens: "All prompt tokens, including instructions and conversation history.",
  outputTokens: "The output-token budget requested for this completion.",
  tokenText: "Text is counted locally using the o200k_base tokenizer encoding.",
};
const architecture = [
  "parametersB",
  "quantType",
  "layers",
  "kvHeads",
  "headDim",
  "context",
  "sequences",
  "cacheBytes",
  "overhead",
];
const simpleArchitecture = ["parametersB", "quantType", "context", "overhead"];

function resultParts(value: string) {
  const match = value.match(/^(-?[\d,.]+(?:\.\d+)?)(?:\s+(.+))?$/);
  return match ? { amount: match[1], unit: match[2] ?? "" } : null;
}

export default function Calculator({ slug }: { slug: ToolSlug }) {
  const [mode, setMode] = useState<"simple" | "advanced">("simple");
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      Object.entries(defaults).map(([k, v]) => [k, String(v)]),
    ),
  );
  const supportsAdvanced =
    slug === "llm-vram-calculator" || slug === "gpu-compatibility-checker";
  useEffect(() => {
    if (slug !== "llm-token-calculator") return;
    let cancelled = false;
    import("@/lib/tokenizer").then(({ countTokens }) => {
      if (!cancelled) setTokenCount(countTokens(values.tokenText));
    });
    return () => {
      cancelled = true;
    };
  }, [slug, values.tokenText]);
  let fields: string[] =
    supportsAdvanced && mode === "simple" ? simpleArchitecture : architecture;
  if (slug === "gpu-compatibility-checker")
    fields = ["gpu", "reserved", ...fields];
  if (slug === "gguf-size-calculator") fields = ["parametersB", "quantType"];
  if (slug === "llm-cost-calculator")
    fields = ["input", "output", "inputRate", "outputRate", "requests"];
  if (slug === "llm-throughput-calculator")
    fields = ["rps", "latency", "output"];
  if (slug === "llm-token-calculator") fields = ["tokenText"];
  if (slug === "llm-context-window-calculator")
    fields = ["contextLimit", "inputTokens", "outputTokens"];
  if (slug === "llm-batch-size-calculator")
    fields = [
      "gpu",
      "reserved",
      "parametersB",
      "quantType",
      "layers",
      "kvHeads",
      "headDim",
      "context",
      "cacheBytes",
      "overhead",
    ];
  const v = Object.fromEntries(
    Object.entries(values).map(([k, x]) => [k, Number(x)]),
  );
  const selectedType = ggufQuantizationTypes[Number(values.quantType)];
  let rows: [string, string][] = [];
  let error = "";
  const f = (x: number, unit: string) => {
    const amount = x.toLocaleString("en-US", { maximumFractionDigits: 3 });
    return unit ? `${amount} ${unit}` : amount;
  };
  try {
    if (
      fields.some(
        (k) =>
          k !== "quantType" &&
            k !== "tokenText" &&
          (values[k].trim() === "" || !Number.isFinite(v[k]) || v[k] < 0),
      ) || !selectedType
    )
      throw new Error("Enter finite, non-negative values in every field.");
    if (slug === "llm-token-calculator") {
      const wordCount = values.tokenText.trim()
        ? values.tokenText.trim().split(/\s+/u).length
        : 0;
      rows = [
        [
          "Token count (o200k_base)",
          tokenCount === null ? "Loading tokenizer…" : f(tokenCount, "tokens"),
        ],
        ["Words", f(wordCount, "")],
        ["Characters", f(values.tokenText.length, "")],
      ];
    } else if (slug === "llm-context-window-calculator") {
      const c = contextWindow(v.contextLimit, v.inputTokens, v.outputTokens);
      rows = [
        ["Context status", c.fits ? "Within context limit" : "Exceeds context limit"],
        ["Total planned tokens", f(c.totalTokens, "tokens")],
        ["Remaining tokens", f(c.remainingTokens, "tokens")],
        ["Maximum output for this input", f(c.maxOutputTokens, "tokens")],
        ["Context utilization", f(c.utilization, "%")],
      ];
    } else if (slug === "llm-batch-size-calculator") {
      const b = batchSize({
        gpu: v.gpu,
        reserved: v.reserved,
        parametersB: v.parametersB,
        bits: selectedType.bitsPerWeight,
        layers: v.layers,
        kvHeads: v.kvHeads,
        headDim: v.headDim,
        context: v.context,
        cacheBytes: v.cacheBytes,
        overhead: v.overhead,
      });
      rows = [
        ["Maximum sequences by memory", f(b.maxSequences, "sequences")],
        ["Available for KV cache", f(b.available, "GiB")],
        ["KV cache per sequence", f(b.perSequenceCache, "GiB")],
        ["Model weights", f(b.weight, "GiB")],
      ];
    } else if (slug === "llm-cost-calculator") {
      const c = cost(v.input, v.output, v.inputRate, v.outputRate, v.requests);
      rows = [
        ["Daily cost", f(c.daily, "USD")],
        ["30-day cost", f(c.monthly, "USD")],
        ["Annual cost", f(c.annual, "USD")],
      ];
    } else if (slug === "llm-throughput-calculator") {
      const t = throughput(v.rps, v.latency, v.output);
      rows = [
        ["Average requests in flight", f(t.concurrency, "")],
        ["Aggregate output demand", f(t.tokens, "tokens/s")],
      ];
    } else if (slug === "gguf-size-calculator") {
      const payload = weights(v.parametersB, selectedType.bitsPerWeight);
      const fp16Payload = weights(v.parametersB, 16);
      const fp32Payload = weights(v.parametersB, 32);
      rows = [
        ["Estimated weight payload", f(payload, "GiB")],
        [
          "Storage saved vs FP16",
          f(((fp16Payload - payload) / fp16Payload) * 100, "%"),
        ],
        [
          "Storage saved vs FP32",
          f(((fp32Payload - payload) / fp32Payload) * 100, "%"),
        ],
      ];
    } else {
      const m = memory({
        parametersB: v.parametersB,
        bits: selectedType.bitsPerWeight,
        layers: v.layers,
        kvHeads: v.kvHeads,
        headDim: v.headDim,
        context: v.context,
        sequences: v.sequences,
        cacheBytes: v.cacheBytes,
        overhead: v.overhead,
      });
      const memoryBreakdown: [string, string][] = [
        ["Raw weights", f(m.weight, "GiB")],
        ["KV cache", f(m.cache, "GiB")],
        ["Runtime overhead", f(v.overhead, "GiB")],
      ];
      if (slug === "gpu-compatibility-checker") {
        if (v.gpu <= 0 || v.reserved >= v.gpu)
          throw new Error("GPU capacity must exceed reserved memory.");
        const headroom = v.gpu - v.reserved - m.total;
        const compatibilitySummary: [string, string][] = [
          [
            "Estimated fit",
            headroom >= 0
              ? "Within estimated budget"
              : "Exceeds estimated budget",
          ],
          ["Estimated headroom", f(headroom, "GiB")],
          ["Estimated total", f(m.total, "GiB")],
        ];
        if (headroom < 0)
          compatibilitySummary.splice(1, 0, [
            "Possible adjustments",
            "Reduce context, concurrency, or weight bits",
          ]);
        rows =
          mode === "advanced"
            ? [...compatibilitySummary, ...memoryBreakdown]
            : compatibilitySummary;
      } else {
        rows = [...memoryBreakdown, ["Estimated total", f(m.total, "GiB")]];
      }
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Check your inputs.";
  }
  const resultHeading =
    slug === "llm-cost-calculator"
      ? "Estimated cost"
      : slug === "llm-throughput-calculator"
        ? "Estimated workload"
        : slug === "gguf-size-calculator"
          ? "Estimated file payload"
            : slug === "llm-token-calculator"
              ? "Text measurement"
              : slug === "llm-context-window-calculator"
                ? "Context budget"
                : slug === "llm-batch-size-calculator"
                  ? "Memory-bounded batch size"
          : slug === "gpu-compatibility-checker"
            ? "Estimated compatibility"
            : "Estimated memory usage";
  return (
    <div className="calculator">
      <div className="inputs">
        {supportsAdvanced ? (
          <div className="mode-bar">
            <span>Configuration</span>
            <div className="mode-switch" aria-label="Configuration detail">
              <button
                type="button"
                aria-pressed={mode === "simple"}
                onClick={() => setMode("simple")}
              >
                Simple
              </button>
              <button
                type="button"
                aria-pressed={mode === "advanced"}
                onClick={() => setMode("advanced")}
              >
                Advanced
              </button>
            </div>
          </div>
        ) : null}
        <div className="calc-heading">
          <span>Parameter</span>
          <span>Value</span>
          <button
            type="button"
            onClick={() =>
              setValues(
                Object.fromEntries(
                  Object.entries(defaults).map(([k, x]) => [k, String(x)]),
                ),
              )
            }
          >
            Reset
          </button>
        </div>
        <div className="fields">
          {fields.map((k) => (
            <label key={k} htmlFor={k}>
              <span className="field-label">
                <span>{labels[k]}</span>
                {parameterHelp[k] ? (
                  <span
                    className="field-info"
                    role="note"
                    tabIndex={0}
                    aria-label={parameterHelp[k]}
                    data-tooltip={parameterHelp[k]}
                  >
                    i
                  </span>
                ) : null}
              </span>
              <span className="field-control">
                {k === "tokenText" ? (
                  <textarea
                    id={k}
                    rows={7}
                    value={values[k]}
                    onChange={(e) =>
                      setValues((current) => ({ ...current, [k]: e.target.value }))
                    }
                  />
                ) : k === "quantType" || k === "cacheBytes" ? (
                  <select
                    id={k}
                    value={values[k]}
                    onChange={(e) =>
                      setValues((current) => ({
                        ...current,
                        [k]: e.target.value,
                      }))
                    }
                  >
                    {k === "quantType"
                      ? [
                          ...new Set(
                            ggufQuantizationTypes.map((type) => type.group),
                          ),
                        ].map((group) => (
                          <optgroup key={group} label={group}>
                            {ggufQuantizationTypes
                              .filter((type) => type.group === group)
                              .map((type) => (
                                <option
                                  key={type.name}
                                  value={ggufQuantizationTypes.indexOf(type)}
                                >
                                  {type.name} ({type.bitsPerWeight} bpw)
                                </option>
                              ))}
                          </optgroup>
                        ))
                      : [1, 2, 4].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                  </select>
                ) : (
                  <input
                    id={k}
                    type="number"
                    min={0}
                    step={
                      [
                        "parametersB",
                        "overhead",
                        "gpu",
                        "reserved",
                        "inputRate",
                        "outputRate",
                        "rps",
                        "latency",
                      ].includes(k)
                        ? "any"
                        : 1
                    }
                    value={values[k]}
                    onChange={(e) =>
                      setValues((current) => ({
                        ...current,
                        [k]: e.target.value,
                      }))
                    }
                  />
                )}
              </span>
            </label>
          ))}
        </div>
        {slug === "gguf-size-calculator" ? (
          <GgufQuantizationReference />
        ) : null}
        {supportsAdvanced && mode === "simple" ? (
          <p className="input-note">Switch to Advanced for model-specific estimates.</p>
        ) : null}
      </div>
      <div className="results" aria-live="polite" aria-atomic="true">
        <div className="eyebrow">{resultHeading}</div>
        {error ? (
          <p role="alert" className="error">
            {error}
          </p>
        ) : (
          <dl>
            {rows.map(([label, value]) => {
              const parts = resultParts(value);
              return (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd className={parts ? undefined : "textual"}>
                    {parts ? (
                      <>
                        <span>{parts.amount}</span>
                        {parts.unit ? <small>{parts.unit}</small> : null}
                      </>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        )}
        <p>
          {slug === "gpu-compatibility-checker" || slug === "llm-batch-size-calculator"
            ? "Estimate only. A fit does not guarantee runtime support or inference speed."
            : slug === "llm-token-calculator"
              ? "Counts use o200k_base; tokenizers and message overhead vary by model."
            : "Transparent math. Instant results."}
          {slug === "llm-vram-calculator" ||
          slug === "gpu-compatibility-checker" ||
          slug === "llm-batch-size-calculator" ? (
            <>
              <br />
              All memory values use GiB (2³⁰ bytes).
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}
