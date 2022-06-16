import * as Adapters from "../adapters";
import {
  BinanceEVMWallet,
  BinanceEVMWalletName,
  Coin98EVMWallet,
  Coin98EVMWalletName,
  Coin98SolanaWallet,
  Coin98SolanaWalletName,
  CoinbaseEVMWallet,
  CoinbaseEVMWalletName,
  MetamaskEVMWallet,
  MetamaskEVMWalletName,
  PhantomSolanaWallet,
  PhantomSolanaWalletName,
  SlopeSolanaWallet,
  SlopeSolanaWalletName,
  TorusSolanaWallet,
  TorusSolanaWalletName,
} from "../adapters";

/**
 * Wallet action combine all the actions related to user wallets
 */
export class WalletAction {
  /**
   * Selected adapter
   * @public
   */
  public selectedAdapter:
    | Adapters.AdapterInterface.BaseWalletAdapter
    | undefined;

  /**
   * Supported Wallets array
   * @private
   */
  private supportedWallets: Record<
    string,
    Adapters.AdapterInterface.BaseWalletAdapter
  >;

  /**
   * Public constructor without parameters
   */
  constructor() {
    /**
     * Initialize BinanceChain EVM Wallet
     */
    this.supportedWallets[BinanceEVMWalletName] = new BinanceEVMWallet(
      (window as any).BinanceChain
    );

    /**
     * Initialize Coin98 EVM Wallet
     */
    this.supportedWallets[Coin98EVMWalletName] = new Coin98EVMWallet(
      (window as any).coin98.provider
    );

    /**
     * Initialize Coinbase EVM Wallet
     */
    this.supportedWallets[CoinbaseEVMWalletName] = new CoinbaseEVMWallet(
      (window as any).coinbaseWalletExtension
    );

    /**
     * Initialize Metamask EVM Wallet
     */
    this.supportedWallets[MetamaskEVMWalletName] = new MetamaskEVMWallet(
      (window as any).ethereum
    );

    /**
     * Initialize Coin98 Solana Wallet
     */
    this.supportedWallets[Coin98SolanaWalletName] = new Coin98SolanaWallet(
      (window as any).coin98.sol
    );

    /**
     * Initialize Phantom Solana Wallet
     */
    this.supportedWallets[PhantomSolanaWalletName] = new PhantomSolanaWallet(
      (window as any).solana
    );

    /**
     * Initialize Slope Solana Wallet
     */
    this.supportedWallets[SlopeSolanaWalletName] = new SlopeSolanaWallet(
      new (window as any).Slope()
    );

    /**
     * Initialize Torus Wallet
     */
    this.supportedWallets[TorusSolanaWalletName] = new TorusSolanaWallet();
  }

  /**
   * Ensure a wallet is available, otherwise raise error.
   * @private
   */
  private ensureWalletIsAvailable() {
    if (!this.selectedAdapter) throw new Error("No selected wallet");

    if (!this.selectedAdapter.isInstalled())
      throw new Error(
        `The wallet ${this.selectedAdapter.name} is not installed`
      );
  }

  /**
   * Select wallet action
   * @param walletName
   */
  selectWallet(walletName: string) {
    this.selectedAdapter = this.supportedWallets[walletName];
  }

  /**
   * To check whether the wallet is installed.
   */
  isInstalled(walletName: string) {
    return this.supportedWallets[walletName].isInstalled();
  }

  /**
   * Get wallet address
   */
  getWalletAddress(): Promise<string> {
    this.ensureWalletIsAvailable();
    return this.selectedAdapter.getWalletAddress();
  }

  /**
   * Connect and Sign a message
   * @param walletName
   * @param message
   */
  async signMessage(
    walletName: string,
    message: string
  ): Promise<{ signature: string; walletAddress: string; walletName: string }> {
    this.ensureWalletIsAvailable();

    const signature = await this.selectedAdapter.sign(message);
    const walletAddress = await this.selectedAdapter.getWalletAddress();

    return {
      signature,
      walletName,
      walletAddress,
    };
  }
}
