import fs from "fs";
import path from "path";
import { BitSet as BitSet_alexharri } from "../../src/bitset";
import BitSet_bitset from "bitset";
import { profile } from "../profile";
import { makeFastBitSet } from "../utils";

const N = 30;

let arrs = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "10-times-1k-bitstring-pairs-of-length-1k.json"),
    "utf-8"
  )
) as [string, string][][];
arrs = arrs.map((arr) => Array(N).fill(arr)).flat();

const bitsets_bitset = arrs.map((arr) =>
  arr.map(([a, b]) => [new BitSet_bitset(a), new BitSet_bitset(b)])
);
const bitsets_fastbitset = arrs.map((arr) =>
  arr.map(([a, b]) => [makeFastBitSet(a), makeFastBitSet(b)])
);
const bitsets_alexharri = arrs.map((arr) =>
  arr.map(([a, b]) => [new BitSet_alexharri(a), new BitSet_alexharri(b)])
);

console.log("Running '10-times-1k-bitstring-pairs-of-length-1k' benchmark");
profile(
  () => {
    for (const arr of bitsets_bitset) {
      for (let i = 0; i < arr.length; i++) {
        arr[i][0].or(arr[i][1]);
      }
    }
  },
  (timeMs) => console.log(`\t'bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (const arr of bitsets_fastbitset) {
      for (let i = 0; i < arr.length; i++) {
        arr[i][0].union(arr[i][1]);
      }
    }
  },
  (timeMs) => console.log(`\t'fastbitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (const arr of bitsets_alexharri) {
      for (let i = 0; i < arr.length; i++) {
        arr[i][0].or(arr[i][1]);
      }
    }
  },
  (timeMs) => console.log(`\t'bitset-mut' ran in ${timeMs.toFixed(1)} ms`)
);
