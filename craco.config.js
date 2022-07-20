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
          entry: "src/exports/browser.entrypoint.ts",
          output: {
            filename: "browser/browser.entrypoint.js",
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
          entry: "src/exports/server.entrypoint.ts",
          output: {
            filename: "server/server.entrypoint.js",
            library: "A8Connect", // Important
            libraryTarget: "umd", // Important
            umdNamedDefine: true, // Important
          },
        },
      },
    });
  }
}

return (module.exports = baseExports);
