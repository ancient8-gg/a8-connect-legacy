import { CookieProvider } from "./cookie.provider";
import { NetworkProvider } from "./network.provider";
import { StorageProvider } from "./storage.provider";
import { RegistryProvider } from "./registry.provider";
import { AuthProvider } from "./auth.provider";

/**
 * Local Storage Provider
 */
const getStorageProvider = () =>
  new StorageProvider(
    RegistryProvider.getInstance().storage,
    RegistryProvider.getInstance().networkType
  );

/**
 * Network Provider
 */
const getNetworkProvider = () =>
  new NetworkProvider(RegistryProvider.getInstance().fetch, {
    networkType: RegistryProvider.getInstance().networkType,
  });

/**
 * Cookie Provider
 */
const getCookieProvider = () =>
  new CookieProvider(
    RegistryProvider.getInstance().document,
    RegistryProvider.getInstance().networkType
  );

/**
 * Export Registry Provider
 */
export { RegistryProvider };

/**
 * Auth Provider
 */
export const getAuthProvider = () =>
  new AuthProvider(getNetworkProvider, getStorageProvider, getCookieProvider);
