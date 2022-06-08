import { BaseWalletAdapter, WalletProvider } from "../index";
import { hexlify } from "@ethersproject/bytes";
import { toUtf8Bytes } from "@ethersproject/strings";

export class MetamaskEVMAdapter implements BaseWalletAdapter {
  injectedProvider: WalletProvider;

  constructor(injectedProvider: WalletProvider) {
    this.injectedProvider = injectedProvider;
  }

  async connectWallet(): Promise<string | null> {
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

    return this.injectedProvider.request<string[], string>({
      method: "eth_sign",
      params: [walletAddress.toLowerCase(), hexlify(toUtf8Bytes(message))],
    });
  }
}
