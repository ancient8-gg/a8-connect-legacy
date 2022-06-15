import { BaseWalletAdapter, WalletProvider } from "../interface";

export const PhantomSolanaWalletName = "PhantomSolanaWallet";

export class PhantomSolanaWallet implements BaseWalletAdapter {
  name = PhantomSolanaWalletName;
  injectedProvider: WalletProvider;

  constructor(injectedProvider: WalletProvider) {
    this.injectedProvider = injectedProvider;
  }

  async connectWallet(): Promise<string | null> {
    try {
      const resp = await this.injectedProvider.connect<{
        publicKey: { toString: () => string };
      }>();

      return resp.publicKey.toString();
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

  isConnected(): Promise<boolean> {
    return Promise.resolve(!!this.injectedProvider.isConnected);
  }

  isInstalled(): boolean {
    return !!this.injectedProvider && !!this.injectedProvider.isPhantom;
  }

  async sign(message: string): Promise<string> {
    let { signature } = await this.injectedProvider.request<
      { message: Uint8Array; display: string },
      { signature: string }
    >({
      method: "signMessage",
      params: {
        display: "utf-8",
        message: new TextEncoder().encode(message),
      },
    });

    if (signature.length > 64) {
      signature = signature.slice(0, 64);
    }

    return signature;
  }
}
