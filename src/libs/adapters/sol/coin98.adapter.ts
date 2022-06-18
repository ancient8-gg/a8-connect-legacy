import { BaseWalletAdapter, WalletProvider, ChainType } from "../interface";

export const Coin98SolanaWalletName = "Coin98SolanaWallet";

export class Coin98SolanaWallet implements BaseWalletAdapter {
  injectedProvider: WalletProvider;
  chainType = ChainType.SOL;
  name = Coin98SolanaWalletName;
  adapterStyle = {
    icon: '/assets/icons/coin98.png',
    background: 'linear-gradient(90deg, rgb(204 173 65) 0%, rgb(13, 13, 24) 100%)',
    title_name: 'Coin98',
    url: 'coin98.net',
  };

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
