import { hexlify } from "@ethersproject/bytes";
import { toUtf8Bytes } from "@ethersproject/strings";
import {
  BaseWalletAdapter,
  WalletProvider,
  ChainType,
} from "../interface";

export const BinanceEVMWalletName = "BinanceEVMWallet";
export class BinanceEVMAdapter implements BaseWalletAdapter {
  chainType: ChainType.EVM;
  name = BinanceEVMWalletName;
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
    return this.injectedProvider.disconnect();
  }

  getWalletAddress(): Promise<string | null> {
    return this.connectWallet();
  }

  async isConnected(): Promise<boolean> {
    return this.injectedProvider.isConnected();
  }

  isInstalled(): boolean {
    return !!this.injectedProvider && !this.injectedProvider.isCoin98;
  }

  async sign(message: string): Promise<string> {
    const walletAddress = await this.getWalletAddress();

    return this.injectedProvider.request<string[], string>({
      method: "personal_sign",
      params: [hexlify(toUtf8Bytes(message)), walletAddress.toLowerCase()],
    });
  }
}
