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
}

export const RouterContext = createContext<RouterContextObject>(null);

export interface LocationContextObject {
  /**
   * @description Handle go back screen
   */
  goBack(): Promise<void>;

  /**
   * @description Handle transit to another screen
   * @param key
   * @param deleted Check if want to destroy current screen before move to next screen 
   */
  push(key: string, deleted?: boolean | false): Promise<void>;
}

export const LocationContext = createContext<LocationContextObject>(null);
