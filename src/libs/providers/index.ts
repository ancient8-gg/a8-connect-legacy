import { CookieProvider } from "./cookie.provider";
import { NetworkProvider } from "./network.provider";
import { StorageProvider } from "./storage.provider";
import { RegistryProvider } from "./registry.provider";
import { AuthProvider } from "./auth.provider";

/**
 * Export Registry Provider
 */
export { RegistryProvider };

/**
 * Local Storage Provider
 */
export const getStorageProvider = () =>
  new StorageProvider(
    localStorage,
    RegistryProvider.getInstance().getNetworkType()
  );

/**
 * Network Provider
 */
export const getNetworkProvider = () =>
  new NetworkProvider(fetch, {
    networkType: RegistryProvider.getInstance().getNetworkType(),
  });

/**
 * Cookie Provider
 */
export const getCookieProvider = () =>
  new CookieProvider(document, RegistryProvider.getInstance().getNetworkType());

/**
 * Auth Provider
 */
export const getAuthProvider = () =>
  new AuthProvider(getNetworkProvider, getStorageProvider, getCookieProvider);
