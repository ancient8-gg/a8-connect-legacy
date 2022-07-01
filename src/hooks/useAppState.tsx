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

interface AppStateContextProviderProps {
  onClose?: () => void;
  onError?: (error: Error) => void;
  onAuth?: (payload: OnAuthPayload) => void;
  onConnected?: (payload: ConnectedWalletPayload) => void;
  defaultChainType?: ChainType;
}

interface AppStateContextProvider {
  onClose: () => void;
  onError: (error: Error) => void;
  onAuth: (payload: OnAuthPayload) => void;
  onConnected: (payload: ConnectedWalletPayload) => void;
  setIsModalOpen(val: boolean): void;
  handleClose(): void;
  isModalOpen: boolean;
  defaultChainType: ChainType;
  isRouterReady: boolean;
  setRouterReady: (flag: boolean) => void;
  isSessionReady: boolean;
  setSessionReady: (flag: boolean) => void;
  isAppReady: boolean;
}

const AppStateContext = createContext<AppStateContextProvider>(null);

export const AppStateProvider: FC<
  {
    children: ReactNode;
  } & AppStateContextProviderProps
> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [defaultChainType] = useState(props.defaultChainType || ChainType.ALL);
  const [isRouterReady, setRouterReady] = useState(false);
  const [isSessionReady, setSessionReady] = useState(false);

  const isAppReady = useMemo(() => {
    return isRouterReady && isSessionReady;
  }, [isRouterReady, isSessionReady]);

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
        defaultChainType,
        setRouterReady,
        setSessionReady,
        isSessionReady,
        isRouterReady,
        isAppReady,
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
