import fs from "fs";
import path from "path";

function randomBitString(len: number) {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += Math.random() > 0.5 ? "0" : "1";
  }
  return out;
}

const arrs: [string, number[]][][] = [];
for (let i = 0; i < 10; i++) {
  const arr: [string, number[]][] = [];
  arrs.push(arr);
  for (let j = 0; j < 1_000; j++) {
    const bitset_len = 500 + Math.floor(Math.random() * 500);
    const indices = Array.from({ length: 1000 }).map(
      () => 500 + Math.floor(Math.random() * 500)
    );

    arr.push([randomBitString(bitset_len), indices]);
  }
}

fs.writeFileSync(
  path.resolve(__dirname, "10-times-1k-bitstring-and-indices.json"),
  JSON.stringify(arrs),
  "utf-8"
);
