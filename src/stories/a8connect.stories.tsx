import React from "react";
import { ComponentMeta } from "@storybook/react";
import {Coin98EVMAdapter} from "../libs/adapters";

export const A8Connect: React.FC = () => {
  const connectWallet = async () => {
    const provider = new Coin98EVMAdapter((window as any).coin98.provider);
    (window as any).provider = provider;
    await provider.connectWallet();
    console.log(await provider.sign("Hello World"));
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

