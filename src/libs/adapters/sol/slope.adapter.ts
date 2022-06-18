import { BaseWalletAdapter, WalletProvider, ChainType } from "../interface";

export const SlopeSolanaWalletName = "SlopeSolanaWallet";

export class SlopeSolanaWallet implements BaseWalletAdapter {
  injectedProvider: WalletProvider;
  chainType = ChainType.SOL;
  name = SlopeSolanaWalletName;
  adapterStyle = {
    icon: "/assets/icons/slope.png",
    background:
      "linear-gradient(90deg, rgb(108, 100, 249) 0%, rgb(86, 74, 237) 100%)",
    title_name: "Slope",
    url: "https://slope.finance",
  };

  constructor(injectedProvider: WalletProvider) {
    this.injectedProvider = injectedProvider;
  }

  async connectWallet(): Promise<string | null> {
    try {
      const {
        data: { publicKey },
      } = await this.injectedProvider.connect<{
        msg: string;
        data: { publicKey?: string };
      }>();

      return publicKey || null;
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
    const wallet = await this.connectWallet();
    return !!wallet;
  }

  isInstalled(): boolean {
    return !!this.injectedProvider;
  }

  async sign(message: string): Promise<string> {
    const {
      data: { signature },
    } = await this.injectedProvider.signMessage<
      Uint8Array,
      {
        data: { signature: string };
      }
    >(new TextEncoder().encode(message));

    return signature;
  }
}
