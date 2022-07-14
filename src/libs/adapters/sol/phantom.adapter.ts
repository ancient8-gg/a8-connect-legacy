import { BaseWalletAdapter, WalletProvider, ChainType } from "../interface";
import Icon from "../../../assets/icons/phantom.png";

export const PhantomSolanaWalletName = "PhantomSolanaWallet";

export class PhantomSolanaWallet implements BaseWalletAdapter {
  displayName = "Phantom";

  injectedProvider: WalletProvider;

  chainType = ChainType.SOL;

  name = PhantomSolanaWalletName;

  url = "phantom.app";

  downloadUrl = "https://phantom.app";

  adapterStyle = {
    icon: Icon,
    background:
      "linear-gradient(90deg, rgb(144, 88, 216) 0%, rgb(83, 75, 177) 100%)",
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
    const { signature } = await this.injectedProvider.request<
      { message: Uint8Array; display: string },
      { signature: string }
    >({
      method: "signMessage",
      params: {
        display: "utf-8",
        message: new TextEncoder().encode(message),
      },
    });

    return signature;
  }
}
