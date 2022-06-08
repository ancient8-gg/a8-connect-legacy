import { BaseWalletAdapter, BinanceProvider } from "../";

export class BinanceEVMAdapter implements BaseWalletAdapter {
  injectedProvider: BinanceProvider;

  constructor(injectedProvider: BinanceProvider) {
    this.injectedProvider = injectedProvider;
  }

  async connectWallet(): Promise<string> {
    if (this.isInstalled()) return null;

    const [wallet] = await this.injectedProvider.request<undefined, string[]>({
      method: "eth_requestAccounts",
    });

    return wallet;
  }

  disconnectWallet(): Promise<void> {
    return this.injectedProvider.disconnect();
  }

  getWalletAddress(): Promise<string> {
    return this.connectWallet();
  }

  async isConnected(): Promise<boolean> {
    try {
      const [walletAddress] = await this.injectedProvider.request<
        undefined,
        string[]
      >({
        method: "eth_accounts",
      });

      return !!walletAddress;
    } catch {
      return false;
    }
  }

  isInstalled(): boolean {
    return !!this.injectedProvider && !this.injectedProvider.isCoin98;
  }

  async sign(message: string): Promise<string> {
    const walletAddress = await this.getWalletAddress();

    const { signature } = await this.injectedProvider.bnbSign<{
      signature: string;
    }>(walletAddress, message);

    return signature;
  }
}
