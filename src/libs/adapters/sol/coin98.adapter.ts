import { BaseWalletAdapter, WalletProvider } from "../interface";

export class Coin98SolanaAdapter implements BaseWalletAdapter {
  injectedProvider: WalletProvider;

  constructor(injectedProvider: WalletProvider) {
    this.injectedProvider = injectedProvider;
  }

  async connectWallet(): Promise<string | null> {
    try {
      const [wallet] = await this.injectedProvider.request<undefined, string[]>(
        { method: "sol_requestAccounts" }
      );
      return wallet;
    } catch {
      return null;
    }
  }

  disconnectWallet(): Promise<void> {
    return this.injectedProvider.disconnect();
  }

  getWalletAddress(): Promise<string | null> {
    return this.connectWallet();
  }

  async isConnected(): Promise<boolean> {
    return this.injectedProvider.isConnected();
  }

  isInstalled(): boolean {
    return !!this.injectedProvider && !!this.injectedProvider.isCoin98;
  }

  async sign(message: string): Promise<string> {
    let { signature } = await this.injectedProvider.request<
      Uint8Array[],
      { signature: string }
    >({
      method: "sol_signMessage",
      params: [new TextEncoder().encode(message)],
    });

    if (signature.length > 64) {
      signature = signature.slice(0, 64);
    }

    return signature;
  }
}
