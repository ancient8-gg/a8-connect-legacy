import { createContext, FC, ReactNode, useCallback, useContext } from "react";

interface AppStateContextProviderProps {
  onClose?: () => void;
  onAuth?: () => void;
  onConnected?: () => void;
  onError?: () => void;
}

interface AppStateContextProvider {
  onClose: () => void;
  onAuth: () => void;
  onConnected: () => void;
  onError: () => void;
}

const AppStateContext = createContext<AppStateContextProvider>(null);

export const AppStateProvider: FC<
  {
    children: ReactNode;
  } & AppStateContextProviderProps
> = (props) => {
  const onAuth = useCallback(() => {
    // do something before emit events

    // now emit events
    props.onAuth && props.onAuth();
  }, [props.onAuth]);

  const onClose = useCallback(() => {
    // do something before emit events

    // now emit events
    props.onClose && props.onClose();
  }, [props.onClose]);

  const onConnected = useCallback(() => {
    // do something before emit events

    // now emit events
    props.onConnected && props.onConnected();
  }, [props.onConnected]);

  const onError = useCallback(() => {
    // do something before emit events

    // now emit events
    props.onError && props.onError();
  }, [props.onError]);

  return (
    <AppStateContext.Provider
      value={{
        onAuth,
        onError,
        onConnected,
        onClose,
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
