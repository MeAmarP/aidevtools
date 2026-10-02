"use client";
import { useState } from "react";
import type { ToolSlug } from "@/lib/tools";
import { memory, weights, cost, throughput } from "@/lib/calculations";
const defaults: Record<string, number> = {
  parametersB: 8,
  bits: 4,
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
};
const labels: Record<string, string> = {
  parametersB: "Parameters (billions)",
  bits: "Nominal weight bits",
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
};
const architecture = [
  "parametersB",
  "bits",
  "layers",
  "kvHeads",
  "headDim",
  "context",
  "sequences",
  "cacheBytes",
  "overhead",
];

function resultParts(value: string) {
  const match = value.match(/^(-?[\d,.]+(?:\.\d+)?)\s+(.+)$/);
  return match ? { amount: match[1], unit: match[2] } : null;
}

export default function Calculator({ slug }: { slug: ToolSlug }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      Object.entries(defaults).map(([k, v]) => [k, String(v)]),
    ),
  );
  let fields: string[] = architecture;
  if (slug === "gpu-compatibility-checker")
    fields = [...architecture, "gpu", "reserved"];
  if (slug === "gguf-size-calculator") fields = ["parametersB", "bits"];
  if (slug === "quantization-calculator") fields = ["parametersB"];
  if (slug === "llm-cost-calculator")
    fields = ["input", "output", "inputRate", "outputRate", "requests"];
  if (slug === "llm-throughput-calculator")
    fields = ["rps", "latency", "output"];
  const v = Object.fromEntries(
    Object.entries(values).map(([k, x]) => [k, Number(x)]),
  );
  let rows: [string, string][] = [];
  let error = "";
  const f = (x: number, unit: string) =>
    `${x.toLocaleString("en-US", { maximumFractionDigits: 3 })} ${unit}`;
  try {
    if (
      fields.some(
        (k) => values[k].trim() === "" || !Number.isFinite(v[k]) || v[k] < 0,
      )
    )
      throw new Error("Enter finite, non-negative values in every field.");
    if (slug === "llm-cost-calculator") {
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
    } else if (slug === "quantization-calculator")
      rows = [32, 16, 8, 4].map((b) => [
        `${b}-bit raw weights`,
        f(weights(v.parametersB, b), "GiB"),
      ]);
    else if (slug === "gguf-size-calculator")
      rows = [
        ["Raw weight payload", f(weights(v.parametersB, v.bits), "GiB")],
        ["GGUF metadata / mixed tensors", "Additional; format dependent"],
      ];
    else {
      const m = memory({
        parametersB: v.parametersB,
        bits: v.bits,
        layers: v.layers,
        kvHeads: v.kvHeads,
        headDim: v.headDim,
        context: v.context,
        sequences: v.sequences,
        cacheBytes: v.cacheBytes,
        overhead: v.overhead,
      });
      rows = [
        ["Raw weights", f(m.weight, "GiB")],
        ["KV cache", f(m.cache, "GiB")],
        ["Runtime overhead", f(v.overhead, "GiB")],
        ["Estimated total", f(m.total, "GiB")],
      ];
      if (slug === "gpu-compatibility-checker") {
        if (v.gpu <= 0 || v.reserved >= v.gpu)
          throw new Error("GPU capacity must exceed reserved memory.");
        const headroom = v.gpu - v.reserved - m.total;
        rows.push(
          ["Remaining headroom", f(headroom, "GiB")],
          [
            "Memory assessment",
            headroom >= 0
              ? "Within estimated budget"
              : "Exceeds estimated budget",
          ],
        );
      }
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Check your inputs.";
  }
  return (
    <div className="calculator">
      <div className="inputs">
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
              <span>{labels[k]}</span>
              <span className="field-control">
                {k === "bits" || k === "cacheBytes" ? (
                  <select
                    id={k}
                    value={values[k]}
                    onChange={(e) =>
                      setValues({ ...values, [k]: e.target.value })
                    }
                  >
                    {(k === "bits" ? [4, 5, 6, 8, 16, 32] : [1, 2, 4]).map(
                      (n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ),
                    )}
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
                      setValues({ ...values, [k]: e.target.value })
                    }
                  />
                )}
              </span>
            </label>
          ))}
        </div>
        <p className="input-note">
          Illustrative defaults · Change these to match your workload.
        </p>
      </div>
      <div className="results" aria-live="polite" aria-atomic="true">
        <div className="eyebrow">Estimated memory usage</div>
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
                  <dd>
                    {parts ? (
                      <>
                        <span>{parts.amount}</span>
                        <small>{parts.unit}</small>
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
          Transparent math. Instant results.
          <br />
          All memory values use GiB (2³⁰ bytes).
        </p>
      </div>
    </div>
  );
}
