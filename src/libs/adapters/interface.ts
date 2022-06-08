/**
 * RPC Payload
 */
export interface RPCRequestPayload<P> {
  method: string;
  params?: P;
}

/**
 * Generic WalletProvider interface
 */
export interface WalletProvider {
  /**
   * The function to send RPC requests to wallet software
   * @param payload
   */
  request<P, T>(payload: RPCRequestPayload<P>): Promise<T>;

  /**
   * The function to send RPC requests to wallet software
   * @param method
   * @param param
   */
  send<P, T>(method: string, param: P): Promise<T>;

  /**
   * The function to disconnect from wallet software
   */
  disconnect(): Promise<void>;

  /**
   * The function to check whether the wallet software is connected or not.
   */
  isConnected?: () => Promise<boolean> | boolean;

  /**
   * A flag to detect whether current provider is coin98 or not.
   */
  isCoin98?: boolean;

  /**
   * A flag to detect whether current provider is metamask or not.
   */
  isMetaMask?: boolean;

  /**
   * A flag to detect whether current provider is phantom or not.
   */
  isPhantom?: boolean;
}

/**
 * BinanceChain wallet provider interface
 */
export interface BinanceProvider extends WalletProvider {
  /**
   * The function is specific to BinanceProvider
   * @param walletAddress
   * @param message
   */
  bnbSign<T>(walletAddress: string, message: string): Promise<T>;
}

/**
 * BaseWalletAdapter is an interface.
 */
export interface BaseWalletAdapter {
  /**
   * Injected Provider is loaded when document object is ready.
   */
  injectedProvider: WalletProvider | BinanceProvider;

  /**
   * The function to sign message, return a signature in string format.
   * @param message
   */
  sign(message: string): Promise<string>;

  /**
   * The function to connect wallet.
   */
  connectWallet(): Promise<string | null>;

  /**
   * The function to detect whether the wallet software is installed or not.
   */
  isInstalled(): boolean;

  /**
   * The function to detect whether user connected to the current wallet software or not.
   */
  isConnected(): Promise<boolean>;

  /**
   * The function to disconnect from current wallet software.
   */
  disconnectWallet(): Promise<void>;

  /**
   * The function to get current wallet address.
   */
  getWalletAddress(): Promise<string | null>;
}
