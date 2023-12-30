import fs from "fs";
import path from "path";
import { BitSet as BitSet_alexharri } from "../../src/bitset";
import BitSet_bitset from "bitset";
import { profile } from "../profile";
import { makeFastBitSet } from "../utils";

let bitstrings = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "10k-bitstrings.json"), "utf-8")
) as string[];

let bitsets_bitset = bitstrings.map(
  (bitstring) => new BitSet_bitset(bitstring)
);
let bitsets_alexharri = bitstrings.map(
  (bitstring) => new BitSet_alexharri(bitstring)
);
let bitsets_fastbitset = bitstrings.map((bitstring) =>
  makeFastBitSet(bitstring)
);

const N = 500;

console.log("Running '10k-bitstrings' benchmark");
profile(
  () => {
    for (let n = 0; n < N; n++) {
      for (const bitset of bitsets_bitset) {
        bitset.cardinality();
      }
    }
  },
  (timeMs) => console.log(`\t'bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (let n = 0; n < N; n++) {
      for (const bitset of bitsets_alexharri) {
        bitset.cardinality();
      }
    }
  },
  (timeMs) => console.log(`\t'bitset-mut' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (let n = 0; n < N; n++) {
      for (const bitset of bitsets_fastbitset) {
        bitset.size();
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

bitsets_bitset = bitstrings.map((bitstring) => new BitSet_bitset(bitstring));
bitsets_alexharri = bitstrings.map(
  (bitstring) => new BitSet_alexharri(bitstring)
);
bitsets_fastbitset = bitstrings.map((bitstring) => makeFastBitSet(bitstring));

console.log("\nRunning '500-sparse-bitstrings' benchmark");
profile(
  () => {
    for (let n = 0; n < 500; n++) {
      for (const bitset of bitsets_bitset) {
        bitset.cardinality();
      }
    }
  },
  (timeMs) => console.log(`\t'bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (let n = 0; n < 500; n++) {
      for (const bitset of bitsets_alexharri) {
        bitset.cardinality();
      }
    }
  },
  (timeMs) => console.log(`\t'bitset-mut' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (let n = 0; n < 500; n++) {
      for (const bitset of bitsets_fastbitset) {
        bitset.size();
      }
    }
  },
  (timeMs) => console.log(`\t'fastbitset' ran in ${timeMs.toFixed(1)} ms`)
);
