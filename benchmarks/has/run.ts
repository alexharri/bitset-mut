import fs from "fs";
import path from "path";
import { BitSet as BitSet_alexharri } from "../../src/bitset";
import BitSet_bitset from "bitset";
import { profile } from "../profile";
import { makeFastBitSet } from "../utils";

let arrs = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "10-times-1k-bitstring-and-indices.json"),
    "utf-8"
  )
) as [string, number[]][][];

const bitsets_bitset = arrs.map((arr) =>
  arr.map(
    ([bitstring, indices]) => [new BitSet_bitset(bitstring), indices] as const
  )
);
const bitsets_alexharri = arrs.map((arr) =>
  arr.map(
    ([bitstring, indices]) =>
      [new BitSet_alexharri(bitstring), indices] as const
  )
);
const bitsets_fastbitset = arrs.map((arr) =>
  arr.map(
    ([bitstring, indices]) => [makeFastBitSet(bitstring), indices] as const
  )
);

const N = 10;

console.log("Running '10-times-1k-bitstring-and-indices' benchmark");
profile(
  () => {
    for (let n = 0; n < N; n++) {
      for (const arr of bitsets_bitset) {
        for (let i = 0; i < arr.length; i++) {
          const bitset = arr[i][0];
          const indices = arr[i][1];
          for (const index of indices) {
            bitset.get(index);
          }
        }
      }
    }
  },
  (timeMs) => console.log(`\t'bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (let n = 0; n < N; n++) {
      for (const arr of bitsets_alexharri) {
        for (let i = 0; i < arr.length; i++) {
          const bitset = arr[i][0];
          const indices = arr[i][1];
          for (const index of indices) {
            bitset.has(index);
          }
        }
      }
    }
  },
  (timeMs) => console.log(`\t'bitset-mut' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (let n = 0; n < N; n++) {
      for (const arr of bitsets_fastbitset) {
        for (let i = 0; i < arr.length; i++) {
          const bitset = arr[i][0];
          const indices = arr[i][1];
          for (const index of indices) {
            bitset.has(index);
          }
        }
      }
    }
  },
  (timeMs) => console.log(`\t'fastbitset' ran in ${timeMs.toFixed(1)} ms`)
);
