const baseExports = {
  plugins: [
    {
      plugin: require("craco-plugin-scoped-css"),
    },
  ],
};

/**
 * Enable build mode for production
 */
if (process.env.NODE_ENV === "production") {
  /**
   * Bundle for browser environment
   */
  if (process.env.MODE === "browser") {
    return (module.exports = {
      ...baseExports,
      webpack: {
        configure: {
          devtool: false,
          entry: "src/exports/browser.ts",
          output: {
            filename: "browser/browser.js",
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

  /**
   * Bundle for server environment
   */
  if (process.env.MODE === "server") {
    return (module.exports = {
      ...baseExports,
      webpack: {
        configure: {
          devtool: false,
          entry: "src/exports/server.ts",
          output: {
            filename: "server/server.js",
            library: "A8Connect", // Important
            libraryTarget: "umd", // Important
            umdNamedDefine: true, // Important
            globalObject: "this",
          },
        },
      },
    });
  }
}

return (module.exports = baseExports);
