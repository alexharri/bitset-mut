import arg from "arg";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const { _: args } = arg({}, { permissive: false });

if (args.length > 1) {
  throw new Error(`Too many arguments. Expected 1 but got ${args.length}`);
}
const dirNames =
  args.length === 1
    ? [args[0]]
    : fs
        .readdirSync(path.resolve(__dirname))
        .filter((item) => !item.includes("."));

for (const dirName of dirNames) {
  const generateFile = path.resolve(__dirname, `./${dirName}/generate.ts`);

  console.log(`\n\nGenerating benchmark data: ${dirName}\n`);
  execSync(`ts-node -T ${generateFile}`, { stdio: "inherit" });
}
