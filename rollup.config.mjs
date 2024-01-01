import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

const config = {
  input: "src/bitset.ts",
  external: [],
  output: [
    { file: "dist/bitset.js", format: "cjs" },
    { file: "dist/bitset.esm.js", format: "es" },
  ],
  plugins: [
    typescript({
      declaration: true,
      compilerOptions: { outDir: "dist" },
      exclude: ["./benchmarks/**", "**/*.spec.ts"],
    }),
    copy({
      targets: [
        { src: ["README.md", "LICENSE.md", "package.json"], dest: "dist" },
      ],
    }),
  ],
};

export default config;
