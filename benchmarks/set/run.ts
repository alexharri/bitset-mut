import fs from "fs";
import path from "path";
import { BitSet } from "../../src/bitset";
import BitSet2 from "bitset";
import { profile } from "../profile";

let arrs = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "50-times-100k-indices-from-0-to-10m.json"),
    "utf-8"
  )
) as number[][];

console.log("Running '50-times-100k-indices-from-0-to-10m' benchmark");
profile(
  () => {
    for (const arr of arrs) {
      const bitset = new BitSet2();
      for (let i = 0; i < arr.length; i++) {
        bitset.set(arr[i], 1);
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
        bitset.set(arr[i], 1);
      }
    }
  },
  (timeMs) => console.log(`\t'alexharri/bitset' ran in ${timeMs.toFixed(1)} ms`)
);

arrs = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "50-times-100k-indices-from-0-to-100k.json"),
    "utf-8"
  )
) as number[][];

console.log(
  "\nRunning '50-times-100k-indices-from-0-to-100k' benchmark 10 times"
);
profile(
  () => {
    for (let n = 0; n < 10; n++) {
      for (const arr of arrs) {
        const bitset = new BitSet2();
        for (let i = 0; i < arr.length; i++) {
          bitset.set(arr[i], 1);
        }
      }
    }
  },
  (timeMs) => console.log(`\t'bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (let n = 0; n < 10; n++) {
      for (const arr of arrs) {
        const bitset = new BitSet();
        for (let i = 0; i < arr.length; i++) {
          bitset.set(arr[i], 1);
        }
      }
    }
  },
  (timeMs) => console.log(`\t'alexharri/bitset' ran in ${timeMs.toFixed(1)} ms`)
);
