import React from "react";
import { SignData } from "@/libs/entities/sign-data.entity";
import { AuthType } from "@/libs/entities/auth.entity";
import {
  AdapterName,
  EvmAdapterName,
  SolanaAdapterName,
} from "@/libs/entities/adapter-name.entity";

interface WalletType {
  authType: AuthType;
  adapterName: AdapterName;
}
interface AdapterContext {
  getWalletAddress: (walletType: WalletType) => Promise<string>;
  connect: (walletType: WalletType) => Promise<string>;
  sign: (walletType: WalletType) => Promise<SignData>;
  disconnectAll: () => Promise<void>;
  disconnect: (walletType: WalletType) => void;
  isInstalled: (walletType: WalletType) => boolean;
}

const AdapterContext = React.createContext<AdapterContext>({
  getWalletAddress: async () => "",
  connect: async () => "",
  disconnect: () => {},
  disconnectAll: async () => {},
  sign: async () => ({ walletAddress: "", signature: "" }),
  isInstalled: () => false,
});

export const AdapterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const getWalletAddress = async (walletType: WalletType) => {
    return "";
  };

  const connect = async (walletType: WalletType) => {
    return "";
  };

  const disconnect = async (walletType: WalletType) => {};

  const disconnectAll = async () => {};

  const sign = async (walletType: WalletType): Promise<SignData> => {
    return { walletAddress: "", signature: "" };
  };

  const isInstalled = () => {
    return false;
  };

  return (
    <AdapterContext.Provider
      value={{
        getWalletAddress,
        connect,
        disconnect,
        disconnectAll,
        sign,
        isInstalled,
      }}
    >
      {children}
    </AdapterContext.Provider>
  );
};

export const useAdapter = () => {
  const context = React.useContext(AdapterContext);
  if (context === undefined) {
    throw new Error("Must be in hook");
  }
  return context;
};
