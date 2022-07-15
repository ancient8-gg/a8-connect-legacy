import { hexlify } from "@ethersproject/bytes";
import { toUtf8Bytes } from "@ethersproject/strings";
import { BaseWalletAdapter, WalletProvider, ChainType } from "../interface";
import Icon from "../../../assets/icons/coinbase.png";

export const CoinbaseEVMWalletName = "CoinbaseEVMWallet";
export class CoinbaseEVMWallet implements BaseWalletAdapter {
  displayName = "Coinbase";

  injectedProvider: WalletProvider;

  chainType = ChainType.EVM;

  name = CoinbaseEVMWalletName;

  url = "coinbase.com";

  downloadUrl = "https://www.coinbase.com/wallet";

  adapterStyle = {
    icon: Icon,
    background:
      "linear-gradient(90deg, rgb(37 137 255) 0%, rgb(29 30 71) 100%)",
  };

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

  async getWalletAddress(): Promise<string | null> {
    return this.connectWallet();
  }

  async isConnected(): Promise<boolean> {
    return this.injectedProvider.isConnected();
  }

  isInstalled(): boolean {
    return (
      !!this.injectedProvider &&
      (this.injectedProvider.isCoinbaseWallet ||
        this.injectedProvider.isCoinbaseBrowser)
    );
  }

  async sign(message: string): Promise<string> {
    const walletAddress = await this.getWalletAddress();

    return this.injectedProvider.request<string[], string>({
      method: "personal_sign",
      params: [hexlify(toUtf8Bytes(message)), walletAddress.toLowerCase()],
    });
  }
}
