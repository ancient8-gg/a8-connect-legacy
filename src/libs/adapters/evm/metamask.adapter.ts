import { hexlify } from "@ethersproject/bytes";
import { toUtf8Bytes } from "@ethersproject/strings";
import { BaseWalletAdapter, WalletProvider, ChainType } from "../interface";

export const MetamaskEVMWalletName = "MetamaskEVMWallet";
export class MetamaskEVMWallet implements BaseWalletAdapter {
  injectedProvider: WalletProvider;
  chainType = ChainType.EVM;
  name = MetamaskEVMWalletName;
  adapterStyle = {
    icon: "/assets/icons/metamask.png",
    background: "linear-gradient(90deg, rgb(232 128 7) 0%, rgb(148 82 5) 100%)",
    title_name: "Metamask",
    url: "https://metamask.io",
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
    // There is no function to trigger disconnect metamask yet.
    // Need to wait for further changes as of now.
    // https://github.com/MetaMask/metamask-extension/issues/8990
    return;
  }

  getWalletAddress(): Promise<string | null> {
    return this.connectWallet();
  }

  async isConnected(): Promise<boolean> {
    return this.injectedProvider.isConnected();
  }

  isInstalled(): boolean {
    return (
      !!this.injectedProvider &&
      !!this.injectedProvider.isMetaMask &&
      !this.injectedProvider.isCoin98
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
