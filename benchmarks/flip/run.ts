import fs from "fs";
import path from "path";
import { BitSet as BitSet_alexharri } from "../../src/bitset";
import BitSet_bitset from "bitset";
import { profile } from "../profile";
import { makeRandomFastBitSet } from "../utils";

let indices = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "1m-indices.json"), "utf-8")
) as number[];

const N = 50;

const bitsets_alexharri = Array.from({ length: N }).map(() =>
  BitSet_alexharri.random(1_000_000)
);
const bitsets_bitset = Array.from({ length: N }).map(() =>
  BitSet_bitset.Random(1_000_000)
);
const bitsets_fastbitset = Array.from({ length: N }).map(() =>
  makeRandomFastBitSet(1_000_000)
);

console.log("Running '1m-indices' on random (dense) bitset benchmark");
profile(
  () => {
    for (const bitset of bitsets_bitset) {
      for (let i = 0; i < indices.length; i++) {
        bitset.flip(indices[i]);
      }
    }
  },
  (timeMs) => console.log(`\t'bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (const bitset of bitsets_alexharri) {
      for (let i = 0; i < indices.length; i++) {
        bitset.flip(indices[i]);
      }
    }
  },
  (timeMs) => console.log(`\t'bitset-mut' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (const bitset of bitsets_fastbitset) {
      for (let i = 0; i < indices.length; i++) {
        bitset.flip(indices[i]);
      }
    }
  },
  (timeMs) => console.log(`\t'fastbitset' ran in ${timeMs.toFixed(1)} ms`)
);
