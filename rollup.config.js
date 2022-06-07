// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: `.env.${process.env.APP_ENV}` });

import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import visualizer from "rollup-plugin-visualizer";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";
import nodePolyfills from "rollup-plugin-polyfill-node";
import url from "postcss-url";

export default {
  input: ["./src/index.tsx"],
  output: [
    {
      dir: "dist",
      format: "umd",
      sourcemap: false,
      name: "A8Connect",
      inlineDynamicImports: true,
    },
  ],
  plugins: [
    replace({
      __buildDate__: () => JSON.stringify(new Date()),
      __buildVersion: process.env.VERSION || "develop",
    }),
    typescript({
      tsconfig: "./tsconfig.rollup.json",
      declaration: true,
      declarationDir: "dist/dts",
      emitDeclarationOnly: true,
      allowSyntheticDefaultImports: true,
    }),
    commonjs({
      transformMixedEsModules: true,
    }),
    nodePolyfills(),
    json(),
    resolve(),
    postcss({
      config: {
        path: "./postcss.config.js",
      },
      extensions: [".css"],
      minimize: true,
      extract: "lib.css",
      plugins: [
        url({
          url: "inline",
          basePath: "../public/",
        }),
      ],
    }),
    terser({
      format: {
        ascii_only: true,
      },
    }),
    copy({
      targets: [
        { src: "exports/LICENSE", dest: "bundle/" },
        { src: "exports/README.md", dest: "bundle/" },
        {
          src: "exports/package.export.json",
          dest: "bundle/",
          rename: "package.json",
        },
        { src: "dist/index.js", dest: "bundle/" },
        { src: "dist/lib.css", dest: "bundle/" },
        { src: "dist/dts/exports/*", dest: "bundle/" },
      ],
      hook: "writeBundle",
      verbose: true,
    }),
    del({
      targets: ["dist", "bundle"],
      verbose: true,
    }),
    visualizer({
      filename: "bundle-analysis.html",
      open: false,
    }),
  ],
};
