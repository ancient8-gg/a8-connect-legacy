[![codecov](https://codecov.io/gh/ancient8-dev/a8-id-backend/branch/main/graph/badge.svg?token=IBW28NGP2I)](https://codecov.io/gh/ancient8-dev/a8-id-backend)

## Description

[Ancient8 Connect](https://id.ancient8.gg) UMD library.

## Installation

```bash
$ yarn add @ancient8/connect
```

## Documentation

For details API please refer the [docs](https://id.ancient8.gg/profile/docs).

## Examples

### 1. Open and close A8Connect Popup

#### Using ES6 Modules

```ts
import A8Connect from "@ancient8/connect";

const a8ConnectContainer = new A8Connect("#uid");

const closeModal = a8ConnectContainer.init(
  (response) => {
    console.log(a8ConnectContainer.currentSession);
  },
  {
    autoLogin: true,
    enabledWallets: ["use_metamask_uid", "use_coin98_evm_uid"],
  }
);
```

#### Using UMD library

```html
<html>
  <head>
    <title>Test UID</title>
    <script src="bundle/index.js?v=3"></script>
    <link rel="stylesheet" href="bundle/lib.css?v=3" />
  </head>
  <body>
    <div id="uid"></div>

    <button onclick="closeModal = openModal()" style="z-index: 999;">
      Open modal
    </button>

    <button onclick="closeModal()" style="z-index: 999;">Close modal</button>

    <script>
      var a8ConnectContainer = new A8Connect("uid");
      var closeModal;
      var openModal = () =>
        a8ConnectContainer.init(
          (res) => {
            console.log(a8ConnectContainer.currentSession);
          },
          {
            autoLogin: true,
            enabledWallets: ["use_metamask_uid", "use_coin98_evm_uid"],
          }
        );
    </script>
  </body>
</html>
```

### 2. Login

If you enable auto login, there will be no need to handle this manually. Otherwise, use:

```ts
const authToken = await a8ConnectContainer.currentSession.login(
  a8ConnectContainer.currentSession.address,
  a8ConnectContainer.currentSession.authType,
  a8ConnectContainer.currentSession.walletName
);
```

### 3. Get current user profile

```ts
await a8ConnectContainer.currentSession.getUserProfile();
```

### 4. Logout

```ts
await a8ConnectContainer.currentSession.logout();
```

# Notes

This library is still in beta development. Significant changes may happen anytime.

# Contact

If you have any inquiries please send emails to dev@ancient8.gg.

# License

Copyright (c) 2022 Ancient8.

Licensed under the GPL-3.0
