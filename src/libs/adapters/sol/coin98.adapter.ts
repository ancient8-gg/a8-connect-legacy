import { BaseWalletAdapter, WalletProvider, ChainType } from "../interface";
import Icon from "../../../assets/icons/coin98.png";

export const Coin98SolanaWalletName = "Coin98SolanaWallet";

export class Coin98SolanaWallet implements BaseWalletAdapter {
  displayName = "Coin98";

  injectedProvider: WalletProvider;

  chainType = ChainType.SOL;

  name = Coin98SolanaWalletName;

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

      [wallet] = await this.injectedProvider.connect<string[]>();
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
    return new Promise(async (resolve, reject) => {
      let signature: string = null;

      setTimeout(() => {
        if (!signature) {
          return reject(
            new Error(`Timeout when connect to ${this.name} wallet`)
          );
        }
      }, 10000);

      const { signature: response } = await this.injectedProvider.request<
        Uint8Array[],
        { signature: string }
      >({
        method: "sol_signMessage",
        params: [new TextEncoder().encode(message)],
      });

      signature = response;

      return resolve(signature);
    });
  }
}
