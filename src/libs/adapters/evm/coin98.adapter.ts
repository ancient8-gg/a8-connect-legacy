import { hexlify } from "@ethersproject/bytes";
import { toUtf8Bytes } from "@ethersproject/strings";
import { BaseWalletAdapter, WalletProvider, ChainType } from "../interface";
import Icon from "../../../assets/icons/coin98.png";

export const Coin98EVMWalletName = "Coin98EVMWallet";
export class Coin98EVMWallet implements BaseWalletAdapter {
  displayName = "Coin98";

  injectedProvider: WalletProvider;

  chainType = ChainType.EVM;

  name = Coin98EVMWalletName;

  url = "wallet.coin98.com";

  downloadUrl = "https://wallet.coin98.com";

  adapterStyle = {
    icon: Icon,
    background:
      "linear-gradient(90deg, rgb(204 173 65) 0%, rgb(13, 13, 24) 100%)",
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
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(this.injectedProvider.isConnected());
      }, 100);
    });
  }

  isInstalled(): boolean {
    return !!this.injectedProvider && !!this.injectedProvider.isCoin98;
  }

  async sign(message: string): Promise<string> {
    const walletAddress = await this.getWalletAddress();

    return this.injectedProvider.request<string[], string>({
      method: "personal_sign",
      params: [hexlify(toUtf8Bytes(message)), walletAddress.toLowerCase()],
    });
  }
}
