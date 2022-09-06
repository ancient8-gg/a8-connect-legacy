// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require("webpack");

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
          target: "web",
          devtool: false,
          entry: "src/browser.ts",
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
      webpack: {
        configure: {
          target: "node",
          devtool: false,
          entry: "src/server.ts",
          output: {
            filename: "server/server.js",
            library: "A8Connect", // Important
            libraryTarget: "umd", // Important
            umdNamedDefine: true, // Important
            globalObject: "global",
          },
        },
      },
    });
  }

  /**
   * Bundle for adapter environment
   */
  if (process.env.MODE === "adapter") {
    return (module.exports = {
      webpack: {
        configure: {
          target: "web",
          devtool: false,
          entry: "src/adapter.ts",
          output: {
            filename: "adapter/adapter.js",
            library: "A8Connect", // Important
            libraryTarget: "umd", // Important
            umdNamedDefine: true, // Important
          },
          externals: {
            web3: "web3",
            "web3-core": "web3-core",
            "@solana/wallet-adapter-base": "@solana/wallet-adapter-base",
            "@solana/wallet-adapter-wallets": "@solana/wallet-adapter-wallets",
            "@solana/web3.js": "@solana/web3.js",
          },
        },
      },
    });
  }
}

/**
 * @dev Default for development environment
 */
return (module.exports = {
  ...baseExports,
  webpack: {
    configure: {
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        }),
        new webpack.ProvidePlugin({ process: "process/browser.js" }),
      ],
      resolve: {
        fallback: {
          crypto: require.resolve("crypto-browserify"),
          http: require.resolve("http-browserify"),
          https: require.resolve("https-browserify"),
          stream: require.resolve("stream-browserify"),
          buffer: require.resolve("buffer"),
        },
      },
    },
  },
});
