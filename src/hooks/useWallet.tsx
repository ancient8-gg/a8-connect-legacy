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
import { ConnectedWalletPayload } from "../libs/dto/a8-connect-session.dto";
import { getUtilsProvider } from "../libs/providers";

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
  handleWalletConnected: () => Promise<void>;
}

const WalletContext = createContext<WalletContextProps>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { desiredChainType, setWalletReady } = useAppState();
  const { onConnected, onDisconnected } = useAppState();

  const [chainType, setChainType] = useState<ChainType>(desiredChainType);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");

  const walletAction = getWalletAction();

  const initState = useCallback(async () => {
    setWalletReady(false);
    let session = null;

    try {
      /**
       * Wrap timeout for restoring connection
       */
      await getUtilsProvider().withTimeout<string>(
        walletAction.restoreConnection.bind(walletAction),
        10000
      );

      /**
       * Await session
       */
      session = await walletAction.getConnectedSession();

      /**
       * Only persist truthy state
       */
      if (session.walletAddress) {
        setChainType(session.chainType);
        setWalletAddress(session.walletAddress);
        setWalletName(session.walletName);
      }
    } catch (e) {}

    setWalletReady(true);
    return session;
  }, [onConnected, setWalletReady]);

  const handleWalletConnected = useCallback(async () => {
    const session = await walletAction.getConnectedSession();
    onConnected(session);
  }, []);

  const getAdapters = useCallback(() => {
    return walletAction.getWalletAdapters(chainType);
  }, [chainType]);

  const getWalletAdapter = useCallback((walletName: string) => {
    return walletAction.getWalletAdapter(walletName);
  }, []);

  const connect = useCallback(async () => {
    await walletAction.connectWallet(walletName);

    // trigger on connected
    const walletSession = await initState();

    // return wallet address
    return walletSession?.walletAddress;
  }, [walletName, initState]);

  /**
   * NOTES: This function can only be used once, for eg: binding to a button click/or call at the end of an onboarding flow.
   * DO NOT CALL within a service as the `onDisconnected` hook will be very annoying to user.
   */
  const disconnect = useCallback(async () => {
    await walletAction.disconnectWallet();
    onDisconnected();
  }, [onDisconnected]);

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
        initState,
        handleWalletConnected,
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
