import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  FC,
  FunctionComponent,
  ReactNode,
} from "react";
import {
  LocationContext,
  NOT_FOUND_CONTEXT_SCREEN,
  ProviderProps,
  RouterContext,
  ScreenType,
  useRouter,
} from "../components/router";
import { useSession } from "./useSession";
import { SCREENS } from "../components/router/init";
import { SdkMethod } from "../libs/dto/entities";
import { useAppState } from "./useAppState";
import Modal from "../components/modal";

export const RouterProvider: FC<ProviderProps> = () => {
  const { sdkMethod } = useSession();
  const { isModalOpen, setRouterReady } = useAppState();

  /**
   * @description Initialize screens depend on what sdk type it is
   */
  const [screens, setScreens] = useState<ScreenType[]>([]);

  /**
   * @description Always start from first screen in initial
   */
  const [screenPipe, setPipe] = useState<ScreenType[]>([]);

  const CurrentScreen = useMemo<FunctionComponent>(() => {
    if (!screenPipe.length) {
      return null;
    }
    return screenPipe[screenPipe.length - 1].children;
  }, [screenPipe, setPipe]);

  useEffect(() => {
    setRouterReady(screens.length > 0 && screenPipe.length > 0);
  }, [screens, screenPipe]);

  useEffect(() => {
    const screens =
      sdkMethod === SdkMethod.connect
        ? SCREENS["CONNECT_FLOW"]
        : SCREENS["LOGIN_FLOW"];

    setScreens(screens);
    setPipe([screens[0]]);
  }, [sdkMethod]);

  const layout = useMemo(
    () => (
      <LocationProvider>
        <Modal modalIsOpen={isModalOpen}>
          {CurrentScreen && <CurrentScreen />}
        </Modal>
      </LocationProvider>
    ),
    [screenPipe, setPipe]
  );

  return (
    <RouterContext.Provider
      value={{
        screens,
        screenPipe,
        currentScreen: CurrentScreen,
        setPipe,
      }}
    >
      {layout}
    </RouterContext.Provider>
  );
};

export const LocationProvider: FC<ProviderProps> = ({ children }) => {
  const { screens, screenPipe, setPipe } = useRouter();
  const [goBackCallback, setGoBackCallback] = useState(null);

  const goBack = useCallback(() => {
    const _pipe = [...screenPipe];
    _pipe.pop();
    setPipe(_pipe);
  }, [screenPipe, setPipe]);

  const goBackWithCallback = useCallback(() => {
    goBack();
    goBackCallback && goBackCallback();
  }, [goBack, goBackCallback]);

  const push = useCallback(
    (key: string, deleted?: boolean | false) => {
      const screen = screens.find((screen) => screen.key === key);

      if (!screen) {
        throw new Error(NOT_FOUND_CONTEXT_SCREEN);
      }

      const _pipe = [...screenPipe];
      if (deleted) {
        _pipe.pop();
      }
      _pipe.push(screen);
      setPipe(_pipe);
    },
    [screenPipe, setPipe]
  );

  return (
    <LocationContext.Provider
      value={{
        setGoBackCallback,
        goBack,
        push,
        goBackWithCallback,
      }}
    >
      {children as ReactNode}
    </LocationContext.Provider>
  );
};
