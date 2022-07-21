import { CookieProvider, CookieProviderGetter } from "./cookie.provider";
import {
  NetworkOptions,
  NetworkProvider,
  NetworkProviderGetter,
} from "./network.provider";
import { StorageProvider, StorageProviderGetter } from "./storage.provider";
import { NetworkType, RegistryProvider, Window } from "./registry.provider";
import { AuthProvider } from "./auth.provider";
import { UserProvider } from "./user.provider";
import { UtilsProvider } from "./utils.provider";
import { MemoryStorageProvider, StorageData } from "./memory-storage.provider";
import { OAuthProvider } from "./oauth.provider";

/**
 * Export Registry Provider
 */
export {
  RegistryProvider,
  UtilsProvider,
  UserProvider,
  AuthProvider,
  OAuthProvider,
  StorageProvider,
  NetworkProvider,
  CookieProvider,
  NetworkType,
  MemoryStorageProvider,
};

export type {
  CookieProviderGetter,
  NetworkProviderGetter,
  StorageProviderGetter,
  NetworkOptions,
  StorageData,
  Window,
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
 * OAuth Provider
 */
export const getOAuthProvider = () =>
  new OAuthProvider(getNetworkProvider, getStorageProvider, getCookieProvider);

/**
 * Utils provider
 */
export const getUtilsProvider = () => new UtilsProvider();

/**
 * Get memory storage provider
 */
export const getMemoryStorageProvider = () =>
  MemoryStorageProvider.getInstance();
