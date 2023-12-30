import fs from "fs";
import path from "path";
import { BitSet } from "../../src/bitset";
import BitSet2 from "bitset";
import { profile } from "../profile";

let indices = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "1m-indices.json"), "utf-8")
) as number[];

const N = 50;
const bitsets1 = Array.from({ length: N }).map(() => BitSet.random(1_000_000));
const bitsets2 = Array.from({ length: N }).map(() => BitSet2.Random(1_000_000));

console.log("Running '1m-indices' on random (dense) bitset benchmark");
profile(
  () => {
    for (const bitset of bitsets2) {
      for (let i = 0; i < indices.length; i++) {
        bitset.flip(indices[i]);
      }
    }
  },
  (timeMs) => console.log(`\t'bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (const bitset of bitsets1) {
      for (let i = 0; i < indices.length; i++) {
        bitset.flip(indices[i]);
      }
    }
  },
  (timeMs) => console.log(`\t'bitset-mut' ran in ${timeMs.toFixed(1)} ms`)
);
