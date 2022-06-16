import React from "react";
import { ComponentMeta } from "@storybook/react";
import {TorusSolanaWallet} from "../libs/adapters/sol/torus.adapter";

export const A8Connect: React.FC = () => {
  const connectWallet = async () => {
    const provider = new TorusSolanaWallet();
    await provider.connectWallet();
    console.log({provider});
    console.log(await provider.sign("Hello World"));
    console.log(await provider.isConnected());
    console.log(provider.isInstalled());
    console.log(await provider.getWalletAddress());
  };
  return <button onClick={connectWallet}>Connect Wallet</button>;
}

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "A8Connect",
  component: A8Connect,
  id: "a8-connect",
} as ComponentMeta<typeof A8Connect>;

