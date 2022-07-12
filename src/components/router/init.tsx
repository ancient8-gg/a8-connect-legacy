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

import {
  BaseWelcomeAddWallet,
  BASE_WELCOME_ADD_WALLET_SCREEN_KEY,
} from "../../screens/base-welcome-add-wallet.screen";

import {
  SignWalletAddWalletScreen,
  SIGN_WALLET_ADD_WALLET_KEY,
} from "../../screens/sign-wallet-add-wallet.screen";

import {
  BaseWelcomeLostWalletScreen,
  BASE_WELCOME_LOST_WALLET_SCREEN_KEY,
} from "../../screens/base-welcome-lost-wallet.screen";

import {
  SignWalletLostWalletScreen,
  SIGN_WALLET_LOST_WALLET_KEY,
} from "../../screens/sign-wallet-lost-wallet.screen";

import {
  BaseNotificationScreen,
  BASE_NOTIFICATION_SCREEN_KEY,
} from "../../screens/base-notification.screen";

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
    {
      key: BASE_NOTIFICATION_SCREEN_KEY,
      children: BaseNotificationScreen,
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
    {
      key: BASE_NOTIFICATION_SCREEN_KEY,
      children: BaseNotificationScreen,
    },
  ],
  ADD_WALLET_FLOW: [
    {
      key: BUFFER_LOADING_APP_SCREEN_KEY,
      children: BufferLoadingAppScreen,
    },
    {
      key: BASE_WELCOME_ADD_WALLET_SCREEN_KEY,
      children: BaseWelcomeAddWallet,
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
      key: SIGN_WALLET_ADD_WALLET_KEY,
      children: SignWalletAddWalletScreen,
    },
    {
      key: BASE_NOTIFICATION_SCREEN_KEY,
      children: BaseNotificationScreen,
    },
  ],
  LOST_WALLET_FLOW: [
    {
      key: BUFFER_LOADING_APP_SCREEN_KEY,
      children: BufferLoadingAppScreen,
    },
    {
      key: BASE_WELCOME_LOST_WALLET_SCREEN_KEY,
      children: BaseWelcomeLostWalletScreen,
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
      key: SIGN_WALLET_LOST_WALLET_KEY,
      children: SignWalletLostWalletScreen,
    },
    {
      key: BASE_NOTIFICATION_SCREEN_KEY,
      children: BaseNotificationScreen,
    },
  ],
};
