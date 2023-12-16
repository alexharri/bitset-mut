import fs from "fs";
import path from "path";
import { BitSet } from "../../src/bitset";

function randomBitString(len: number) {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += Math.random() > 0.5 ? "0" : "1";
  }
  return out;
}

const arr: string[] = [];
for (let i = 0; i < 10_000; i++) {
  const len = 500 + Math.floor(Math.random() * 500);
  arr.push(randomBitString(len));
}

fs.writeFileSync(
  path.resolve(__dirname, "10k-bitstrings.json"),
  JSON.stringify(arr, null, 2),
  "utf-8"
);

arr.length = 0;

for (let i = 0; i < 500; i++) {
  const bitset = new BitSet();
  bitset.size = 10_000;
  for (let j = 0; j < 100; j++) {
    const index = Math.floor(Math.random() * bitset.size);
    bitset.set(index);
  }
  arr.push(bitset.toString());
}

fs.writeFileSync(
  path.resolve(__dirname, "500-sparse-bitstrings.json"),
  JSON.stringify(arr, null, 2),
  "utf-8"
);
