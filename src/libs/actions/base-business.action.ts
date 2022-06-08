import { AuthProvider } from "../providers/auth.provider";
import { CookieProvider } from "../providers/cookie.provider";
import { StorageProvider } from "../providers/storage.provider";
import {
  getAuthProvider,
  getCookieProvider,
  getStorageProvider,
  getUserProvider,
  RegistryProvider,
} from "../providers";
import { NetworkType } from "../providers/registry.provider";
import { UserProvider } from "../providers/user.provider";

/**
 * `BaseBusinessAction` class is represented as an application service. Can be inherited.
 * The instance should be initialized and the method calls should be called inside the browser context.
 */
export class BaseBusinessAction {
  protected readonly authProvider: AuthProvider;
  protected readonly userProvider: UserProvider;
  protected readonly cookieProvider: CookieProvider;
  protected readonly storageProvider: StorageProvider;

  constructor(
    networkType: NetworkType,
    document: Document,
    storage: Storage,
    fetchInstance: typeof fetch
  ) {
    // Initialize registry
    const registryProvider = RegistryProvider.getInstance();
    registryProvider.networkType = networkType;
    registryProvider.document = document;
    registryProvider.fetch = fetchInstance;
    registryProvider.storage = storage;

    // Initialize provider
    this.authProvider = getAuthProvider();
    this.userProvider = getUserProvider();
    this.storageProvider = getStorageProvider();
    this.cookieProvider = getCookieProvider();
  }
}
