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
 * The function to get auth action
 */
export const getAuthAction = () => {
  if (!authAction) {
    authAction = new AuthAction();
  }
  return authAction;
};

/**
 * The function to get wallet action
 */
export const getWalletAction = () => {
  if (!walletAction) {
    walletAction = new WalletAction();
  }
  return walletAction;
};

/**
 * The wallet to get user action
 */
export const getUserAction = () => {
  if (!userAction) {
    userAction = new UserAction();
  }
  return userAction;
};

/**
 * The wallet to get user action
 */
export const getOAuthAction = () => {
  if (!oauthAction) {
    oauthAction = new OAuthAction();
  }
  return oauthAction;
};
