[![codecov](https://codecov.io/gh/ancient8-dev/a8-id-backend/branch/main/graph/badge.svg?token=IBW28NGP2I)](https://codecov.io/gh/ancient8-dev/a8-id-backend)

## Description

[Ancient8 Connect](https://id.ancient8.gg) UMD library.

This is the browser APIs version.

## Documentation

For detail of browser APIs please refer the [docs](https://docs.ancient8.dev/browser/modules.html#default).

For detail of server APIs please refer the [docs](https://docs.ancient8.dev/server/modules.html#default).


## Installation

```bash
$ yarn add @ancient8/connect
```

## Examples

Please see the demo [here](https://git.ancient8.gg/ancient8-dev/a8-uid/a8-connect-demo)

# Usages

Three main usages of `A8Connect`.

1. Initialize Login Flow

```ts
import {
    init,
    closeModal,
    openModal,
    Adapters,
    Providers,
    Router
} from "@ancient8/connect"

// Remember to import css stylesheet
import "@ancient8/connect/lib.css";

await init({
    chainType: Adapters.ChainType.ALL,
    networkType:
        Providers.NetworkType.testnet ||
        Providers.NetworkType.mainnet,
    disableCloseButton: true,
    onClose: () => {
        // do somthing
    },
    onAuth: (payload) => {
        // do something
        console.log({payload});
    },
    onConnected: (payload) => {
        // do something
        console.log({payload});
    },
}).then(() => {
    openModal();
});
```

2. Initialize Add Wallet Flow

```ts
import {
    init,
    closeModal,
    openModal,
    Adapters,
    Providers,
    Router
} from "@ancient8/connect"

// Remember to import css stylesheet
import "@ancient8/connect/lib.css";

await init({
    chainType: Adapters.ChainType.ALL,
    networkType:
        Providers.NetworkType.testnet ||
        Providers.NetworkType.mainnet,
    initAppFlow: Router.AppFlow.ADD_WALLET_FLOW,
    cleanWalletCache: true,
    onClose: () => {
        // do somthing
    },
    onAuth: (payload) => {
        // do something
        console.log({payload});
    },
    onConnected: (payload) => {
        // do something
        console.log({payload});
    },
}).then(() => {
    openModal();
});
```

3. Initialize Lost Wallet Flow

```ts
import {
    init,
    closeModal,
    openModal,
    Adapters,
    Providers,
    Router
} from "@ancient8/connect"

// Remember to import css stylesheet
import "@ancient8/connect/lib.css";

await init({
    chainType: Adapters.ChainType.ALL,
    networkType:
        Providers.NetworkType.testnet ||
        Providers.NetworkType.mainnet,
    initAppFlow: Router.AppFlow.LOST_WALLET_FLOW,
    withCredential: authToken as string,
    cleanWalletCache: true,
    onClose: () => {
        // do somthing
    },
    onAuth: (payload) => {
        // do something
        console.log({payload});
    },
    onConnected: (payload) => {
        // do something
        console.log({payload});
    },
}).then(() => {
    openModal();
});
```

# Notes

This library is still in beta development. Significant changes may happen anytime.

# Contact

If you have any inquiries please send emails to dev@ancient8.gg.

# License

Copyright (c) 2022 Ancient8.

Licensed under the GPL-3.0
