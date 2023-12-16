import fs from "fs";
import path from "path";

function randomBitString(len: number) {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += Math.random() > 0.5 ? "0" : "1";
  }
  return out;
}

const arrs: [string, string][][] = [];
for (let i = 0; i < 10; i++) {
  const arr: [string, string][] = [];
  arrs.push(arr);
  for (let j = 0; j < 1_000; j++) {
    const len_a = 500 + Math.floor(Math.random() * 500);
    const len_b = 500 + Math.floor(Math.random() * 500);
    arr.push([randomBitString(len_a), randomBitString(len_b)]);
  }
}

fs.writeFileSync(
  path.resolve(__dirname, "10-times-1k-bitstring-pairs-of-length-1k.json"),
  JSON.stringify(arrs, null, 2),
  "utf-8"
);
