import React from "react";
import "./index.css";
import { PhantomSolanaAdapter } from "./libs/adapters/sol/phantom.adapter";
const A8Connect: React.FC = () => {
  const connectWallet = async () => {
    const provider = new PhantomSolanaAdapter((window as any).solana);
    await provider.connectWallet();
    console.log({ provider });
    console.log(await provider.sign("Hello World"));
    console.log(await provider.isConnected());
    console.log(provider.isInstalled());
    console.log(await provider.getWalletAddress());
  };
  return <button onClick={connectWallet}>Connect Wallet</button>;
};
function App() {
  return <A8Connect />;
}

export default App;
