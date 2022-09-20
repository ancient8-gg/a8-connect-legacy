# Changelog

## [2.1.19] - 20/09/2022

### Added

- UI - Added new welcome message
- SDK - Signup with Email + OTP
- SDK - Login with Email + OTP
- SDK - Develop Wallet Adapters to standardize the way of making RPC requests
- Backend - Login with Email + OTP
- Backend - Sign Up with Email + OTP

### Fixed

- UI - Should not auto login after user click to close the connect wallet popup
- SDK - Fix conflicted packages (exports is not defined)
- SDK - Should not display the blue border after minimizing the browser
- SDK - Emit `onConnected` when user navigates to Connected Wallet screen
- SDK - Emit `onLoggedOut` when user logged out during onboarding flow
- SDK - Emit `onDisconnected` when user disconnected during onboarding flow
- SDK - Cannot Re-Connect a new wallet in case user cancel Sign new wallet step


## [2.1.0] - 13/08/2022

### Added

- Doc - Write examples to send RPC requests with using SDK Coin98 (SOL) Provider
- Doc - Write examples to send RPC requests with using SDK Phantom (SOL) Provider
- Doc - Write examples to send RPC requests with using SDK Slope (SOL) Provider
- Doc - Write examples to send RPC requests with using SDK Coin98 (EVM) Provider
- Doc - Write examples to send RPC requests with using SDK Metamask (EVM) Provider
- Doc - Write examples to send RPC requests with using SDK Binance Wallet (EVM) Provider
- Doc - Write examples to send RPC requests with using SDK Coinbase (EVM) Provider
- Backend - Enable Discord authentication (login + signup)
- Backend - Enable connecting Discord account to UID account
- Backend - Enable querying users connected to an OAuth record
- SDK - Enable server side compatibility
- SDK - Enable OAuth APIs providers
- SDK - Write examples for server side SDK implementation

### Fixed 

- UI - Lost wallet - Not display UI after click on valid link via email
- Lost wallet - Not display Login popup after click on "Login now" button
- Delete wallet - Not auto logout UID after user deleted wallet has been logged in
- UI - ADD WALLET - Should not display text at footer
- UI - SIGN IN - Should not display text at footer in case that wallet belong to existing UID
- SDK - Cannot log in when user waits over 60 seconds at Sign message step
- SDK - Cannot add wallet when user waits over 60 seconds at Sign message step

### Removed

- UI - Temporarily removed KYC section