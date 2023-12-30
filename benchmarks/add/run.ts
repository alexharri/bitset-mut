import fs from "fs";
import path from "path";
import { BitSet as BitSet_alexharri } from "../../src/bitset";
import BitSet_bitset from "bitset";
import { profile } from "../profile";
import FastBitSet from "fastbitset";

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
      const bitset = new BitSet_bitset();
      for (let i = 0; i < arr.length; i++) {
        bitset.set(arr[i]);
      }
    }
  },
  (timeMs) => console.log(`\t'bitset' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (const arr of arrs) {
      const bitset = new BitSet_alexharri();
      for (let i = 0; i < arr.length; i++) {
        bitset.add(arr[i]);
      }
    }
  },
  (timeMs) => console.log(`\t'bitset-mut' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (const arr of arrs) {
      const bitset = new FastBitSet();
      for (let i = 0; i < arr.length; i++) {
        bitset.add(arr[i]);
      }
    }
  },
  (timeMs) => console.log(`\t'fastbitset' ran in ${timeMs.toFixed(1)} ms`)
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
        const bitset = new BitSet_bitset();
        for (let i = 0; i < arr.length; i++) {
          bitset.set(arr[i]);
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
        const bitset = new BitSet_alexharri();
        for (let i = 0; i < arr.length; i++) {
          bitset.add(arr[i]);
        }
      }
    }
  },
  (timeMs) => console.log(`\t'bitset-mut' ran in ${timeMs.toFixed(1)} ms`)
);
profile(
  () => {
    for (let n = 0; n < 10; n++) {
      for (const arr of arrs) {
        const bitset = new FastBitSet();
        for (let i = 0; i < arr.length; i++) {
          bitset.add(arr[i]);
        }
      }
    }
  },
  (timeMs) => console.log(`\t'fastbitset' ran in ${timeMs.toFixed(1)} ms`)
);
