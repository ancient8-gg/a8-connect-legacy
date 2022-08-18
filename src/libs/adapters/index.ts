import { BinanceEVMWalletName } from "./evm/binance.adapter";
import { Coin98EVMWalletName } from "./evm/coin98.adapter";
import { CoinbaseEVMWalletName } from "./evm/coinbase.adapter";
import { MetamaskEVMWalletName } from "./evm/metamask.adapter";
import { Coin98SolanaWalletName } from "./sol/coin98.adapter";
import { PhantomSolanaWalletName } from "./sol/phantom.adapter";
import { SlopeSolanaWalletName } from "./sol/slope.adapter";

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
export { SlopeSolanaWallet, SlopeSolanaWalletName } from "./sol/slope.adapter";

// Export Supported Wallets
export const SupportedWallets = [
  BinanceEVMWalletName,
  Coin98EVMWalletName,
  CoinbaseEVMWalletName,
  MetamaskEVMWalletName,
  PhantomSolanaWalletName,
  Coin98SolanaWalletName,
  SlopeSolanaWalletName,
];

// Export adapter interface
export * from "./interface";
