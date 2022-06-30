import React, { Dispatch, SetStateAction, createContext } from "react";

export interface ProviderProps {
  children?: React.FunctionComponent | React.ReactNode | JSX.Element;
}

export interface ScreenType {
  key: string;
  children: React.FunctionComponent;
}

export interface RouterContextObject {
  /**
   * @description Initialize available screens
   * */
  screens: ScreenType[];

  /**
   * @description Current route path of screens
   * */
  screenPipe: ScreenType[];

  /**
   * @description Current screen
   */
  currentScreen: React.FunctionComponent;

  /**
   * @description Update current route path
   * @details Handle goback and push screen value
   */
  setPipe: Dispatch<SetStateAction<ScreenType[]>>;

  /**
   * The property to indicate whether the router is ready or not
   */
  isRouterReady: boolean;
}

export const RouterContext = createContext<RouterContextObject>(null);

export interface LocationContextObject {
  /**
   * @description Handle go back screen
   */
  goBack(): void;

  /**
   * @description Handle go back screen with a callback
   */
  goBackWithCallback(callback: () => void): void;

  /**
   * @description Handle transit to another screen
   * @param key
   * @param deleted Check if want to destroy current screen before move to next screen
   */
  push(key: string, deleted?: boolean | false): void;

  /**
   * The function to set a go back callback
   * @param func
   */
  setGoBackCallback(func: () => void | null): void;
}

export const LocationContext = createContext<LocationContextObject>(null);
