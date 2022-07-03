import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { OnAuthPayload } from "./useSession";
import { ConnectedWalletPayload } from "../libs/dto/a8-connect-session.dto";
import { ChainType } from "../libs/adapters";
import { AppFlow } from "../components/router";

interface AppStateContextProviderProps {
  onClose?: () => void;
  onError?: (error: Error) => void;
  onAuth?: (payload: OnAuthPayload) => void;
  onConnected?: (payload: ConnectedWalletPayload) => void;
  desiredChainType?: ChainType;
}

interface AppStateContextProvider {
  onClose: () => void;
  onError: (error: Error) => void;
  onAuth: (payload: OnAuthPayload) => void;
  onConnected: (payload: ConnectedWalletPayload) => void;
  setIsModalOpen(val: boolean): void;
  handleClose(): void;
  isModalOpen: boolean;
  desiredChainType: ChainType;
  setRouterReady: (flag: boolean) => void;
  setSessionReady: (flag: boolean) => void;
  setWalletReady: (flag: boolean) => void;
  setCurrentAppFlow: (flow: AppFlow) => void;
  isWalletReady: boolean;
  isRouterReady: boolean;
  isSessionReady: boolean;
  isAppReady: boolean;
  isUIDReady: boolean;
  currentAppFlow: AppFlow;
}

const AppStateContext = createContext<AppStateContextProvider>(null);

export const AppStateProvider: FC<
  {
    children: ReactNode;
  } & AppStateContextProviderProps
> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [desiredChainType] = useState(props.desiredChainType || ChainType.ALL);
  const [isRouterReady, setRouterReady] = useState(false);
  const [isSessionReady, setSessionReady] = useState(false);
  const [isWalletReady, setWalletReady] = useState(false);
  const [currentAppFlow, setCurrentAppFlow] = useState(AppFlow.LOGIN_FLOW);

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

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    onClose && onClose();
  }, [onClose]);

  return (
    <AppStateContext.Provider
      value={{
        onAuth,
        onError,
        onConnected,
        onClose,
        setIsModalOpen,
        handleClose,
        isModalOpen,
        desiredChainType,
        setRouterReady,
        setSessionReady,
        setWalletReady,
        isWalletReady,
        isSessionReady,
        isRouterReady,
        isAppReady,
        isUIDReady,
        currentAppFlow,
        setCurrentAppFlow,
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
