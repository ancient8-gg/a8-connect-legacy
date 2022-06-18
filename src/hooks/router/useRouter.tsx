import React, { useState, useMemo, useCallback } from "react";
import { screens_initial } from "./init";
import {
  RouterContext,
  LocationContext,
  ProviderProps,
  ScreenType,
  useRouter,
  NOT_FOUND_CONTEXT_SCREEN,
} from "./";
import Modal from "../../components/modal";

export const RouterProvider: React.FC<ProviderProps> = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(true);
  const screens: ScreenType[] = screens_initial;

  /**
   * @description Always start from first screen in initial
   */
  const [screenPipe, setPipe] = useState<ScreenType[]>([screens[0]]);

  const CurrentScreen = useMemo<React.FunctionComponent>(() => {
    return screenPipe[screenPipe.length - 1].children;
  }, [screenPipe, setPipe]);

  const layout = useMemo(() => (
    <LocationProvider>
      <Modal
        modalIsOpen={modalIsOpen}
        onCloseModal={() => setModalIsOpen(false)}
        isBack={screenPipe.length > 1}
      >
        <CurrentScreen />
      </Modal>
    </LocationProvider>
  ), [screenPipe, setPipe]);

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
  const { screens, screenPipe, setPipe, } = useRouter();

  const goBack = async () => {
    const _pipe = [...screenPipe];
    _pipe.pop();
    setPipe(_pipe);
  };

  const push = useCallback(async (key: string) => {
    const screen = screens.find((screen) => screen.key === key);

    if (!screen) {
      throw new Error(NOT_FOUND_CONTEXT_SCREEN);
    }

    const _pipe = [...screenPipe, screen];
    setPipe(_pipe);
  }, [screenPipe, setPipe]);

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
