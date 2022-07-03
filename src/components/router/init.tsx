import { AppFlow, ScreenType } from ".";

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
  BufferLoadingAppScreen,
  BUFFER_LOADING_APP_SCREEN_KEY,
} from "../../screens/buffer-loading.screen";

import {
  SignWalletConnectUID,
  SIGN_WALLET_CONNECT_UID_KEY,
} from "../../screens/sign-wallet-connect-uid.screen";

export const SCREENS: Record<AppFlow, ScreenType[]> = {
  BUFFER_FLOW: [
    {
      key: BUFFER_LOADING_APP_SCREEN_KEY,
      children: BufferLoadingAppScreen,
    },
  ],
  LOGIN_FLOW: [
    {
      key: BUFFER_LOADING_APP_SCREEN_KEY,
      children: BufferLoadingAppScreen,
    },
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
  ],
  CONNECT_FLOW: [
    {
      key: BUFFER_LOADING_APP_SCREEN_KEY,
      children: BufferLoadingAppScreen,
    },
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
      key: SIGN_WALLET_CONNECT_UID_KEY,
      children: SignWalletConnectUID,
    },
  ],
};
