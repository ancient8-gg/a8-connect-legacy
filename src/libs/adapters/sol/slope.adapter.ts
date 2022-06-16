import {
  BaseWalletAdapter,
  WalletProvider,
  ChainType,
} from "../interface";

export const SlopeSolanaWalletName = "SlopeSolanaWallet";

export class SlopeSolanaWallet implements BaseWalletAdapter {
  chainType: ChainType.SOL;
  name = SlopeSolanaWalletName;
  injectedProvider: WalletProvider;

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
