import fs from "fs";
import path from "path";

const ranges: [number, number][] = [];
for (let j = 0; j < 1_000_000; j++) {
  const index = Math.floor(Math.random() * 10_000_000);
  const offset = Math.floor(Math.random() * 1000);
  ranges.push([index, index + offset]);
}

fs.writeFileSync(
  path.resolve(__dirname, "1m-large-ranges.json"),
  JSON.stringify(ranges),
  "utf-8"
);

ranges.length = 0;

for (let j = 0; j < 100_000; j++) {
  const index = Math.floor(Math.random() * 10_000_000);
  const offset = Math.floor(Math.random() * 100);
  ranges.push([index, index + offset]);
}

fs.writeFileSync(
  path.resolve(__dirname, "100k-small-ranges.json"),
  JSON.stringify(ranges),
  "utf-8"
);
