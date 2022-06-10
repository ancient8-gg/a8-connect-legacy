import { TorusWalletAdapter } from "@solana/wallet-adapter-torus";
import bs from "bs58";
import { BaseWalletAdapter, WalletProvider } from "../interface";

export class TorusSolanaAdapter implements BaseWalletAdapter {
  injectedProvider: WalletProvider;
  walletProvider: TorusWalletAdapter;

  constructor() {
    this.walletProvider = new TorusWalletAdapter();
  }

  async connectWallet(): Promise<string | null> {
    try {
      await this.walletProvider.connect();
      return this.walletProvider.publicKey.toString();
    } catch {
      return null;
    }
  }

  disconnectWallet(): Promise<void> {
    return this.walletProvider.disconnect();
  }

  getWalletAddress(): Promise<string | null> {
    return this.connectWallet();
  }

  async isConnected(): Promise<boolean> {
    const wallet = await this.connectWallet();
    return !!wallet;
  }

  isInstalled(): boolean {
    return !!this.walletProvider;
  }

  async sign(message: string): Promise<string> {
    const signature = await this.walletProvider.signMessage(
      new TextEncoder().encode(message)
    );
    return bs.encode(signature);
  }
}
