import {
  useState,
  useCallback,
  createContext,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { getWalletAction } from "../libs/actions";
import { BaseWalletAdapter, ChainType } from "../libs/adapters";
import { useAppState } from "./useAppState";
import { ConnectedWalletPayload } from "../libs/dto/a8-connect-session.dto";

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
  initState: () => Promise<ConnectedWalletPayload>;
}

const WalletContext = createContext<WalletContextProps>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { desiredChainType } = useAppState();
  const [chainType, setChainType] = useState<ChainType>(desiredChainType);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");
  const { onConnected } = useAppState();
  const { setWalletReady } = useAppState();

  const walletAction = getWalletAction();

  const initState = useCallback(async () => {
    setWalletReady(false);
    let session = null;

    try {
      await walletAction.restoreConnection();
      session = await walletAction.getConnectedSession();

      setChainType(session.chainType);
      setWalletAddress(session.walletAddress);
      setWalletName(session.walletName);

      onConnected(session);
    } catch {}

    setWalletReady(true);
    return session;
  }, [onConnected, setWalletReady]);

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
      const walletSession = await initState();
      onConnected(walletSession);

      return walletAddress;
    } catch {
      onConnected(null);
      return null;
    }
  }, [walletName, initState]);

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

  useEffect(() => {
    initState();
  }, []);

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
        initState,
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
