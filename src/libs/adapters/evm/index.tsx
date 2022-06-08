import React from "react";
import {
  EvmAdapterName as AdapterName,
  EvmAdapters,
  AdapterContext,
} from "@/libs/dto/entities";
import { useBinanceWallet } from "./binance.adapter";
import { useCoin98Wallet } from "./coin98.adapter";
import { useCoinbaseWallet } from "./coinbase.adapter";
import { useMetamaskWallet } from './metamask.adapter';


export const EvmContext = React.createContext<AdapterContext<AdapterName>>({
  sign: async () => ({ walletAddress: '', signature: '' }),
  connect: async () => "",
  disconnect: async () => { },
  isInstalled: () => false,
  getWalletAddress: async () => "",
  disconnectAll: async () => { },
});
// Provider
export const EvmProvider = ({ children }: any) => {
  const metamaskContext = useMetamaskWallet();
  const coin98Context = useCoin98Wallet();
  const binanceChainContext = useBinanceWallet();
  const coinbaseContext = useCoinbaseWallet();

  const adapters: EvmAdapters = {
    [AdapterName.coin98]: coin98Context,
    [AdapterName.metamask]: metamaskContext,
    [AdapterName.binanceChain]: binanceChainContext,
    [AdapterName.coinbase]: coinbaseContext,
  };

  const sign = async (name: AdapterName, message: string) => {
    const data = await adapters[name].sign(message);
    return data;
  };

  const connect = async (name: AdapterName) => {
    await adapters[name].connect();
  };

  const disconnect = async (name: AdapterName) => {
    await adapters[name].disconnect();
  };

  const disconnectAll = async () => {
    Promise.all(
      Object.values(AdapterName).map(
        async (name: AdapterName) => await adapters[name].disconnect()
      )
    );
  };

  const isInstalled = (name: AdapterName) => {
    if (name === AdapterName.binanceChain) {
      console.log(
        "get binance chian installed",
        adapters[AdapterName.binanceChain].isInstalled()
      );
    }
    let result = adapters[name].isInstalled();
    return result;
  };

  const getWalletAddress = async (name: AdapterName) => {
    let result = await adapters[name].getWalletAddress();
    return result;
  };

  return (
    <EvmContext.Provider
      value={{
        sign,
        connect,
        disconnect,
        isInstalled,
        getWalletAddress,
        disconnectAll,
      }
      }
    >
      {children}
    </EvmContext.Provider>
  );
};

export const useEvm = () => {
  const context = React.useContext(EvmContext);
  if (context === undefined) {
    throw new Error("useMetamask must used in MetaMask provider component");
  }

  return context;
};
