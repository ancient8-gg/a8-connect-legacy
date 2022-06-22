import { BaseWalletAdapter, WalletProvider, ChainType } from "../interface";

export const PhantomSolanaWalletName = "PhantomSolanaWallet";

export class PhantomSolanaWallet implements BaseWalletAdapter {
  injectedProvider: WalletProvider;
  chainType = ChainType.SOL;
  name = PhantomSolanaWalletName;
  adapterStyle = {
    icon: "/assets/icons/phantom.png",
    background:
      "linear-gradient(90deg, rgb(144, 88, 216) 0%, rgb(83, 75, 177) 100%)",
    title_name: "Phantom",
    url: "https://phantom.app",
  };

  constructor(injectedProvider: WalletProvider) {
    this.injectedProvider = injectedProvider;
  }

  async connectWallet(): Promise<string | null> {
    try {
      const resp = await this.injectedProvider.connect<{
        publicKey: { toString: () => string };
      }>();

      return resp.publicKey.toString();
    } catch (err) {
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
