import arg from "arg";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const { _: args } = arg({}, { permissive: false });

if (args.length === 2 && args[0] === "gen") {
  execSync(
    `ts-node -T ${path.resolve(__dirname, "./generate.ts")} -- ${args[1]}`,
    { stdio: "inherit" }
  );
  process.exit(0);
}

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
  const runFile = path.resolve(__dirname, `./${dirName}/run.ts`);

  console.log(`\n\nRunning benchmarks: ${dirName}\n`);
  execSync(`ts-node -T ${runFile}`, { stdio: "inherit" });
}
