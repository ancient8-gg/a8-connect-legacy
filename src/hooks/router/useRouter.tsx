import React, { useState, useMemo } from 'react';
import {
  RouterContext,
  LocationContext,
  ProviderProps,
  ScreenType,
  useRouter,
  NOT_FOUND_CONTEXT_SCREEN,
} from './';

export const RouterProvider: React.FC<ProviderProps> = ({ children }) => {
  const screens: ScreenType[] = [];
  const [screenPipe, setPipe] = useState<ScreenType[]>([]);

  const currentScreen = useMemo<ScreenType>(() => {
    return screenPipe[screenPipe.length - 1];
  }, [screenPipe])

  return (
    <RouterContext.Provider value={{
      screens,
      screenPipe,
      currentScreen,
      setPipe,
    }}>
      <LocationProvider>
        {children}
      </LocationProvider>
    </RouterContext.Provider>
  );
}

export const LocationProvider: React.FC<ProviderProps> = ({ children }) => {
  const { screens, setPipe } = useRouter();

  const goBack = async () => {
    setPipe(screens => {
      screens.pop();
      return screens;
    });
  };

  const push = async (key: string) => {
    let screen = screens.find(screen => screen.key === key);
    if (!screen) {
      throw new Error(NOT_FOUND_CONTEXT_SCREEN);
    }
    setPipe(screens => {
      if (!screen) {
        throw new Error(NOT_FOUND_CONTEXT_SCREEN);
      }
      screens.push(screen);
      return screens;
    });
  };

  return (
    <LocationContext.Provider value={{
      goBack,
      push,
    }}>
      {children}
    </LocationContext.Provider>
  );
}