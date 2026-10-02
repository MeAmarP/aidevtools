export const GiB = 2 ** 30;
export const ggufQuantizationTypes = [
  {
    name: "F64",
    bitsPerWeight: 64,
    group: "Standard types",
    meaning: "64-bit IEEE 754 double-precision floating-point number.",
  },
  {
    name: "I64",
    bitsPerWeight: 64,
    group: "Standard types",
    meaning: "64-bit fixed-width integer number.",
  },
  {
    name: "F32",
    bitsPerWeight: 32,
    group: "Standard types",
    meaning: "32-bit IEEE 754 single-precision floating-point number.",
  },
  {
    name: "I32",
    bitsPerWeight: 32,
    group: "Standard types",
    meaning: "32-bit fixed-width integer number.",
  },
  {
    name: "F16",
    bitsPerWeight: 16,
    group: "Standard types",
    meaning: "16-bit IEEE 754 half-precision floating-point number.",
  },
  {
    name: "BF16",
    bitsPerWeight: 16,
    group: "Standard types",
    meaning: "16-bit shortened format of IEEE 754 single precision.",
  },
  {
    name: "I16",
    bitsPerWeight: 16,
    group: "Standard types",
    meaning: "16-bit fixed-width integer number.",
  },
  {
    name: "Q8_K",
    bitsPerWeight: 9.125,
    group: "Standard types",
    meaning: "8-bit values in 256-weight blocks; mainly for intermediate results.",
  },
  {
    name: "I8",
    bitsPerWeight: 8,
    group: "Standard types",
    meaning: "8-bit fixed-width integer number.",
  },
  {
    name: "Q6_K",
    bitsPerWeight: 6.5625,
    group: "Standard types",
    meaning: "6-bit quantization with 8-bit block scales; 6.5625 effective bpw.",
  },
  {
    name: "Q5_K",
    bitsPerWeight: 5.5,
    group: "Standard types",
    meaning: "5-bit values with 6-bit scales and minima; 5.5 effective bpw.",
  },
  {
    name: "Q4_K",
    bitsPerWeight: 4.5,
    group: "Standard types",
    meaning: "4-bit values with 6-bit scales and minima; 4.5 effective bpw.",
  },
  {
    name: "Q3_K",
    bitsPerWeight: 3.4375,
    group: "Standard types",
    meaning: "3-bit quantization with 6-bit block scales; 3.4375 effective bpw.",
  },
  {
    name: "Q2_K",
    bitsPerWeight: 2.625,
    group: "Standard types",
    meaning: "2-bit values with 4-bit scales and minima; 2.625 effective bpw.",
  },
  {
    name: "IQ4_NL",
    bitsPerWeight: 4.5,
    group: "Importance-based types",
    meaning: "4-bit importance-matrix quantization in 256-weight super-blocks.",
  },
  {
    name: "IQ4_XS",
    bitsPerWeight: 4.25,
    group: "Importance-based types",
    meaning: "4-bit importance-matrix quantization; 4.25 effective bpw.",
  },
  {
    name: "IQ3_S",
    bitsPerWeight: 3.4375,
    group: "Importance-based types",
    meaning: "3-bit importance-matrix quantization; about 3.44 effective bpw.",
  },
  {
    name: "IQ3_XXS",
    bitsPerWeight: 3.0625,
    group: "Importance-based types",
    meaning: "Compact 3-bit importance-matrix quantization; about 3.06 bpw.",
  },
  {
    name: "IQ2_XXS",
    bitsPerWeight: 2.0625,
    group: "Importance-based types",
    meaning: "Extra-small 2-bit importance-matrix quantization; about 2.06 bpw.",
  },
  {
    name: "IQ2_S",
    bitsPerWeight: 2.5,
    group: "Importance-based types",
    meaning: "Small 2-bit importance-matrix quantization; about 2.5 effective bpw.",
  },
  {
    name: "IQ2_XS",
    bitsPerWeight: 2.3125,
    group: "Importance-based types",
    meaning: "Extra-small 2-bit importance-matrix quantization; about 2.31 bpw.",
  },
  {
    name: "IQ1_S",
    bitsPerWeight: 1.5625,
    group: "Importance-based types",
    meaning: "1-bit importance-matrix quantization; about 1.56 effective bpw.",
  },
  {
    name: "IQ1_M",
    bitsPerWeight: 1.75,
    group: "Importance-based types",
    meaning: "1-bit importance-matrix quantization; about 1.75 effective bpw.",
  },
  {
    name: "TQ1_0",
    bitsPerWeight: 1.6875,
    group: "Ternary and microscaling",
    meaning: "Ternary quantization using three possible weight values.",
  },
  {
    name: "TQ2_0",
    bitsPerWeight: 2.0625,
    group: "Ternary and microscaling",
    meaning: "Ternary quantization using three possible weight values.",
  },
  {
    name: "MXFP4",
    bitsPerWeight: 4.25,
    group: "Ternary and microscaling",
    meaning: "4-bit microscaling block floating-point format.",
  },
  {
    name: "Q8_0",
    bitsPerWeight: 8.5,
    group: "Legacy types",
    meaning: "Legacy 8-bit round-to-nearest quantization in 32-weight blocks.",
  },
  {
    name: "Q8_1",
    bitsPerWeight: 9,
    group: "Legacy types",
    meaning: "Legacy 8-bit block quantization with scale and minimum.",
  },
  {
    name: "Q5_0",
    bitsPerWeight: 5.5,
    group: "Legacy types",
    meaning: "Legacy 5-bit round-to-nearest quantization in 32-weight blocks.",
  },
  {
    name: "Q5_1",
    bitsPerWeight: 6,
    group: "Legacy types",
    meaning: "Legacy 5-bit block quantization with scale and minimum.",
  },
  {
    name: "Q4_0",
    bitsPerWeight: 4.5,
    group: "Legacy types",
    meaning: "Legacy 4-bit round-to-nearest quantization in 32-weight blocks.",
  },
  {
    name: "Q4_1",
    bitsPerWeight: 5,
    group: "Legacy types",
    meaning: "Legacy 4-bit block quantization with scale and minimum.",
  },
] as const;

function valid(values: number[]) {
  if (values.some((value) => !Number.isFinite(value) || value < 0))
    throw new Error("Enter finite, non-negative values.");
}
export function weights(parametersB: number, bits: number) {
  valid([parametersB, bits]);
  if (parametersB === 0 || bits === 0)
    throw new Error("Parameters and precision must be positive.");
  const result = (parametersB * 1e9 * bits) / 8 / GiB;
  if (!Number.isFinite(result)) throw new Error("Inputs exceed the supported numerical range.");
  return result;
}
export type MemoryInput = {
  parametersB: number;
  bits: number;
  layers: number;
  kvHeads: number;
  headDim: number;
  context: number;
  sequences: number;
  cacheBytes: number;
  overhead: number;
};
export function memory(x: MemoryInput) {
  valid(Object.values(x));
  for (const value of [
    x.layers,
    x.kvHeads,
    x.headDim,
    x.context,
    x.sequences,
  ]) {
    if (!Number.isInteger(value) || value < 1)
      throw new Error(
        "Architecture, context, and sequence counts must be positive integers.",
      );
  }
  if (x.cacheBytes <= 0) throw new Error("Cache precision must be positive.");
  const weight = weights(x.parametersB, x.bits);
  const cache =
    (2 *
      x.layers *
      x.kvHeads *
      x.headDim *
      x.context *
      x.sequences *
      x.cacheBytes) /
    GiB;
  const total = weight + cache + x.overhead;
  if (!Number.isFinite(total))
    throw new Error("Inputs exceed the supported numerical range.");
  return { weight, cache, total };
}
export function cost(
  input: number,
  output: number,
  inputRate: number,
  outputRate: number,
  requests: number,
) {
  valid([input, output, inputRate, outputRate, requests]);
  const daily = (requests * (input * inputRate + output * outputRate)) / 1e6;
  if (!Number.isFinite(daily * 365))
    throw new Error("Inputs exceed the supported numerical range.");
  return { daily, monthly: daily * 30, annual: daily * 365 };
}
export function throughput(rps: number, latency: number, output: number) {
  valid([rps, latency, output]);
  const concurrency = rps * latency;
  const tokens = rps * output;
  if (![concurrency, tokens].every(Number.isFinite))
    throw new Error("Inputs exceed the supported numerical range.");
  return { concurrency, tokens };
}

export function contextWindow(
  contextLimit: number,
  inputTokens: number,
  outputTokens: number,
) {
  valid([contextLimit, inputTokens, outputTokens]);
  if (
    !Number.isInteger(contextLimit) ||
    contextLimit < 1 ||
    !Number.isInteger(inputTokens) ||
    !Number.isInteger(outputTokens)
  )
    throw new Error("Context and token counts must be whole numbers.");
  const totalTokens = inputTokens + outputTokens;
  const remainingTokens = contextLimit - totalTokens;
  const maxOutputTokens = Math.max(0, contextLimit - inputTokens);
  if (![totalTokens, remainingTokens, maxOutputTokens].every(Number.isFinite))
    throw new Error("Inputs exceed the supported numerical range.");
  return {
    totalTokens,
    remainingTokens,
    maxOutputTokens,
    utilization: (totalTokens / contextLimit) * 100,
    fits: remainingTokens >= 0,
  };
}

export type BatchSizeInput = Omit<MemoryInput, "sequences"> & {
  gpu: number;
  reserved: number;
};

export function batchSize(input: BatchSizeInput) {
  valid(Object.values(input));
  if (input.gpu <= 0 || input.reserved >= input.gpu)
    throw new Error("GPU capacity must exceed reserved memory.");
  const { gpu, reserved, ...model } = input;
  const singleSequence = memory({ ...model, sequences: 1 });
  const available = gpu - reserved - model.overhead - singleSequence.weight;
  const maxSequences = Math.max(0, Math.floor(available / singleSequence.cache));
  if (![available, maxSequences].every(Number.isFinite))
    throw new Error("Inputs exceed the supported numerical range.");
  return {
    maxSequences,
    available,
    weight: singleSequence.weight,
    perSequenceCache: singleSequence.cache,
  };
}
