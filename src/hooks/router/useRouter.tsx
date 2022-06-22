import React, { useState, useMemo, useCallback } from "react";
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

export const RouterProvider: React.FC<ProviderProps> = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(true);
  const { sdkMethod } = useSession();

  const screens: ScreenType[] =
    sdkMethod === SdkMethod.login
      ? SCREENS["LOGIN_FLOW"]
      : SCREENS["CONNECT_FLOW"];

  /**
   * @description Always start from first screen in initial
   */
  const [screenPipe, setPipe] = useState<ScreenType[]>([screens[0]]);

  const CurrentScreen = useMemo<React.FunctionComponent>(() => {
    return screenPipe[screenPipe.length - 1].children;
  }, [screenPipe, setPipe]);

  const layout = useMemo(
    () => (
      <LocationProvider>
        <Modal
          modalIsOpen={modalIsOpen}
          onCloseModal={() => setModalIsOpen(false)}
          isBack={
            screenPipe.length > 1 &&
            screenPipe[screenPipe.length - 1].key !==
              SCREEN_KEYS.WELCOME_APP_SCREEN_KEY
          }
        >
          <CurrentScreen />
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

export const LocationProvider: React.FC<ProviderProps> = ({ children }) => {
  const { screens, screenPipe, setPipe } = useRouter();

  const goBack = async () => {
    const _pipe = [...screenPipe];
    _pipe.pop();
    setPipe(_pipe);
  };

  const push = useCallback(
    async (key: string, deleted?: boolean | false) => {
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
        goBack,
        push,
      }}
    >
      {children as React.ReactNode}
    </LocationContext.Provider>
  );
};
