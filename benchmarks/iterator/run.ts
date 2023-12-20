import fs from "fs";
import path from "path";
import { BitSet as BitSet_alexharri } from "../../src/bitset";
import { profile } from "../profile";
import { makeFastBitSet } from "../utils";

let bitstrings = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "10k-bitstrings.json"), "utf-8")
) as string[];
let bitsets_alexharri = bitstrings.map(
  (bitstring) => new BitSet_alexharri(bitstring)
);
let bitsets_fastbitset = bitstrings.map((bitstring) =>
  makeFastBitSet(bitstring)
);

console.log("Running '10k-bitstrings' benchmark");
profile(
  () => {
    for (let n = 0; n < 5; n++) {
      for (const bitset of bitsets_alexharri) {
        let count = 0;
        for (const _ of bitset) {
          count++;
        }
      }
    }
  },
  (timeMs) => console.log(`\t'alexharri/bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (let n = 0; n < 5; n++) {
      for (const bitset of bitsets_fastbitset) {
        let count = 0;
        for (const _ of bitset as any) {
          count++;
        }
      }
    }
  },
  (timeMs) => console.log(`\t'fastbitset' ran in ${timeMs.toFixed(1)} ms`)
);

bitstrings = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "500-sparse-bitstrings.json"),
    "utf-8"
  )
) as string[];

bitsets_alexharri = bitstrings.map(
  (bitstring) => new BitSet_alexharri(bitstring)
);
bitsets_fastbitset = bitstrings.map((bitstring) => makeFastBitSet(bitstring));

console.log("\nRunning '500-sparse-bitstrings' benchmark");
profile(
  () => {
    for (let n = 0; n < 50; n++) {
      for (const bitset of bitsets_alexharri) {
        let count = 0;
        for (const _ of bitset) {
          count++;
        }
      }
    }
  },
  (timeMs) => console.log(`\t'alexharri/bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (let n = 0; n < 50; n++) {
      for (const bitset of bitsets_fastbitset) {
        let count = 0;
        for (const _ of bitset as any) {
          count++;
        }
      }
    }
  },
  (timeMs) => console.log(`\t'fastbitset' ran in ${timeMs.toFixed(1)} ms`)
);
