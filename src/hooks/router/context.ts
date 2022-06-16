import {
  Dispatch,
  SetStateAction,
  createContext
} from 'react';

export interface ProviderProps {
  children?: React.ReactNode,
};

export interface ScreenType {
  key: string;
  children: React.ReactNode,
}

export interface RouterContextObject {
  /**  
   * @description Initialize available screens
   * */
  screens: ScreenType[],

  /**  
   * @description Current route path of screens 
   * */
  screenPipe: ScreenType[],

  /**
   * @description Current screen
   */
  currentScreen: ScreenType;

  /**
   * @description Update current route path
   * @details Handle goback and push screen value
   */
  setPipe: Dispatch<SetStateAction<ScreenType[]>>;
}

export const RouterContext = createContext<RouterContextObject>(null)

export interface LocationContextObject {
  /**
   * @description Handle go back screen 
   */
  goBack(): Promise<void>;

  /**
   * @description Handle transit to another screen
   * @param key 
   */
  push(key: string): Promise<void>;
}

export const LocationContext = createContext<LocationContextObject>(null)

