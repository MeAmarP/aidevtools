import { test } from "node:test";
import assert from "node:assert/strict";
import { weights, memory, cost, throughput, GiB } from "../lib/calculations";
test("raw weight bytes use binary GiB", () => {
  assert.equal(weights(8, 4), 4e9 / GiB);
  assert.equal(weights(8, 16), 16e9 / GiB);
});
const example = {
  parametersB: 8,
  bits: 4,
  layers: 32,
  kvHeads: 8,
  headDim: 128,
  context: 8192,
  sequences: 1,
  cacheBytes: 2,
  overhead: 1,
};
test("GQA cache uses KV heads and grows with sequence concurrency", () => {
  assert.equal(memory(example).cache, 1);
  assert.equal(memory({ ...example, sequences: 4 }).cache, 4);
  assert.equal(memory({ ...example, kvHeads: 32 }).cache, 4);
});
test("memory includes overhead but rejects invalid architecture", () => {
  assert.equal(memory(example).total, 4e9 / GiB + 2);
  assert.throws(() => memory({ ...example, context: 1.5 }));
  assert.throws(() => memory({ ...example, layers: 0 }));
});
test("cost charges both token directions and permits zero usage", () => {
  assert.deepEqual(cost(1000, 500, 1, 3, 1000), {
    daily: 2.5,
    monthly: 75,
    annual: 912.5,
  });
  assert.equal(cost(0, 0, 1, 3, 1000).daily, 0);
});
test("throughput uses Little's Law", () => {
  assert.deepEqual(throughput(2, 5, 500), { concurrency: 10, tokens: 1000 });
});
test("negative, nonfinite and overflowing inputs are rejected", () => {
  assert.throws(() => weights(-1, 4));
  assert.throws(() => cost(1, 2, NaN, 3, 4));
  assert.throws(() => throughput(Infinity, 1, 1));
  assert.throws(() => cost(1e308, 1e308, 1e308, 1e308, 1e308));
});
