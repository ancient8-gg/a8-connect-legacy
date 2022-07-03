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
  isWalletConnected: boolean;
}

const WalletContext = createContext<WalletContextProps>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { desiredChainType, setWalletReady } = useAppState();
  const { onConnected } = useAppState();

  const [chainType, setChainType] = useState<ChainType>(desiredChainType);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");
  const [isWalletConnected, setWalletConnected] = useState(false);

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
    } catch {}

    setWalletReady(true);
    return session;
  }, [onConnected, setWalletReady]);

  const handleWalletConnected = useCallback(
    (walletSession: ConnectedWalletPayload | null) => {
      if (walletSession) {
        setWalletConnected(!!walletSession);
      }

      onConnected(walletSession);
    },
    []
  );

  const getAdapters = useCallback(() => {
    return walletAction.getWalletAdapters(chainType);
  }, [chainType]);

  const getWalletAdapter = useCallback((walletName: string) => {
    return walletAction.getWalletAdapter(walletName);
  }, []);

  const connect = useCallback(async () => {
    try {
      await walletAction.connectWallet(walletName);

      // trigger on connected
      const walletSession = await initState();
      handleWalletConnected(walletSession);

      return walletSession.walletAddress;
    } catch {
      handleWalletConnected(null);
      return null;
    }
  }, [walletName, initState, handleWalletConnected]);

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
    initState().then((session) => handleWalletConnected(session));
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
        isWalletConnected,
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
