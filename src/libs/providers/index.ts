import { CookieProvider } from "./cookie.provider";
import { NetworkProvider } from "./network.provider";
import { StorageProvider } from "./storage.provider";
import { RegistryProvider } from "./registry.provider";
import { AuthProvider } from "./auth.provider";
import { UserProvider } from "./user.provider";

/**
 * Export Registry Provider
 */
export { RegistryProvider };

/**
 * Storage Provider
 */
export const getStorageProvider = () =>
  new StorageProvider(
    RegistryProvider.getInstance().storage,
    RegistryProvider.getInstance().networkType
  );

/**
 * Network Provider
 */
export const getNetworkProvider = () =>
  new NetworkProvider(RegistryProvider.getInstance().fetch, {
    networkType: RegistryProvider.getInstance().networkType,
  });

/**
 * Cookie Provider
 */
export const getCookieProvider = () =>
  new CookieProvider(
    RegistryProvider.getInstance().document,
    RegistryProvider.getInstance().networkType
  );

/**
 * Auth Provider
 */
export const getAuthProvider = () =>
  new AuthProvider(getNetworkProvider, getStorageProvider, getCookieProvider);

/**
 * User Provider
 */
export const getUserProvider = () =>
  new UserProvider(getNetworkProvider, getStorageProvider, getCookieProvider);
