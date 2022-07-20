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
  WalletProvider,
} from "../adapters";
import {
  SlopeSolanaWallet,
  SlopeSolanaWalletName,
} from "../adapters/sol/slope.adapter";
import { RegistryProvider, StorageProvider, UtilsProvider } from "../providers";
import { getStorageProvider } from "../providers";
import { ConnectedWalletPayload } from "../dto/a8-connect-session.dto";

export const CONNECTED_WALLET_KEY = "CONNECTED_WALLET";

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
   * `Storage` provides all methods to handle storage actions.
   * @protected
   */
  private readonly storageProvider: StorageProvider;

  /**
   * Supported Wallets array.
   * @private
   */
  private supportedWallets: Record<string, BaseWalletAdapter> = {};

  /**
   * Public constructor without parameters.
   */
  constructor() {
    this.initializeAdapters();

    /**
     * Initialize for storage provider
     */
    this.storageProvider = getStorageProvider();
  }

  /**
   * Initialize injected adapters in a public function to callback
   */
  public initializeAdapters() {
    const windowInstance = RegistryProvider.getInstance().window;

    /**
     * Initialize Metamask EVM Wallet.
     */
    this.supportedWallets[MetamaskEVMWalletName] = new MetamaskEVMWallet(
      windowInstance.ethereum?.providers?.find(
        (provider: WalletProvider) => provider.isMetaMask === true
      ) || windowInstance.ethereum
    );

    /**
     * Initialize BinanceChain EVM Wallet.
     */
    this.supportedWallets[BinanceEVMWalletName] = new BinanceEVMWallet(
      windowInstance.BinanceChain
    );

    /**
     * Initialize Coin98 EVM Wallet.
     */
    this.supportedWallets[Coin98EVMWalletName] = new Coin98EVMWallet(
      windowInstance.coin98?.provider
    );

    /**
     * Initialize Coinbase EVM Wallet.
     */
    this.supportedWallets[CoinbaseEVMWalletName] = new CoinbaseEVMWallet(
      windowInstance.ethereum?.providers?.find(
        (provider: WalletProvider) =>
          provider.isCoinbaseWallet === true ||
          provider.isCoinbaseBrowser === true
      ) ||
        windowInstance.coinbaseWalletExtension ||
        windowInstance.ethereum
    );

    /**
     * Initialize Phantom Solana Wallet.
     */
    this.supportedWallets[PhantomSolanaWalletName] = new PhantomSolanaWallet(
      windowInstance.solana
    );

    /**
     * Initialize Slope Solana Wallet.
     */
    this.supportedWallets[SlopeSolanaWalletName] = new SlopeSolanaWallet(
      !!windowInstance.Slope && new windowInstance.Slope()
    );

    /**
     * Initialize Coin98 Solana Wallet.
     */
    this.supportedWallets[Coin98SolanaWalletName] = new Coin98SolanaWallet(
      windowInstance.coin98?.sol
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
   * The function to ensure wallet is connected, otherwise raise error
   * @private
   */
  private async ensureWalletIsConnected() {
    this.ensureWalletIsAvailable();
    if (!(await this.selectedAdapter.isConnected()))
      throw new Error("Wallet not connected");
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
  async connectWallet(walletName: string) {
    /**
     * Disconnect selected wallet if applicable.
     */
    await this.disconnectWallet();

    /**
     * Select new wallet.
     */
    this.selectedAdapter = this.supportedWallets[walletName];

    /**
     * Connect new wallet.
     */
    this.ensureWalletIsAvailable();

    /**
     * Connect wallet with timeout wrapper
     */
    const address = await new UtilsProvider().withTimeout<string>(
      this.selectedAdapter.connectWallet.bind(this.selectedAdapter),
      10000
    );

    /**
     * Persist connect wallet
     */
    if (!!address) {
      this.storageProvider.setItem(
        CONNECTED_WALLET_KEY,
        JSON.stringify({
          walletName,
          chainType: this.selectedAdapter.chainType,
        })
      );
    }

    /**
     * return connected address
     */
    return address;
  }

  /**
   * The function to clean wallet cache
   */
  cleanWalletCache() {
    return this.storageProvider.removeItem(CONNECTED_WALLET_KEY);
  }

  /**
   * Restore connection
   */
  async restoreConnection() {
    const connectedWalletData = JSON.parse(
      this.storageProvider.getItem(CONNECTED_WALLET_KEY, null)
    );

    if (!connectedWalletData) {
      this.storageProvider.removeItem(CONNECTED_WALLET_KEY);
      return null;
    }

    const { walletName } = connectedWalletData;

    const adapter = this.getWalletAdapter(walletName);

    /**
     * Now to check for timeout
     */
    // Check if the previous wallet is still connected
    if (await adapter.isConnected()) {
      /**
       *  If connected then we return the current wallet address
       */
      return this.connectWallet(walletName);
    }
    return null;
  }

  /**
   * The function to get connected session
   */
  async getConnectedSession(): Promise<ConnectedWalletPayload> {
    await this.ensureWalletIsConnected();

    return {
      walletAddress: await this.getWalletAddress(),
      walletName: this.selectedAdapter.name,
      chainType: this.selectedAdapter.chainType,
      provider: this.selectedAdapter,
    };
  }

  /**
   * Disconnect selected wallet.
   */
  async disconnectWallet() {
    try {
      this.ensureWalletIsAvailable();
      await this.selectedAdapter.disconnectWallet();
      this.storageProvider.removeItem(CONNECTED_WALLET_KEY);
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
    const signature = await new UtilsProvider().withTimeout<string>(
      () => this.selectedAdapter.sign.bind(this.selectedAdapter)(message),
      10000
    );
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
  getWalletAdapters(type: ChainType = ChainType.ALL): BaseWalletAdapter[] {
    return Object.keys(this.supportedWallets)
      .map((walletName: string) => this.supportedWallets[walletName])
      .filter((walletProvider) => {
        if (type === ChainType.ALL) return true;
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
