/* eslint-disable @typescript-eslint/no-explicit-any */
import { NetworkOptions, NetworkProviderGetter } from "./network.provider";
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

  /**
   * Default network options
   * @private
   */
  private defaultNetWorkOptions: NetworkOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  /**
   * Constructor needs `getNetworkProvider`, `getStorageProvider` and `getCookieProvider` passed as parameters.
   * @param getNetworkProvider
   * @param getStorageProvider
   * @param getCookieProvider
   */
  constructor(
    getNetworkProvider: NetworkProviderGetter,
    getStorageProvider: StorageProviderGetter,
    getCookieProvider: CookieProviderGetter
  ) {
    this.getCookieProvider = getCookieProvider;
    this.getStorageProvider = getStorageProvider;
    this.getNetworkProvider = getNetworkProvider;
  }

  /**
   * The function to make a request with credentials included.
   * @param url
   * @param options
   */
  protected requestWithCredential<T>(
    url: string,
    options: NetworkOptions,
    authToken?: string
  ): Promise<T> {
    const networkProvider = this.getNetworkProvider();
    const storage = this.getStorageProvider();
    const cookie = this.getCookieProvider();

    const authTokenFromCookie = cookie.getCookie("jwt");
    const authTokenFromStorage = authToken || storage.getItem("jwt", null);

    if (!authTokenFromCookie && !authTokenFromStorage)
      throw new Error("Credentials is not available");

    if (!!authTokenFromCookie) options.credentials = "include";

    if (!!authTokenFromStorage && !authTokenFromCookie)
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${authTokenFromStorage}`,
      };

    /**
     * @description
     * Remove Content-Type when upload image,
     * so browser will detect content type of file automaticly
     */
    const defaultHeaders = this.defaultNetWorkOptions.headers;
    if ((options.headers as any)["Content-Type"] === "remove") {
      delete (defaultHeaders as any)["Content-Type"];

      delete (options.headers as any)["Content-Type"];
    }

    return networkProvider.request<T>(url, {
      ...this.defaultNetWorkOptions,
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
  }

  /**
   * The function to make a request without credentials included.
   * @param url
   * @param options
   */
  protected request<T>(url: string, options: NetworkOptions): Promise<T> {
    const networkProvider = this.getNetworkProvider();
    return networkProvider.request<T>(url, {
      ...this.defaultNetWorkOptions,
      ...options,
    });
  }
}
