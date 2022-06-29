import { ScreenType } from ".";

import {
  BaseWelcomeScreen,
  BASE_WELCOME_SCREEN_KEY,
} from "../../screens/base-welcome.screen";

import {
  BaseWalletSelect,
  BASE_WALLET_SELECT_SCREEN_KEY,
} from "../../screens/base-wallet-select.screen";

import {
  ConnectWalletScreen,
  CONNECT_WALLET_SCREEN_KEY,
} from "../../screens/connect-wallet.screen";

import {
  SignWalletScreen,
  SIGN_WALLET_SCREEN_KEY,
} from "../../screens/sign-wallet.screen";

import {
  WelcomeAppScreen,
  WELCOME_APP_SCREEN_KEY,
} from "../../screens/welcome-app.screen";

import {
  BaseConnectUIDScreen,
  BASE_CONNECT_UID_SCREEN_KEY,
} from "../../screens/base-connect-uid.screen";

import {
  SignWalletConnectUID,
  SIGN_WALLET_CONNECT_UID_KEY,
} from "../../screens/sign-wallet-connect-uid.screen";

export const SCREEN_KEYS = {
  BASE_WELCOME_SCREEN_KEY,
  BASE_WALLET_SELECT_SCREEN_KEY,
  CONNECT_WALLET_SCREEN_KEY,
  SIGN_WALLET_SCREEN_KEY,
  WELCOME_APP_SCREEN_KEY,
};

export type Flows = "LOGIN_FLOW" | "CONNECT_FLOW";

export const SCREENS: Record<Flows, ScreenType[]> = {
  LOGIN_FLOW: [
    {
      key: BASE_WELCOME_SCREEN_KEY,
      children: BaseWelcomeScreen,
    },
    {
      key: BASE_WALLET_SELECT_SCREEN_KEY,
      children: BaseWalletSelect,
    },
    {
      key: CONNECT_WALLET_SCREEN_KEY,
      children: ConnectWalletScreen,
    },
    {
      key: SIGN_WALLET_SCREEN_KEY,
      children: SignWalletScreen,
    },
    {
      key: WELCOME_APP_SCREEN_KEY,
      children: WelcomeAppScreen,
    },
  ],
  CONNECT_FLOW: [
    {
      key: BASE_WELCOME_SCREEN_KEY,
      children: BaseWelcomeScreen,
    },
    {
      key: BASE_CONNECT_UID_SCREEN_KEY,
      children: BaseConnectUIDScreen,
    },
    {
      key: CONNECT_WALLET_SCREEN_KEY,
      children: ConnectWalletScreen,
    },
    {
      key: SIGN_WALLET_CONNECT_UID_KEY,
      children: SignWalletConnectUID,
    },
    {
      key: WELCOME_APP_SCREEN_KEY,
      children: WelcomeAppScreen,
    },
  ],
};

export {
  BaseWelcomeScreen,
  BASE_WELCOME_SCREEN_KEY,
  BaseWalletSelect,
  BASE_WALLET_SELECT_SCREEN_KEY,
};
