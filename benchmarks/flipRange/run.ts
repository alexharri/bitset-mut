import fs from "fs";
import path from "path";
import { BitSet } from "../../src/bitset";
import BitSet2 from "bitset";
import { profile } from "../profile";

let ranges = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "1m-large-ranges.json"), "utf-8")
) as [number, number][];

let bitset1 = BitSet.random(10_000_000);
let bitset2 = BitSet2.Random(10_000_000);

console.log("Running '1m-large-ranges' on random (dense) bitset benchmark");
profile(
  () => {
    for (let i = 0; i < ranges.length; i++) {
      bitset2.flip(ranges[i][0], ranges[i][1]);
    }
  },
  (timeMs) => console.log(`\t'bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (let i = 0; i < ranges.length; i++) {
      bitset1.flip(ranges[i][0], ranges[i][1]);
    }
  },
  (timeMs) => console.log(`\t'alexharri/bitset' ran in ${timeMs.toFixed(1)} ms`)
);

function makeSparseSet<T extends BitSet | BitSet2>(bitset: T) {
  bitset.flip(10_000_000); // Make bitset ~10M in size
  for (let i = 0; i < 10_000; i++) {
    const index = Math.floor(Math.random() * 10_000_000);
    bitset.flip(index);
  }
  return bitset;
}

const bitset1Arr = Array.from({ length: 50 }).map(() =>
  makeSparseSet(new BitSet())
);
const bitset2Arr = Array.from({ length: 50 }).map(() =>
  makeSparseSet(new BitSet2())
);

ranges = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "100k-small-ranges.json"), "utf-8")
) as [number, number][];

console.log("\nRunning '100k-small-ranges' benchmark on sparse bitsets");
profile(
  () => {
    for (const bitset of bitset2Arr) {
      for (let i = 0; i < ranges.length; i++) {
        bitset.flip(ranges[i][0], ranges[i][1]);
      }
    }
  },
  (timeMs) => console.log(`\t'bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (const bitset of bitset1Arr) {
      for (let i = 0; i < ranges.length; i++) {
        bitset.flip(ranges[i][0], ranges[i][1]);
      }
    }
  },
  (timeMs) => console.log(`\t'alexharri/bitset' ran in ${timeMs.toFixed(1)} ms`)
);
