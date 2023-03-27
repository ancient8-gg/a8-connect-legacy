import { encode } from "bs58";

import { BaseWalletAdapter, WalletProvider, ChainType } from "../interface";
import Icon from "../../../assets/icons/phantom.png";

export const PhantomSolanaWalletName = "PhantomSolanaWallet";

export class PhantomSolanaWallet implements BaseWalletAdapter {
  displayName = "Phantom";

  injectedProvider: WalletProvider;

  chainType = ChainType.SOL;

  name = PhantomSolanaWalletName;

  url = "phantom.app";

  downloadUrl = "https://phantom.app";

  adapterStyle = {
    icon: Icon,
    background:
      "linear-gradient(90deg, rgb(144, 88, 216) 0%, rgb(83, 75, 177) 100%)",
  };

  constructor(injectedProvider: WalletProvider) {
    this.injectedProvider = injectedProvider;
  }

  async connectWallet(): Promise<string | null> {
    try {
      const resp = await this.injectedProvider.connect<{
        publicKey: { toString: () => string };
      }>();

      return resp.publicKey.toString();
    } catch (err) {
      return null;
    }
  }

  disconnectWallet(): Promise<void> {
    // There is no function to trigger disconnect .
    // Need to wait for further changes as of now.
    // Check like Metamask wallet.
    // https://github.com/MetaMask/metamask-extension/issues/8990
    return;
  }

  async getWalletAddress(): Promise<string | null> {
    return this.connectWallet();
  }

  isConnected(): Promise<boolean> {
    return Promise.resolve(!!this.injectedProvider.isConnected);
  }

  isInstalled(): boolean {
    return !!this.injectedProvider && !!this.injectedProvider.isPhantom;
  }

  async sign(message: string): Promise<string> {
    const { signature } = await this.injectedProvider.signMessage<
      Uint8Array,
      { signature: Buffer }
    >(new TextEncoder().encode(message));

    return encode(signature);
  }
}
