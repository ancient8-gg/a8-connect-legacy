[![codecov](https://codecov.io/gh/ancient8-dev/a8-id-backend/branch/main/graph/badge.svg?token=IBW28NGP2I)](https://codecov.io/gh/ancient8-dev/a8-id-backend)

## Description

[Ancient8 Connect](https://id.ancient8.gg) UMD library.

This is the adapter APIs version. The implementation below will be only valid when in **nodejs environment**.

## Documentation

For detail of browser APIs please refer the [docs](https://docs.ancient8.dev/browser/modules.html#default).

For detail of server APIs please refer the [docs](https://docs.ancient8.dev/server/modules.html#default).

For detail of Adapter APIs please refer the [docs](https://docs.ancient8.dev/adapter/modules.html#default).

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
    const provider = RPCWalletAdapter.getSolanaWalletAdapter(
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
    const rpcAdapter = RPCWalletAdapter.getEVMWalletAdapter(
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

# Notes

This library is still in beta development. Significant changes may happen anytime.

# Contact

If you have any inquiries please send emails to dev@ancient8.gg.

# License

Copyright (c) 2022 Ancient8.

Licensed under the GPL-3.0
