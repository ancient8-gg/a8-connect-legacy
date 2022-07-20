import { AuthProvider } from "../providers";
import { CookieProvider } from "../providers";
import { StorageProvider } from "../providers";
import {
  getAuthProvider,
  getCookieProvider,
  getStorageProvider,
  getUserProvider,
} from "../providers";
import { UserProvider } from "../providers";

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
   */
  constructor() {
    // Initialize provider
    this.authProvider = getAuthProvider();
    this.userProvider = getUserProvider();
    this.storageProvider = getStorageProvider();
    this.cookieProvider = getCookieProvider();
  }
}
