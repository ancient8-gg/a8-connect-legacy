import {
  useState,
  useCallback,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { getWalletAction } from "../libs/actions";
import { BaseWalletAdapter, ChainType } from "../libs/adapters";
import { useAppState } from "./useAppState";

interface WalletContextProps {
  chainType: ChainType;
  walletName: string;
  walletAddress: string;
  getWalletAdapter(walletName: string): BaseWalletAdapter;
  getAdapters(): BaseWalletAdapter[];
  setChainType(chainType: ChainType): void;
  connect(): Promise<string | null>;
  sign(message: string): Promise<string>;
  setWalletName(walletName: string): void;
  disconnect(): void;
}

const WalletContext = createContext<WalletContextProps>(null);

export const WalletProvider = ({
  children,
  selectedChainType,
}: {
  children: ReactNode;
  selectedChainType: ChainType;
}) => {
  const [chainType, setChainType] = useState<ChainType>(selectedChainType);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");
  const { onConnected } = useAppState();

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
      const walletSession = await walletAction.getConnectedSession();
      onConnected(walletSession);

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
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("Must be in hook");
  }
  return context;
};
