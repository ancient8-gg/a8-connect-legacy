import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import visualizer from "rollup-plugin-visualizer";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import del from "rollup-plugin-delete";
import url from "postcss-url";
import image from "@rollup/plugin-image";
import copy from "rollup-plugin-copy";

export default {
  input: ["./src/lib.entrypoint.ts"],
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
    image(),
    commonjs({
      transformMixedEsModules: true,
    }),
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
          include: ["./src/assets/fonts/*.otf"],
          url: "inline",
          basePath: "./",
        }),
      ],
    }),
    terser({
      format: {
        ascii_only: true,
      },
    }),
    copy({
      targets: [{ src: "dist/dts/src/*", dest: "dist/" }],
      hook: "writeBundle",
    }),
    del({
      targets: ["dist", "bundle"],
    }),
    visualizer({
      filename: "bundle-analysis.html",
      open: false,
    }),
  ],
};
