import { UserInfo } from "./entities";
import { AuthAction, UserAction, WalletAction, OAuthAction } from "../actions";
import { BaseWalletAdapter, ChainType } from "../adapters";

/**
 * `ConnectedWalletPayload` will be passed to the onConnected callback
 */
export interface ConnectedWalletPayload {
  /**
   * The connected wallet address
   */
  walletAddress: string;

  /**
   * The wallet provider user selected during onboarding flow
   */
  provider: BaseWalletAdapter;

  /**
   * The chain (either Solana/EVM) user selected during onboarding flow
   */
  chainType: ChainType;

  /**
   * The name of the wallet software user selected during onboarding flow
   */
  walletName: string;
}

/**
 * `A8ConnectSession` determines the current session with actions that can be executed on DApps.
 */
export interface A8ConnectSession {
  /**
   * `Auth` action for any actions related to authentication.
   */
  Auth: AuthAction;

  /**
   * `Wallet` action for any actions related to user wallet
   */
  Wallet: WalletAction;

  /**
   * `User` action for any actions related to user profile
   */
  User: UserAction;

  /**
   * `connectedWallet` determines the current connected wallet
   */
  connectedWallet: ConnectedWalletPayload | null;

  /**
   * `sessionUser` determines the current session information of user
   */
  sessionUser: UserInfo | null;
}

/**
 * `A8ServerConnectSession` determines the current session with actions that can be executed on server side.
 * The server environment can only use `fetch` based actions, which are `Auth` and `User` actions.
 */
export interface A8ServerConnectSession {
  /**
   * `Auth` action for any actions related to authentication.
   */
  Auth: AuthAction;

  /**
   * `User` action for any actions related to user profile
   */
  User: UserAction;

  /**
   * `OAuth` actions for any actions related to oauth
   */
  OAuth: OAuthAction;
}
