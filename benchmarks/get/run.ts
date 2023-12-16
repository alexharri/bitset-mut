import fs from "fs";
import path from "path";
import { BitSet } from "../../src/bitset";
import BitSet2 from "bitset";
import { profile } from "../profile";

let arrs = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "10-times-1k-bitstring-and-indices.json"),
    "utf-8"
  )
) as [string, number[]][][];

const bitsetsA = arrs.map((arr) =>
  arr.map(([bitstring, indices]) => [new BitSet2(bitstring), indices] as const)
);
const bitsetsB = arrs.map((arr) =>
  arr.map(([bitstring, indices]) => [new BitSet(bitstring), indices] as const)
);

console.log("Running '10-times-1k-bitstring-and-indices' benchmark");
profile(
  () => {
    for (let n = 0; n < 10; n++) {
      for (const arr of bitsetsA) {
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
    for (let n = 0; n < 10; n++) {
      for (const arr of bitsetsB) {
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
  (timeMs) => console.log(`\t'alexharri/bitset' ran in ${timeMs.toFixed(1)} ms`)
);
