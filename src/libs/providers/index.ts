import { CookieProvider, CookieProviderGetter } from "./cookie.provider";
import {
  NetworkOptions,
  NetworkProvider,
  NetworkProviderGetter,
} from "./network.provider";
import { StorageProvider, StorageProviderGetter } from "./storage.provider";
import { NetworkType, RegistryProvider } from "./registry.provider";
import { AuthProvider } from "./auth.provider";
import { UserProvider } from "./user.provider";
import { UtilsProvider } from "./utils.provider";

/**
 * Export Registry Provider
 */
export {
  RegistryProvider,
  UtilsProvider,
  UserProvider,
  AuthProvider,
  StorageProvider,
  NetworkProvider,
  CookieProvider,
  NetworkType,
};

export type {
  CookieProviderGetter,
  NetworkProviderGetter,
  StorageProviderGetter,
  NetworkOptions,
};

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

/**
 * Utils provider
 */
export const getUtilsProvider = () => new UtilsProvider();
