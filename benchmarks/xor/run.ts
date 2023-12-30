import fs from "fs";
import path from "path";
import { BitSet } from "../../src/bitset";
import BitSet2 from "bitset";
import { profile } from "../profile";

let arrs = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "10-times-1k-bitstring-pairs-of-length-1k.json"),
    "utf-8"
  )
) as [string, string][][];

const bitsetsA = arrs.map((arr) =>
  arr.map(([a, b]) => [new BitSet2(a), new BitSet2(b)])
);
const bitsetsB = arrs.map((arr) =>
  arr.map(([a, b]) => [new BitSet(a), new BitSet(b)])
);

console.log("Running '10-times-1k-bitstring-pairs-of-length-1k' benchmark");
profile(
  () => {
    for (let n = 0; n < 100; n++) {
      for (const arr of bitsetsA) {
        for (let i = 0; i < arr.length; i++) {
          arr[i][0].xor(arr[i][1]);
        }
      }
    }
  },
  (timeMs) => console.log(`\t'bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (let n = 0; n < 100; n++) {
      for (const arr of bitsetsB) {
        for (let i = 0; i < arr.length; i++) {
          arr[i][0].xor(arr[i][1]);
        }
      }
    }
  },
  (timeMs) => console.log(`\t'bitset-mut' ran in ${timeMs.toFixed(1)} ms`)
);
