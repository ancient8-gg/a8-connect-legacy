[![codecov](https://codecov.io/gh/ancient8-dev/a8-id-backend/branch/main/graph/badge.svg?token=IBW28NGP2I)](https://codecov.io/gh/ancient8-dev/a8-id-backend)

## Description

[Ancient8 Connect](https://id.ancient8.gg) UMD library.

This is the adapter APIs version. The implementation below will be only valid when in **browser environment**.

## Documentation

For detail of browser APIs please refer the [docs](https://docs.ancient8.dev/browser/).

For detail of server APIs please refer the [docs](https://docs.ancient8.dev/server/).

For detail of adapter APIs please refer the [docs](https://docs.ancient8.dev/adapter/).

## Installation

```bash
$ yarn add @ancient8/connect
```

## Examples

Please see the demo [here](https://git.ancient8.gg/ancient8-dev/a8-uid/a8-connect-demo/-/tree/main/react-next/src)

# Usages

2 main usages for `RPCWalletAdapter`.

1. Making RPC with Solana wallets

```ts
import {
    clusterApiUrl,
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";

export * from '@ancient8/connect';
import RPCWalletAdapter, {Types as RPCWalletTypes} from '@ancient8/connect/adapter';

let a8Connect: A8Connect;
let session: Types.ConnectSessionDto.A8ConnectSession;

/**
 * @description Transfer token in SOL network
 * @param to Wallet address which will recive token
 * @param amount Amount token want to transfer
 */
export const transferSol = async (
    to: string,
    amount: number,
): Promise<void> => {
    /**
     * Extract current session from SDK
     */
    a8Connect = getA8ConnectInstance();
    session = a8Connect.currentSession;

    if (!session?.connectedWallet) {
        throw new Error("Not connected");
    }

    /**
     * Get wallet adapter
     */
    const provider = await RPCWalletAdapter.getSolanaWalletAdapter(
        session.connectedWallet.walletName
    );

    /**
     * Construct instructions
     */
    const tx = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: new PublicKey(session?.connectedWallet?.walletAddress),
            toPubkey: new PublicKey(to),
            lamports: amount * LAMPORTS_PER_SOL,
        })
    );

    /**
     * Fetch tx metadata
     */
    const connection = new Connection(clusterApiUrl("devnet"));
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = new PublicKey(session?.connectedWallet?.walletAddress);

    /**
     * Sign and send transaction to RPC server.
     */
    const rawTx = await provider.signTransaction(tx);
    const txid = await connection.sendRawTransaction(rawTx.serialize());
}
```

2. Making RPC requests with EVM wallets

```ts
export * from '@ancient8/connect';
import RPCWalletAdapter, {Types as RPCWalletTypes} from '@ancient8/connect/adapter';

let a8Connect: A8Connect;
let session: Types.ConnectSessionDto.A8ConnectSession;

/**
 * @description Transfer token in ETH network
 * @param to Wallet address which will recive token
 * @param amount Amount token want to transfer
 */
export const transferEther = async (
    to: string,
    amount: number,
): Promise<void> => {
    /**
     * Extract session from SDK
     */
    a8Connect = getA8ConnectInstance();
    session = a8Connect.currentSession;

    /**
     * Get the wallet adapter
     */
    const rpcAdapter = await RPCWalletAdapter.getEVMWalletAdapter(
        session.connectedWallet.walletName, 
        // have to inject 
        session.connectedWallet.provider.injectedProvider
    );

    /**
     * Make RPC requests
     */
    rpcAdapter.eth.sendTransaction({
        from: session.connectedWallet.walletAddress,
        value: '0x9184e72a',
        to: to,
    })
    .then((tx: any) => console.log({tx}))
    .catch((err: any) => console.log({err}));
}
```

# Common issues

### 1. Handle `.mjs` dependencies transpile issues when using `nuxtjs`

File `nuxt.config.js`

```ts
// other configs ...
build: {
    extend(config, ctx) {
      if(ctx.isClient){
        // transpile .mjs too
        config.module.rules.push({
          include: /node_modules/,
          test: /\.mjs$/,
          type: 'javascript/auto'
        })
      }
    }
  }
```

### 2. Handle `nodejs` polyfill issues when using `webpack 5`

Since `webpack 5` no longer bundled `nodejs` polyfills, we have to install `nodejs` polyfills manually.

#### Install `webpack5` plugin

```bash
yarn add node-polyfill-webpack-plugin
```

#### For `webpack5` projects, file `webpack.config.js`

```ts
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
	// Other rules...
	plugins: [
		new NodePolyfillPlugin()
	]
};
```

#### For `vue-cli-3` projects, file `vue.config.js`

```ts
const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    // Other configs...
  },
})
```

# Notes

This library is still in beta development. Significant changes may happen anytime.

# Contact

If you have any inquiries please send emails to dev@ancient8.gg.

# License

Copyright (c) 2022 Ancient8.

Licensed under the GPL-3.0
