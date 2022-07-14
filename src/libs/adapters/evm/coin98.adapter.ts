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
    return new Promise(async (resolve, reject) => {
      let wallet: string = null;

      setTimeout(() => {
        if (!wallet) {
          return reject(
            new Error(`Timeout when connect to ${this.name} wallet`)
          );
        }
      }, 10000);

      [wallet] = await this.injectedProvider.request<undefined, string[]>({
        method: "eth_requestAccounts",
      });

      return resolve(wallet || null);
    });
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
