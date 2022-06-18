export {};
// import { TorusWalletAdapter } from "@solana/wallet-adapter-torus";
// import bs from "bs58";
// import { BaseWalletAdapter, ChainType } from "../interface";
//
// export const TorusSolanaWalletName = "TorusSolanaWallet";
//
// export class TorusSolanaWallet implements BaseWalletAdapter {
//   name = TorusSolanaWalletName;
//   chainType: ChainType = ChainType.SOL;
//
//   adapterStyle = {
//     icon: "/assets/icons/torus.png",
//     background:
//       "linear-gradient(90deg, rgb(108, 100, 249) 0%, rgb(86, 74, 237) 100%)",
//     title_name: "Torus",
//     url: "https://toruswallet.io/",
//   };
//
//   injectedProvider: TorusWalletAdapter;
//
//   constructor() {
//     this.injectedProvider = new TorusWalletAdapter();
//   }
//
//   async connectWallet(): Promise<string | null> {
//     try {
//       await this.injectedProvider.connect();
//       return this.injectedProvider.publicKey.toString();
//     } catch {
//       return null;
//     }
//   }
//
//   disconnectWallet(): Promise<void> {
//     return this.injectedProvider.disconnect();
//   }
//
//   getWalletAddress(): Promise<string | null> {
//     return this.connectWallet();
//   }
//
//   async isConnected(): Promise<boolean> {
//     const wallet = await this.connectWallet();
//     return !!wallet;
//   }
//
//   isInstalled(): boolean {
//     return !!this.injectedProvider;
//   }
//
//   async sign(message: string): Promise<string> {
//     const signature = await this.injectedProvider.signMessage(
//       new TextEncoder().encode(message)
//     );
//     return bs.encode(signature);
//   }
// }
