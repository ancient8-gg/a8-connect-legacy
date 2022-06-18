import React, { useState, useCallback } from "react";
import { WalletAction } from "../libs/actions/";
import * as Adapters from "../libs/adapters";

interface WalletContextProps {
  chainType: Adapters.AdapterInterface.ChainType;
  adapters: Adapters.AdapterInterface.BaseWalletAdapter[],
  walletName: string;
  connect(): void;
  disconnect(): void;
  sign(message: string): void;
  setChainType(chainType: Adapters.AdapterInterface.ChainType): void;
  setWalletName(walletName: string): void;
}

const WalletContext = React.createContext<WalletContextProps>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [chainType, setChainType] = useState<Adapters.AdapterInterface.ChainType>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");

  const walletAction = new WalletAction();
  const adapters = walletAction.getWalletAdapters();

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
        adapters: adapters,
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
