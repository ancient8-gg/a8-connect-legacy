import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { OnAuthPayload } from "./useSession";
import { ConnectedWalletPayload } from "../libs/dto/a8-connect-session.dto";

interface AppStateContextProviderProps {
  onClose?: () => void;
  onError?: (error: Error) => void;
  onAuth?: (payload: OnAuthPayload) => void;
  onConnected?: (payload: ConnectedWalletPayload) => void;
}

interface AppStateContextProvider {
  onClose: () => void;
  onError: (error: Error) => void;
  onAuth: (payload: OnAuthPayload) => void;
  onConnected: (payload: ConnectedWalletPayload) => void;
  setReady: (val: boolean) => void;
  setIsModalOpen(val: boolean): void;
  handleClose(): void;
  setIsBack(val: boolean): void;
  isBack: boolean;
  isReady: boolean;
  isModalOpen: boolean;
}

const AppStateContext = createContext<AppStateContextProvider>(null);

export const AppStateProvider: FC<
  {
    children: ReactNode;
  } & AppStateContextProviderProps
> = (props) => {
  const [isReady, setReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isBack, setIsBack] = useState(true);

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
        setReady,
        setIsModalOpen,
        handleClose,
        setIsBack,
        isReady,
        isModalOpen,
        isBack,
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
