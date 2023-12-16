import fs from "fs";
import path from "path";
import { BitSet } from "../../src/bitset";
import { profile } from "../profile";

let bitstrings = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "10k-bitstrings.json"), "utf-8")
) as string[];
let bitsets = bitstrings.map((bitstring) => new BitSet(bitstring));

console.log("Running '10k-bitstrings' benchmark");
profile(
  () => {
    for (let n = 0; n < 5; n++) {
      for (const bitset of bitsets) {
        let count = 0;
        for (const _ of bitset) {
          count++;
        }
      }
    }
  },
  (timeMs) => console.log(`\t'alexharri/bitset' ran in ${timeMs.toFixed(1)} ms`)
);

bitstrings = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "500-sparse-bitstrings.json"),
    "utf-8"
  )
) as string[];

bitsets = bitstrings.map((bitstring) => new BitSet(bitstring));

console.log("\nRunning '500-sparse-bitstrings' benchmark");
profile(
  () => {
    for (let n = 0; n < 50; n++) {
      for (const bitset of bitsets) {
        let count = 0;
        for (const _ of bitset) {
          count++;
        }
      }
    }
  },
  (timeMs) => console.log(`\t'alexharri/bitset' ran in ${timeMs.toFixed(1)} ms`)
);
