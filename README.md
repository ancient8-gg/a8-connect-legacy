[![codecov](https://codecov.io/gh/ancient8-dev/a8-id-backend/branch/main/graph/badge.svg?token=IBW28NGP2I)](https://codecov.io/gh/ancient8-dev/a8-id-backend)

## Description

[Ancient8 Connect](https://id.ancient8.gg) UMD library.

## Installation

```bash
$ yarn add @ancient8/connect
```

## Documentation

For details API please refer the [docs](https://docs.ancient8.dev/modules.html#default).

## Examples

Please see the demo [here](https://git.ancient8.gg/ancient8-dev/a8-uid/a8-connect-demo)

# Usages

There is three main flow usage of SDK

1. Login flow

```ts
import {
    init,
    closeModal,
    openModal,
    Adapters,
    Providers,
    Router
} from "@ancient8/connect"

await init({
    chainType: Adapters.ChainType.ALL,
    networkType:
        Providers.NetworkType.testnet ||
        Providers.NetworkType.mainnet,
    disableCloseButton: true,
    onClose: async () => {
        // do somthing
    },
    onAuth: () => {
        // do something
    },
    onConnected: () => {
        // do something
    }
}).then(() => {
    openModal();
});
```

2. Add wallet flow

```ts
import {
    init,
    closeModal,
    openModal,
    Adapters,
    Providers,
    Router
} from "@ancient8/connect"

await init({
    chainType: Adapters.ChainType.ALL,
    networkType:
        Providers.NetworkType.testnet ||
        Providers.NetworkType.mainnet,
    initAppFlow: Router.AppFlow.ADD_WALLET_FLOW,
    cleanWalletCache: true,
    onClose: async () => {
        // do somthing
    },
    onAuth: () => {
        // do something
    },
    onConnected: () => {
        // do something
    }
}).then(() => {
    openModal();
});
```

3. Lost wallet flow

```ts
import {
    init,
    closeModal,
    openModal,
    Adapters,
    Providers,
    Router
} from "@ancient8/connect"

await init({
    chainType: Adapters.ChainType.ALL,
    networkType:
        Providers.NetworkType.testnet ||
        Providers.NetworkType.mainnet,
    initAppFlow: Router.AppFlow.LOST_WALLET_FLOW,
    withCredential: authToken as string,
    cleanWalletCache: true,
    onClose: async () => {
        // do somthing
    },
    onAuth: () => {
        // do something
    },
    onConnected: () => {
        // do something
    }
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
