import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  FC,
  FunctionComponent,
  ReactNode,
} from "react";
import { SCREENS, SCREEN_KEYS } from "./init";
import {
  RouterContext,
  LocationContext,
  ProviderProps,
  ScreenType,
  useRouter,
  NOT_FOUND_CONTEXT_SCREEN,
} from "./";
import Modal from "../../components/modal";
import { useSession } from "../useSession";
import { SdkMethod } from "../../libs/dto/entities";

export const RouterProvider: FC<ProviderProps> = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(true);
  const { sdkMethod } = useSession();
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

  const isBack = useMemo(() => {
    return (
      screenPipe.length > 1 &&
      screenPipe[screenPipe.length - 1].key !==
        SCREEN_KEYS.WELCOME_APP_SCREEN_KEY
    );
  }, [screenPipe]);

  const isRouterReady = useMemo(() => {
    return screens.length > 0 && screenPipe.length > 0;
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
        <Modal
          modalIsOpen={modalIsOpen}
          onCloseModal={() => setModalIsOpen(false)}
          isBack={isBack}
        >
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
        isBack,
        isRouterReady,
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
