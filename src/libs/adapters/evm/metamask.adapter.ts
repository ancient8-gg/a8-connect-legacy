import { hexlify } from "@ethersproject/bytes";
import { toUtf8Bytes } from "@ethersproject/strings";
import { BaseWalletAdapter, WalletProvider } from "../interface";

export class MetamaskEVMAdapter implements BaseWalletAdapter {
  injectedProvider: WalletProvider;

  constructor(injectedProvider: WalletProvider) {
    this.injectedProvider = injectedProvider;
  }

  async connectWallet(): Promise<string | null> {
    if (!this.isInstalled()) return null;

    const [wallet] = await this.injectedProvider.request<undefined, string[]>({
      method: "eth_requestAccounts",
    });

    return wallet;
  }

  disconnectWallet(): Promise<void> {
    // There is no function to trigger disconnect metamask yet.
    // Need to wait for further changes as of now.
    // https://github.com/MetaMask/metamask-extension/issues/8990
    return;
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
    return (
      !!this.injectedProvider &&
      !!this.injectedProvider.isMetaMask &&
      !this.injectedProvider.isCoin98
    );
  }

  async sign(message: string): Promise<string> {
    const walletAddress = await this.getWalletAddress();

    return this.injectedProvider.request<string[], string>({
      method: "eth_sign",
      params: [walletAddress.toLowerCase(), hexlify(toUtf8Bytes(message))],
    });
  }
}
