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
 * `OffChainAction` class is represented as an application service. Can be inherited.
 * The instance should be initialized and the method calls should be called inside the browser context.
 */
export class OffChainAction {
  /**
   * `AuthProvider` provides all methods to handle authentication actions.
   * @protected
   */
  protected readonly authProvider: AuthProvider;

  /**
   * `UserProvider` provides all methods to handle fetching/patching user data.
   * @protected
   */
  protected readonly userProvider: UserProvider;

  /**
   * `CookieProvider` provides all methods to handle cookie actions.
   * @protected
   */
  protected readonly cookieProvider: CookieProvider;

  /**
   * `Storage` provides all methods to handle storage actions.
   * @protected
   */
  protected readonly storageProvider: StorageProvider;

  /**
   * Constructor needs `NetworkType` passing as parameter.
   * @param networkType
   */
  constructor(networkType: NetworkType) {
    // Initialize registry
    const registryProvider = RegistryProvider.getInstance();
    registryProvider.networkType = networkType;
    registryProvider.document = (window as any).document;
    registryProvider.fetch = (window as any).fetch;
    registryProvider.storage = (window as any).localStorage;

    // Initialize provider
    this.authProvider = getAuthProvider();
    this.userProvider = getUserProvider();
    this.storageProvider = getStorageProvider();
    this.cookieProvider = getCookieProvider();
  }
}
