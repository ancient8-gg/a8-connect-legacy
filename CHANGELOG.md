# Changelog

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