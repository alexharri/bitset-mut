import fs from "fs";
import path from "path";
import { BitSet } from "../../src/bitset";
import BitSet2 from "bitset";
import { profile } from "../profile";

let arrs = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "10-times-100k-ranges.json"), "utf-8")
) as [number, number][][];

console.log("Running '10-times-100k-ranges' benchmark");
profile(
  () => {
    for (const arr of arrs) {
      const bitset = new BitSet2();
      for (let i = 0; i < arr.length; i++) {
        bitset.setRange(arr[i][0], arr[i][1], 1);
      }
    }
  },
  (timeMs) => console.log(`\t'bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (const arr of arrs) {
      const bitset = new BitSet();
      for (let i = 0; i < arr.length; i++) {
        bitset.setRange(arr[i][0], arr[i][1], 1);
      }
    }
  },
  (timeMs) => console.log(`\t'bitset-mut' ran in ${timeMs.toFixed(1)} ms`)
);
