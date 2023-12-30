import fs from "fs";
import path from "path";

const arrs: number[][] = [];
for (let i = 0; i < 50; i++) {
  const arr: number[] = [];
  arrs.push(arr);
  for (let j = 0; j < 100_000; j++) {
    arr.push(Math.floor(Math.random() * 10_000_000));
  }
}

fs.writeFileSync(
  path.resolve(__dirname, "50-times-100k-indices-from-0-to-10m.json"),
  JSON.stringify(arrs),
  "utf-8"
);

arrs.length = 0;

for (let i = 0; i < 50; i++) {
  const arr: number[] = [];
  arrs.push(arr);
  for (let j = 0; j < 100_000; j++) {
    arr.push(Math.floor(Math.random() * 100_000));
  }
}

fs.writeFileSync(
  path.resolve(__dirname, "50-times-100k-indices-from-0-to-100k.json"),
  JSON.stringify(arrs),
  "utf-8"
);
