import fs from "fs";
import path from "path";

const arrs: [number, number][][] = [];
for (let i = 0; i < 10; i++) {
  const arr: [number, number][] = [];
  arrs.push(arr);
  for (let j = 0; j < 100_000; j++) {
    const index = Math.floor(Math.random() * 10_000_000);
    const offset = Math.floor(Math.random() * 1000);
    arr.push([index, index + offset]);
  }
}

fs.writeFileSync(
  path.resolve(__dirname, "10-times-100k-ranges.json"),
  JSON.stringify(arrs),
  "utf-8"
);
