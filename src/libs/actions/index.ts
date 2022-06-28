import { AuthAction } from "./auth.action";
import { RegistryProvider } from "../providers";
import { WalletAction } from "./wallet.action";
import { UserAction } from "./user.action";

export { WalletAction } from "./wallet.action";
export { AuthAction } from "./auth.action";
export { UserAction } from "./user.action";

/**
 * The function to get auth action
 */
export const getAuthAction = () => {
  return new AuthAction(RegistryProvider.getInstance().networkType);
};

/**
 * The function to get wallet action
 */
export const getWalletAction = () => {
  return new WalletAction();
};

/**
 * The wallet to get user action
 */
export const getUserAction = () => {
  return new UserAction(RegistryProvider.getInstance().networkType);
};
