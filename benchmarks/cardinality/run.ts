import fs from "fs";
import path from "path";
import { BitSet } from "../../src/bitset";
import BitSet2 from "bitset";
import { profile } from "../profile";

let bitstrings = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "10k-bitstrings.json"), "utf-8")
) as string[];

let bitsetsA = bitstrings.map((bitstring) => new BitSet2(bitstring));
let bitsetsB = bitstrings.map((bitstring) => new BitSet(bitstring));

console.log("Running '10k-bitstrings' benchmark");
profile(
  () => {
    for (let n = 0; n < 500; n++) {
      for (const bitset of bitsetsA) {
        bitset.cardinality();
      }
    }
  },
  (timeMs) => console.log(`\t'bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (let n = 0; n < 500; n++) {
      for (const bitset of bitsetsB) {
        bitset.cardinality;
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

bitsetsA = bitstrings.map((bitstring) => new BitSet2(bitstring));
bitsetsB = bitstrings.map((bitstring) => new BitSet(bitstring));

console.log("\nRunning '500-sparse-bitstrings' benchmark");
profile(
  () => {
    for (let n = 0; n < 500; n++) {
      for (const bitset of bitsetsA) {
        bitset.cardinality();
      }
    }
  },
  (timeMs) => console.log(`\t'bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (let n = 0; n < 500; n++) {
      for (const bitset of bitsetsB) {
        bitset.cardinality;
      }
    }
  },
  (timeMs) => console.log(`\t'alexharri/bitset' ran in ${timeMs.toFixed(1)} ms`)
);
