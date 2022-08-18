import Web3 from "web3";
import { provider } from "web3-core";

import { BaseMessageSignerWalletAdapter } from "@solana/wallet-adapter-base";

import {
  Coin98WalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import {
  Coin98SolanaWalletName,
  PhantomSolanaWalletName,
  SlopeSolanaWalletName,
  SupportedWallets,
} from "./libs/adapters";

const WALLET_NOT_SUPPORTED_ERROR = "WALLET_NOT_SUPPORTED_ERROR";

/**
 * @notice `WalletAdapter` can be used to map wallet name with corresponding wallet adapter.
 */
export class RPCWalletAdapter {
  /**
   * `getSolanaWalletAdapter` maps wallet name with a solana wallet.
   * @param walletName
   */
  public static getSolanaWalletAdapter(
    walletName: string
  ): BaseMessageSignerWalletAdapter {
    /**
     * Raise error if the wallet is not supported.
     */
    if (!SupportedWallets.includes(walletName)) {
      throw new Error(WALLET_NOT_SUPPORTED_ERROR);
    }

    /**
     * Map wallet name using switch - case function.
     */
    switch (walletName) {
      /**
       * Return Coin98 wallet adapter.
       */
      case Coin98SolanaWalletName:
        return new Coin98WalletAdapter();

      /**
       * Return Phantom wallet adapter.
       */
      case PhantomSolanaWalletName:
        return new PhantomWalletAdapter();

      /**
       * Return Slope wallet adapter.
       */
      case SlopeSolanaWalletName:
        return new SlopeWalletAdapter();

      /**
       * Return null in case the SDK doesn't support.
       */
      default:
        return null;
    }
  }

  /**
   * `getEVMWalletAdapter` maps wallet name with an EVM wallet.
   * @param walletName
   * @param provider
   */
  public static getEVMWalletAdapter(
    walletName: string,
    provider: provider
  ): Web3 {
    /**
     * Raise error if the wallet is not supported.
     */
    if (!SupportedWallets.includes(walletName)) {
      throw new Error(WALLET_NOT_SUPPORTED_ERROR);
    }

    if (provider) return new Web3(provider);

    return null;
  }
}

/**
 * Export type
 */
export type { Web3, provider };
