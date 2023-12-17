import typescript from "@rollup/plugin-typescript";

const config = {
  input: "src/bitset.ts",
  external: [],
  output: [
    { file: "dist/src/bitset.js", format: "cjs" },
    { file: "dist/src/bitset.esm.js", format: "es" },
  ],
  plugins: [
    typescript({
      declaration: true,
      compilerOptions: { outDir: "dist" },
      exclude: ["./benchmarks/**"],
    }),
  ],
};

export default config;
