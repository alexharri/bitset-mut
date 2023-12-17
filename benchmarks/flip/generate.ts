import fs from "fs";
import path from "path";

const indices: number[] = [];
for (let i = 0; i < 1_000_000; i++) {
  const index = Math.floor(Math.random() * 1_000_000);
  indices.push(index);
}

fs.writeFileSync(
  path.resolve(__dirname, "1m-indices.json"),
  JSON.stringify(indices),
  "utf-8"
);
