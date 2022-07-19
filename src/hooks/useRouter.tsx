import {
  FC,
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AppFlow,
  LocationContext,
  NOT_FOUND_CONTEXT_SCREEN,
  ProviderProps,
  RouterContext,
  ScreenType,
  useRouter,
  LocationPushPayload,
} from "../components/router";
import { ToastProvider } from "./useToast";
import { SCREENS } from "../components/router/init";
import { useAppState } from "./useAppState";
import Modal from "../components/modal";
import { BUFFER_LOADING_APP_SCREEN_KEY } from "../screens/buffer-loading.screen";

export const RouterProvider: FC<ProviderProps> = () => {
  const { isModalOpen, setRouterReady, currentAppFlow } = useAppState();

  /**
   * @description Initialize screens depend on what sdk type it is
   */
  const [screens, setScreens] = useState<ScreenType[]>([]);

  /**
   * @description Always start from first screen in initial
   */
  const [screenPipe, setPipe] = useState<ScreenType[]>([]);

  /**
   * @description Screen params
   */
  const [params, setParams] = useState<unknown>();

  const CurrentScreen = useMemo<FunctionComponent>(() => {
    if (!screenPipe.length) {
      return null;
    }
    return screenPipe[screenPipe.length - 1].children;
  }, [screenPipe, screenPipe.length]);

  const initState = useCallback((appFlow: AppFlow) => {
    setRouterReady(false);

    const screens = [...SCREENS[appFlow]];

    setScreens(screens);

    setPipe([screens[0]]);

    if (appFlow !== AppFlow.BUFFER_FLOW) {
      setRouterReady(true);
    }
  }, []);

  const layout = useMemo(() => {
    return (
      <LocationProvider>
        <Modal modalIsOpen={isModalOpen}>
          {CurrentScreen && <CurrentScreen />}
        </Modal>
      </LocationProvider>
    );
  }, [screenPipe, CurrentScreen]);

  useEffect(() => {
    initState(currentAppFlow);
  }, []);

  return (
    <RouterContext.Provider
      value={{
        screens,
        screenPipe,
        params,
        setParams,
        setPipe,
        initState,
      }}
    >
      <ToastProvider>{layout}</ToastProvider>
    </RouterContext.Provider>
  );
};

export const LocationProvider: FC<ProviderProps> = ({ children }) => {
  const { screens, screenPipe, setPipe, setParams } = useRouter();

  const isBack = useMemo(() => {
    return (
      screenPipe.length > 1 &&
      screenPipe[screenPipe.length - 1].key !== BUFFER_LOADING_APP_SCREEN_KEY
    );
  }, [screenPipe]);

  const goBack = useCallback(
    (skip?: number) => {
      const _skip = skip || 1;
      const _pipe = screenPipe.slice(
        0,
        screenPipe.length - _skip < 1 ? 1 : screenPipe.length - _skip
      );
      setPipe(_pipe);
    },
    [screenPipe, setPipe]
  );

  const push = useCallback(
    (key: string, payload?: LocationPushPayload) => {
      const screen = screens.find((screen) => screen.key === key);

      if (!screen) {
        throw new Error(`${NOT_FOUND_CONTEXT_SCREEN} - ${key} - ${screen}`);
      }

      /**
       * @description Delete current screen before push to new screen
       */
      const _pipe = [...screenPipe.slice()];
      if (payload?.deleted) {
        _pipe.pop();
      }

      /**
       * @description Set screen params
       */
      if (payload?.params !== undefined) {
        setParams(payload.params);
      }

      _pipe.push(screen);
      setPipe(_pipe);
    },
    [screenPipe, screens]
  );

  return (
    <LocationContext.Provider
      value={{
        goBack,
        push,
        isBack,
      }}
    >
      {children as ReactNode}
    </LocationContext.Provider>
  );
};
