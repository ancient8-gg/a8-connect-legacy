import { ScreenType } from ".";

import {
  BaseWelcomeScreen,
  BASE_WELCOME_SREEN_KEY,
} from "../../screens/base-welcome.screen";

import {
  BaseWalletSelect,
  BASE_WALLET_SELECT_SCREEN_KEY,
} from "../../screens/base-wallet-select.screen";

import {
  SignWalletScreen,
  SIGN_WALLET_SCREEN_KEY,
} from '../../screens/sign-wallet.screen';


export const screens_initial: ScreenType[] = [
  {
    key: BASE_WELCOME_SREEN_KEY,
    children: BaseWelcomeScreen,
  },
  {
    key: BASE_WALLET_SELECT_SCREEN_KEY,
    children: BaseWalletSelect,
  },
  {
    key: SIGN_WALLET_SCREEN_KEY,
    children: SignWalletScreen,
  }
];

export {
  BaseWelcomeScreen,
  BASE_WELCOME_SREEN_KEY,
  BaseWalletSelect,
  BASE_WALLET_SELECT_SCREEN_KEY,
};
