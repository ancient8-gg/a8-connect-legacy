/**
 * Defind chain type 
 * Includes two main chain: Solana chain and Ethererum chain
 */
export enum ChainType {
  EVM = 'EVM',
  SOL = 'SOL',
}

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
  request?<P, T>(payload: RPCRequestPayload<P>): Promise<T>;

  /**
   * The function to send RPC requests to wallet software
   * @param method
   * @param param
   */
  send?<P, T>(method: string, param: P): Promise<T>;

  /**
   * The function to connect wallet software.
   */
  connect?<T>(): Promise<T>;

  /**
   * The function to disconnect from wallet software
   */
  disconnect(): Promise<void>;

  /**
   * The function is specific to BinanceProvider
   * @param walletAddress
   * @param message
   */
  bnbSign?<T>(walletAddress: string, message: string): Promise<T>;

  /**
   * The function to sign a message. (only available to slope wallet)
   */
  signMessage?<M, T>(message: M): Promise<T>;

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
 * BaseWalletAdapter is an interface.
 */
export interface BaseWalletAdapter {
  /**
   * Type of chain
   */
  chainType: ChainType;

  /* 
   * Adapter name
   */
  name: string;

  /**
   * Injected Provider is loaded when document object is ready.
   */
  injectedProvider: WalletProvider | any;

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
