import React, { useState, useCallback } from "react";
import { getWalletAction } from "../libs/actions";
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

export interface OnConnectPayload {
  walletAddress: string;
  provider: Adapters.AdapterInterface.BaseWalletAdapter;
  chainType: Adapters.AdapterInterface.ChainType;
  walletName: string;
}

const WalletContext = React.createContext<WalletContextProps>(null);

export const WalletProvider = ({
  children,
  onConnected,
}: {
  children: React.ReactNode;
  onConnected: (payload: OnConnectPayload | null) => void;
}) => {
  const [chainType, setChainType] = useState<
    Adapters.AdapterInterface.ChainType | "all"
  >("all");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");

  const walletAction = getWalletAction();

  const getAdapters = useCallback(() => {
    return walletAction.getWalletAdapters(chainType);
  }, [chainType]);

  const getWalletAdapter = useCallback((walletName: string) => {
    return walletAction.getWalletAdapter(walletName);
  }, []);

  const connect = useCallback(async () => {
    try {
      await walletAction.connectWallet(walletName);
      const walletAddress = await walletAction.getWalletAddress();
      setWalletAddress(walletAddress);

      // trigger on connected
      onConnected({
        chainType: walletAction.selectedAdapter.chainType,
        walletName: walletAction.selectedAdapter.name,
        provider: walletAction.selectedAdapter,
        walletAddress,
      });

      return walletAddress;
    } catch {
      onConnected(null);

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
