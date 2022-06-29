import { AuthAction } from "./auth.action";
import { RegistryProvider } from "../providers";
import { WalletAction } from "./wallet.action";
import { UserAction } from "./user.action";

export { WalletAction } from "./wallet.action";
export { AuthAction } from "./auth.action";
export { UserAction } from "./user.action";

let authAction: AuthAction;
let walletAction: WalletAction;
let userAction: UserAction;

/**
 * The function to get auth action
 */
export const getAuthAction = () => {
  if (!authAction) {
    authAction = new AuthAction(RegistryProvider.getInstance().networkType);
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
    userAction = new UserAction(RegistryProvider.getInstance().networkType);
  }
  return userAction;
};
