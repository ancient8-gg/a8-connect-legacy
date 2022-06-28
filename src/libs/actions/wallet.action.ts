import {
  BaseWalletAdapter,
  BinanceEVMWallet,
  BinanceEVMWalletName,
  ChainType,
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
} from "../adapters";
import {
  SlopeSolanaWallet,
  SlopeSolanaWalletName,
} from "../adapters/sol/slope.adapter";

/**
 * Wallet action combine all the actions related to user wallets.
 */
export class WalletAction {
  /**
   * Selected adapter.
   * @public
   */
  public selectedAdapter: BaseWalletAdapter | undefined;

  /**
   * Supported Wallets array.
   * @private
   */
  private supportedWallets: Record<string, BaseWalletAdapter> = {};

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
    /**
     * Initialize BinanceChain EVM Wallet.
     */
    this.supportedWallets[BinanceEVMWalletName] = new BinanceEVMWallet(
      (window as any).BinanceChain
    );

    /**
     * Initialize Coin98 EVM Wallet.
     */
    this.supportedWallets[Coin98EVMWalletName] = new Coin98EVMWallet(
      (window as any).coin98?.provider
    );

    /**
     * Initialize Coinbase EVM Wallet.
     */
    this.supportedWallets[CoinbaseEVMWalletName] = new CoinbaseEVMWallet(
      (window as any).coinbaseWalletExtension
    );

    /**
     * Initialize Metamask EVM Wallet.
     */
    this.supportedWallets[MetamaskEVMWalletName] = new MetamaskEVMWallet(
      (window as any).ethereum?.providers?.find(
        (provider: any) => provider.isMetaMask === true
      ) || (window as any).ethereum
    );

    /**
     * Initialize Coin98 Solana Wallet.
     */
    this.supportedWallets[Coin98SolanaWalletName] = new Coin98SolanaWallet(
      (window as any).coin98?.sol
    );

    /**
     * Initialize Phantom Solana Wallet.
     */
    this.supportedWallets[PhantomSolanaWalletName] = new PhantomSolanaWallet(
      (window as any).solana
    );
    /**
     * Initialize Slope Solana Wallet.
     */
    this.supportedWallets[SlopeSolanaWalletName] = new SlopeSolanaWallet(
      !!(window as any).Slope && new (window as any).Slope()
    );
    //
    // /**
    //  * Initialize Torus Wallet.
    //  */
    // this.supportedWallets[TorusSolanaWalletName] = new TorusSolanaWallet();
  }

  /**
   * Ensure a wallet is available, otherwise raise error.
   * @private
   */
  private ensureWalletIsAvailable() {
    if (!this.selectedAdapter) throw new Error("No selected wallet.");

    if (!this.selectedAdapter.isInstalled()) {
      throw new Error(
        `The wallet ${this.selectedAdapter.name} is not installed.`
      );
    }
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
     * Select new wallet.
     */
    this.selectedAdapter = this.supportedWallets[walletName];

    /**
     * Disconnect selected wallet if applicable.
     */
    this.disconnectWallet();

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
    try {
      this.ensureWalletIsAvailable();
      this.selectedAdapter.disconnectWallet();
    } catch {}
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
   * Get all wallet adapters, or with specific chain type condition.
   */
  getWalletAdapters(type: "all" | ChainType = "all"): BaseWalletAdapter[] {
    return Object.keys(this.supportedWallets)
      .map((walletName: string) => this.supportedWallets[walletName])
      .filter((walletProvider) => {
        if (type === "all") return true;
        return walletProvider.chainType === type;
      });
  }

  /**
   * Get wallet adapter with specific wallet name
   */
  getWalletAdapter(walletName: string): BaseWalletAdapter {
    return this.supportedWallets[walletName];
  }
}
