import { NetworkProviderGetter } from "./network.provider";
import { StorageProviderGetter } from "./storage.provider";
import { CookieProviderGetter } from "./cookie.provider";

/**
 * Auth Provider that handles authentication-related APIs, is associated with `networkType`.
 */
export class BusinessProvider {
  /**
   * Network provider getter
   * @private
   */
  protected getNetworkProvider: NetworkProviderGetter;

  /**
   * Storage provider getter
   * @private
   */
  protected getStorageProvider: StorageProviderGetter;

  /**
   * Cookie provider getter
   * @private
   */
  protected getCookieProvider: CookieProviderGetter;

  constructor(
    getNetworkProvider: NetworkProviderGetter,
    getStorageProvider: StorageProviderGetter,
    getCookieProvider: CookieProviderGetter
  ) {
    this.getCookieProvider = getCookieProvider;
    this.getStorageProvider = getStorageProvider;
    this.getNetworkProvider = getNetworkProvider;
  }
}
