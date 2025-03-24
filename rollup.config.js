import { copyFileSync, mkdirSync } from "fs";
import { defineConfig } from "rollup";
import { dirname } from "path";

import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";

export default defineConfig([
  {
    input: "src/index.ts",
    external: /^react($|\/)/,
    output: {
      dir: ".temp",
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: "tsconfig.json",
        rootDir: "src",
        declaration: true,
        declarationDir: ".temp/dts",
      }),
      terser({ keep_fnames: true }),
      copy(".temp/index.js", "dist/index.js"),
      copy(".temp/index.js.map", "dist/index.js.map"),
    ],
  },
  {
    input: ".temp/dts/index.d.ts",
    output: {
      file: ".temp/index.d.ts",
      format: "es",
    },
    plugins: [
      dts({
        tsconfig: "tsconfig.json",
      }),
      copy(".temp/index.d.ts", "dist/index.d.ts"),
    ],
  },
]);

function copy(from, to) {
  return {
    name: "copy",
    async writeBundle() {
      mkdirSync(dirname(to), { recursive: true });
      copyFileSync(from, to);
    },
  };
}
