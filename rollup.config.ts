import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-ts";
import external from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";

import { main, module } from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: main,
      format: "cjs",
      name: "react-lib",
      exports: "named",
    },
    {
      file: module,
      format: "esm",
      exports: "named",
    },
  ],
  plugins: [
    external(),
    resolve(),
    commonjs(),
    typescript(),
    terser({
      keep_fnames: true,
    }),
  ],
};
