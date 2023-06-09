import { hexlify } from "@ethersproject/bytes";
import { toUtf8Bytes } from "@ethersproject/strings";
import { BaseWalletAdapter, ChainType, WalletProvider } from "../interface";
import Icon from "../../../assets/icons/binance.png";

export const BinanceEVMWalletName = "BinanceEVMWallet";

export class BinanceEVMWallet implements BaseWalletAdapter {
  displayName = "Binance";

  injectedProvider: WalletProvider;

  chainType = ChainType.EVM;

  name = BinanceEVMWalletName;

  url = "binance.org";

  downloadUrl = "https://www.bnbchain.org/en/binance-wallet";

  adapterStyle = {
    icon: Icon,
    background:
      "linear-gradient(90deg, rgb(218 192 66) 0%, rgb(234 126 0) 100%)",
  };

  constructor(injectedProvider: WalletProvider) {
    this.injectedProvider = injectedProvider;
  }

  async connectWallet(): Promise<string | null> {
    const [wallet] = await this.injectedProvider.request<undefined, string[]>({
      method: "eth_requestAccounts",
    });

    return wallet || null;
  }

  disconnectWallet(): Promise<void> {
    return this.injectedProvider.disconnect();
  }

  async getWalletAddress(): Promise<string | null> {
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

    return await this.injectedProvider.request<string[], string>({
      method: "personal_sign",
      params: [hexlify(toUtf8Bytes(message)), walletAddress.toLowerCase()],
    });
  }
}
