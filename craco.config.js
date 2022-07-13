const baseExports = {
  plugins: [
    {
      plugin: require("craco-plugin-scoped-css"),
    },
  ],
};

if (process.env.NODE_ENV === "production") {
  return (module.exports = {
    ...baseExports,
    webpack: {
      configure: {
        devtool: false,
        entry: "src/lib.entrypoint.ts",
        output: {
          filename: "library/lib.entrypoint.js",
          library: "A8Connect", // Important
          libraryTarget: "umd", // Important
          umdNamedDefine: true, // Important
        },
        module: {
          rules: [
            {
              test: /\.(png|jpg|gif|otf)$/i,
              type: "asset/inline",
            },
          ],
        },
      },
    },
  });
}

return (module.exports = baseExports);
