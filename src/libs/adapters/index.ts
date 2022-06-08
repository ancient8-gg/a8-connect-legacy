export interface RPCRequestPayload<P> {
  method: string;
  params?: P;
}

export interface WalletProvider {
  request<P, T>(payload: RPCRequestPayload<P>): Promise<T>;
  isCoin98?: boolean;
  isMetaMask?: boolean;
  isPhantom?: boolean;
  disconnect(): Promise<void>;
}

export interface BinanceProvider extends WalletProvider {
  bnbSign<T>(walletAddress: string, message: string): Promise<T>;
}

export interface BaseWalletAdapter {
  injectedProvider: WalletProvider | BinanceProvider;
  sign(message: string): Promise<string>;
  connectWallet(): Promise<string>;
  isInstalled(): boolean;
  isConnected(): Promise<boolean>;
  disconnectWallet(): Promise<void>;
  getWalletAddress(): Promise<string>;
}
