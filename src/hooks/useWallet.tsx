import React, { useState, useCallback, useMemo } from "react";
import { WalletAction } from "../libs/actions";
import * as Adapters from "../libs/adapters";

interface WalletContextProps {
  chainType: Adapters.AdapterInterface.ChainType | "all";
  walletName: string;
  walletAddress: string;
  getWalletAdapter(
    walletName: string
  ): Adapters.AdapterInterface.BaseWalletAdapter;
  getAdapters(): Adapters.AdapterInterface.BaseWalletAdapter[];
  setChainType(chainType: Adapters.AdapterInterface.ChainType): void;
  connect(): Promise<string | null>;
  sign(message: string): Promise<string>;
  setWalletName(walletName: string): void;
  disconnect(): void;
}

const WalletContext = React.createContext<WalletContextProps>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [chainType, setChainType] = useState<
    Adapters.AdapterInterface.ChainType | "all"
  >("all");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");

  const walletAction = useMemo(() => new WalletAction(), []);

  const getAdapters = useCallback(() => {
    return walletAction.getWalletAdapters(chainType);
  }, [chainType]);

  const getWalletAdapter = useCallback((walletName: string) => {
    return walletAction.getWalletAdapter(walletName);
  }, []);

  const connect = useCallback(async () => {
    try {
      if (!walletName) {
        throw new Error();
      }
      await walletAction.connectWallet(walletName);
      const walletAddress = await walletAction.getWalletAddress();
      setWalletAddress(walletAddress);
      return walletAddress;
    } catch {
      return null;
    }
  }, [walletName]);

  const disconnect = () => {
    return walletAction.disconnectWallet();
  };

  const sign = useCallback(
    async (message: string) => {
      const { signature } = await walletAction.signMessage(message);
      return signature;
    },
    [walletName, walletAddress]
  );

  return (
    <WalletContext.Provider
      value={{
        chainType,
        walletName,
        walletAddress,
        getAdapters,
        getWalletAdapter,
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
