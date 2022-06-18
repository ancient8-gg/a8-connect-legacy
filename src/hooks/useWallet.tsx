import React, { useState, useCallback } from "react";
import { WalletAction } from "../libs/actions";
import * as Adapters from "../libs/adapters";

interface WalletContextProps {
  chainType: Adapters.AdapterInterface.ChainType | "all";
  walletName: string;
  getAdapters: () => Adapters.AdapterInterface.BaseWalletAdapter[];
  connect(): void;
  disconnect(): void;
  sign(message: string): void;
  setChainType(chainType: Adapters.AdapterInterface.ChainType): void;
  setWalletName(walletName: string): void;
}

const WalletContext = React.createContext<WalletContextProps>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [chainType, setChainType] = useState<
    Adapters.AdapterInterface.ChainType | "all"
  >("all");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");

  const walletAction = new WalletAction();

  const getAdapters = useCallback(() => {
    return walletAction.getWalletAdapters(chainType);
  }, [chainType]);

  const connect = useCallback(async () => {
    await walletAction.connectWallet(walletName);
    setWalletAddress(await walletAction.getWalletAddress());
  }, [walletName]);

  const disconnect = () => {
    return walletAction.disconnectWallet();
  };

  const sign = useCallback(
    (message: string) => {
      return walletAction.signMessage(message);
    },
    [walletAddress]
  );

  return (
    <WalletContext.Provider
      value={{
        chainType,
        walletName,
        getAdapters,
        connect,
        disconnect,
        sign,
        setChainType,
        setWalletName,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = React.useContext(WalletContext);
  if (context === undefined) {
    throw new Error("Must be in hook");
  }
  return context;
};
