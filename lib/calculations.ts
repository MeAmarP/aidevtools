export const GiB = 2 ** 30;
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
