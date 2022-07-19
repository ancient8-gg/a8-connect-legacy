import {
  FunctionComponent,
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
} from "react";
import { AppFlow } from "./type";

export interface ProviderProps {
  children?: FunctionComponent | ReactNode | JSX.Element;
}

export interface ScreenType {
  key: string;
  children: FunctionComponent;
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
   * @description Screen params
   */
  params: unknown;

  /**
   * @description Update current route path
   * @details Handle goback and push screen value
   */
  setPipe: Dispatch<SetStateAction<ScreenType[]>>;

  /**
   * Init state for router
   */
  initState: (appFlow: AppFlow) => void;

  /**
   * @description Set screen params
   * @param params
   */
  setParams: (params: unknown) => void;
}

export const RouterContext = createContext<RouterContextObject>(null);

/**
 * @params deleted - deleted Check if want to destroy current screen before move to next screen
 * @params params - screen params
 */
export type LocationPushPayload = {
  deleted?: boolean | false;
  params?: unknown;
};

export interface LocationContextObject {
  /**
   * @description Handle go back screen
   */
  goBack(skip?: number): void;

  /**
   * @description Handle transit to another screen
   * @param key - defined key of screen
   * @param payload
   */
  push(key: string, payload?: LocationPushPayload): void;

  /**
   * The boolean flag to indicate whether the current route is back-able or not
   */
  isBack: boolean;
}

export const LocationContext = createContext<LocationContextObject>(null);
