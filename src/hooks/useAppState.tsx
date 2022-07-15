import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { OnAuthPayload } from "./useSession";
import { ConnectedWalletPayload } from "../libs/dto/a8-connect-session.dto";
import { ChainType } from "../libs/adapters";
import { AppFlow } from "../components/router";
import { NetworkType, RegistryProvider } from "../libs/providers";

interface AppStateContextProviderProps {
  onClose?: () => void;
  onError?: (error: Error) => void;
  onAuth?: (payload: OnAuthPayload) => void;
  onConnected?: (payload: ConnectedWalletPayload) => void;
  initAppFlow?: AppFlow;
  desiredChainType?: ChainType;
  networkType?: NetworkType;
  disableCloseButton?: boolean;
}

interface AppStateContextProvider {
  onClose: () => void;
  onError: (error: Error) => void;
  onAuth: (payload: OnAuthPayload) => void;
  onConnected: (payload: ConnectedWalletPayload) => void;
  setIsModalOpen(val: boolean): void;
  handleClose(): void;
  setRouterReady: (flag: boolean) => void;
  setSessionReady: (flag: boolean) => void;
  setWalletReady: (flag: boolean) => void;
  setCurrentAppFlow: (flow: AppFlow) => void;
  desiredChainType: ChainType;
  isModalOpen: boolean;
  isWalletReady: boolean;
  isRouterReady: boolean;
  isSessionReady: boolean;
  isAppReady: boolean;
  isUIDReady: boolean;
  disableCloseButton: boolean;
  currentAppFlow: AppFlow;
  networkType: NetworkType;
  initAppFlow: AppFlow;
  setupAppFlow: (isUserLoggedIn: boolean) => void;
}

const AppStateContext = createContext<AppStateContextProvider>(null);

export const AppStateProvider: FC<
  {
    children: ReactNode;
  } & AppStateContextProviderProps
> = (props) => {
  // Writable configurations
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isRouterReady, setRouterReady] = useState(false);
  const [isSessionReady, setSessionReady] = useState(false);
  const [isWalletReady, setWalletReady] = useState(false);
  const [currentAppFlow, setCurrentAppFlow] = useState(AppFlow.BUFFER_FLOW);

  // Read only configurations
  const [initAppFlow] = useState(props.initAppFlow);
  const [disableCloseButton] = useState(!!props.disableCloseButton || false);
  const [desiredChainType] = useState(props.desiredChainType || ChainType.ALL);
  const [networkType] = useState(props.networkType || NetworkType.mainnet);

  const isAppReady = useMemo(() => {
    return isRouterReady && isSessionReady && isWalletReady;
  }, [isRouterReady, isSessionReady, isWalletReady]);

  const isUIDReady = useMemo(() => {
    return isSessionReady && isWalletReady;
  }, [isSessionReady, isWalletReady]);

  const onAuth = useCallback(
    (payload: OnAuthPayload) => {
      // do something before emit events

      // now emit events
      props.onAuth && props.onAuth(payload);
    },
    [props.onAuth]
  );

  const onClose = useCallback(() => {
    // do something before emit events

    // Close modal
    setIsModalOpen(false);

    // now emit events
    props.onClose && props.onClose();
  }, [props.onClose]);

  const onConnected = useCallback(
    (payload: ConnectedWalletPayload) => {
      // do something before emit events

      // now emit events
      props.onConnected && props.onConnected(payload);
    },
    [props.onConnected]
  );

  const onError = useCallback(
    (error: Error) => {
      // do something before emit events

      // now emit events
      props.onError && props.onError(error);
    },
    [props.onError]
  );

  const setupAppFlow = useCallback(
    (isUserLoggedIn: boolean) => {
      if (!isUserLoggedIn) {
        setCurrentAppFlow(AppFlow.LOGIN_FLOW);
        return;
      }

      if (initAppFlow === AppFlow.LOST_WALLET_FLOW) {
        setCurrentAppFlow(initAppFlow);
        return;
      }

      if (initAppFlow === AppFlow.ADD_WALLET_FLOW) {
        setCurrentAppFlow(initAppFlow);
        return;
      }

      // fallback to default flow
      setCurrentAppFlow(AppFlow.CONNECT_FLOW);
      return;
    },
    [initAppFlow]
  );

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    onClose && onClose();
  }, [onClose]);

  useEffect(() => {
    const registry = RegistryProvider.getInstance();
    registry.networkType = networkType;
  }, [networkType]);

  return (
    <AppStateContext.Provider
      value={{
        isModalOpen,
        desiredChainType,
        isWalletReady,
        isSessionReady,
        isRouterReady,
        isAppReady,
        isUIDReady,
        currentAppFlow,
        networkType,
        disableCloseButton,
        onAuth,
        onError,
        onConnected,
        onClose,
        setIsModalOpen,
        handleClose,
        setRouterReady,
        setSessionReady,
        setWalletReady,
        setCurrentAppFlow,
        initAppFlow,
        setupAppFlow,
      }}
    >
      {props.children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("Must be in hook");
  }
  return context;
};
