// Export EVM adapters
export { BinanceEVMWallet, BinanceEVMWalletName } from "./evm/binance.adapter";
export { Coin98EVMWallet, Coin98EVMWalletName } from "./evm/coin98.adapter";
export {
  CoinbaseEVMWallet,
  CoinbaseEVMWalletName,
} from "./evm/coinbase.adapter";
export {
  MetamaskEVMWallet,
  MetamaskEVMWalletName,
} from "./evm/metamask.adapter";

// Export Solana adapter
export {
  PhantomSolanaWallet,
  PhantomSolanaWalletName,
} from "./sol/phantom.adapter";
export {
  Coin98SolanaWallet,
  Coin98SolanaWalletName,
} from "./sol/coin98.adapter";
export { TorusSolanaWallet, TorusSolanaWalletName } from "./sol/torus.adapter";
export { SlopeSolanaWallet, SlopeSolanaWalletName } from "./sol/slope.adapter";

// Export adapter interface
export * as AdapterInterface from "./interface";
