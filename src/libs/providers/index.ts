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
export const getStorageProvider = () => new StorageProvider();

/**
 * Network Provider
 */
export const getNetworkProvider = () => new NetworkProvider({});

/**
 * Cookie Provider
 */
export const getCookieProvider = () => new CookieProvider();

/**
 * Auth Provider
 */
export const getAuthProvider = () => new AuthProvider();

/**
 * User Provider
 */
export const getUserProvider = () => new UserProvider();

/**
 * OAuth Provider
 */
export const getOAuthProvider = () => new OAuthProvider();

/**
 * Utils provider
 */
export const getUtilsProvider = () => new UtilsProvider();

/**
 * Get memory storage provider
 */
export const getMemoryStorageProvider = () =>
  MemoryStorageProvider.getInstance();
