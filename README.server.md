[![codecov](https://codecov.io/gh/ancient8-dev/a8-id-backend/branch/main/graph/badge.svg?token=IBW28NGP2I)](https://codecov.io/gh/ancient8-dev/a8-id-backend)

## Description

[Ancient8 Connect](https://id.ancient8.gg) UMD library.

This is the server APIs version. The implementation below will be only valid when in **nodejs environment**. 

## Documentation

For detail of browser APIs please refer the [docs](https://docs.ancient8.dev/browser/).

For detail of server APIs please refer the [docs](https://docs.ancient8.dev/server/).

For detail of adapter APIs please refer the [docs](https://docs.ancient8.dev/adapter/).

## Installation

```bash
$ yarn add @ancient8/connect
```

## Examples

Please see the demo [here](https://git.ancient8.gg/ancient8-dev/a8-uid/a8-connect-demo/-/blob/main/vue-nuxt/components/A8Connect.vue#L34)

# Usages

2 main usages for `A8ServerConnect`.

1. Use OAuth APIs.
```ts
/**
 * Use OAuth APIs
 */

import {
    init,
    Types, 
    getA8ServerConnectInstance
} from "@ancient8/connect/server"

init({
    // Must initialize with oauth credential
    withOAuthCredential: oauthCredential as Types.ConnectOAuthDto.OAuthCredential
});

const instance = getA8ServerConnectInstance();

const authorizedUserId = "abcyxz";

console.log(
    await instance.currentSession.OAuth.getUserInfo(authorizedUserId)
);
```

2. Use Non-Oauth APIs
```ts
/**
 * Use non-oauth APIs
 */

import {
    init,
    getA8ServerConnectInstance
} from "@ancient8/connect/server"

init({
    // can be bearer jwt (can be obtained after successfully login)
    withCredential: authToken as string,
    
    // or use cookie credential (extracted from request header)
    withCookieCredential: cookieCredential as string,
});

const instance = getA8ServerConnectInstance();

console.log(
    await instance.currentSession.User.getUserProfile()
);
```

# Notes

This library is still in beta development. Significant changes may happen anytime.

# Contact

If you have any inquiries please send emails to dev@ancient8.gg.

# License

Copyright (c) 2022 Ancient8.

Licensed under the GPL-3.0
