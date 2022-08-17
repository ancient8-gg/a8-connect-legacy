import { AuthAction } from "./auth.action";
import { WalletAction } from "./wallet.action";
import { UserAction } from "./user.action";
import { OAuthAction } from "./oauth.action";

export { WalletAction } from "./wallet.action";
export { AuthAction } from "./auth.action";
export { UserAction } from "./user.action";
export { OAuthAction } from "./oauth.action";

let authAction: AuthAction;
let walletAction: WalletAction;
let userAction: UserAction;
let oauthAction: OAuthAction;

/**
 * Options for Action Getter
 */
export type ActionGetterOptions = {
  /**
   * Enable `reInit` to force re-create the action object.
   */
  reInit: boolean;
};

/**
 * The function to get auth action
 */
export const getAuthAction = (options?: ActionGetterOptions) => {
  if (!authAction || !!options?.reInit) {
    authAction = new AuthAction();
  }
  return authAction;
};

/**
 * The function to get wallet action
 */
export const getWalletAction = (options?: ActionGetterOptions) => {
  if (!walletAction || !!options?.reInit) {
    walletAction = new WalletAction();
  }
  return walletAction;
};

/**
 * The wallet to get user action
 */
export const getUserAction = (options?: ActionGetterOptions) => {
  if (!userAction || !!options?.reInit) {
    userAction = new UserAction();
  }
  return userAction;
};

/**
 * The wallet to get user action
 */
export const getOAuthAction = (options?: ActionGetterOptions) => {
  if (!oauthAction || !!options?.reInit) {
    oauthAction = new OAuthAction();
  }
  return oauthAction;
};
