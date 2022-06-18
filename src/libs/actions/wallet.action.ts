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
} from "../adapters";

/**
 * Wallet action combine all the actions related to user wallets.
 */
export class WalletAction {
  /**
   * Selected adapter.
   * @public
   */
  public selectedAdapter:
    | Adapters.AdapterInterface.BaseWalletAdapter
    | undefined;

  /**
   * Supported Wallets array.
   * @private
   */
  private supportedWallets: Record<
    string,
    Adapters.AdapterInterface.BaseWalletAdapter
  > = {};

  /**
   * Public constructor without parameters.
   */
  constructor() {
    this.init();
  }

  /**
   * Initialize injected adapters in a public function to callback
   */
  public init() {
    try {
      /**
       * Initialize BinanceChain EVM Wallet.
       */
      this.supportedWallets[BinanceEVMWalletName] = new BinanceEVMWallet(
        (window as any).BinanceChain
      );
    } catch { };

    try {
      /**
       * Initialize Coin98 EVM Wallet.
       */
      this.supportedWallets[Coin98EVMWalletName] = new Coin98EVMWallet(
        (window as any).coin98?.provider
      );
    } catch { }

    try {
      /**
      * Initialize Coinbase EVM Wallet.
      */
      this.supportedWallets[CoinbaseEVMWalletName] = new CoinbaseEVMWallet(
        (window as any).coinbaseWalletExtension
      );
    } catch { }

    try {
      /**
      * Initialize Metamask EVM Wallet.
      */
      this.supportedWallets[MetamaskEVMWalletName] = new MetamaskEVMWallet(
        (window as any).ethereum?.providers?.find(
          (provider: any) => provider.isMetaMask === true
        ) || (window as any).ethereum
      );
    } catch { }

    try {
      /**
      * Initialize Coin98 Solana Wallet.
      */
      this.supportedWallets[Coin98SolanaWalletName] = new Coin98SolanaWallet(
        (window as any).coin98?.sol
      );
    } catch { }

    try {
      /**
       * Initialize Phantom Solana Wallet.
       */
      this.supportedWallets[PhantomSolanaWalletName] = new PhantomSolanaWallet(
        (window as any).solana
      );
    } catch { }
    try {
      /**
      * Initialize Slope Solana Wallet.
      */
      this.supportedWallets[SlopeSolanaWalletName] = new SlopeSolanaWallet(
        !!(window as any).Slope && new (window as any).Slope()
      );
    } catch { }

    /**
     * Initialize Torus Wallet.
     */
    // this.supportedWallets[TorusSolanaWalletName] = new TorusSolanaWallet();
  }

  /**
   * Ensure a wallet is available, otherwise raise error.
   * @private
   */
  private ensureWalletIsAvailable() {
    if (!this.selectedAdapter) throw new Error("No selected wallet.");

    if (!this.selectedAdapter.isInstalled())
      throw new Error(
        `The wallet ${this.selectedAdapter.name} is not installed.`
      );
  }

  /**
   * To check whether the wallet is installed.
   */
  isInstalled(walletName: string) {
    return this.supportedWallets[walletName].isInstalled();
  }

  /**
   * Disconnect selected wallet and select a new wallet.
   * @param walletName
   */
  connectWallet(walletName: string) {
    /**
     * Disconnect selected wallet if applicable.
     */
    this.disconnectWallet();

    /**
     * Select new wallet.
     */
    this.selectedAdapter = this.supportedWallets[walletName];

    /**
     * Connect new wallet.
     */
    this.ensureWalletIsAvailable();
    this.selectedAdapter.connectWallet();
  }

  /**
   * Disconnect selected wallet.
   */
  disconnectWallet() {
    this.ensureWalletIsAvailable();
    this.selectedAdapter.disconnectWallet();
  }

  /**
   * Get wallet address.
   */
  getWalletAddress(): Promise<string> {
    this.ensureWalletIsAvailable();
    return this.selectedAdapter.getWalletAddress();
  }

  /**
   * Connect and Sign a message.
   * @param message
   */
  async signMessage(
    message: string
  ): Promise<{ signature: string; walletAddress: string; walletName: string }> {
    this.ensureWalletIsAvailable();

    const walletName = this.selectedAdapter.name;
    const signature = await this.selectedAdapter.sign(message);
    const walletAddress = await this.selectedAdapter.getWalletAddress();

    return {
      signature,
      walletName,
      walletAddress,
    };
  }

  /**
   * Get all wallet adapters
   */
  getWalletAdapters() {
    try {
      return Object.keys(this.supportedWallets).map((walletName: string) => this.supportedWallets[walletName]);
    } catch { }
  }
}
