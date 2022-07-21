import { NetworkOptions, NetworkProviderGetter } from "./network.provider";
import { StorageProviderGetter } from "./storage.provider";
import { CookieProviderGetter } from "./cookie.provider";
import { BaseUrl, RegistryProvider } from "./registry.provider";
import { OAuthCredential } from "../dto/connect-oauth.dto";

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
   * Construct OAuth headers
   * @param options
   * @private
   */
  private constructOAuthHeaders(options: NetworkOptions) {
    const storage = this.getStorageProvider();
    const authClientCredentialText = storage.getItem("oauth_credential", null);

    /**
     * Construct headers that inherit from default headers first
     */
    options.headers = {
      ...this.defaultNetWorkOptions.headers,
      ...options.headers,
    };

    /**
     * Prioritize raising error if none of credentials are available
     */
    if (!authClientCredentialText)
      throw new Error("Credentials are not available");

    try {
      const authClientCredential = JSON.parse(
        authClientCredentialText
      ) as OAuthCredential;

      options.headers = {
        "Auth-Client-Key": authClientCredential.authClientKey,
        "Auth-Client-Secret": authClientCredential.authClientSecret,
        ...options.headers,
      };
    } catch {}

    return options;
  }

  /**
   * Construct Auth Headers.
   * @param options
   * @private
   */
  private constructAuthHeaders(options: NetworkOptions): NetworkOptions {
    const networkType = RegistryProvider.getInstance().networkType;
    const storage = this.getStorageProvider();
    const cookie = this.getCookieProvider();

    const authTokenFromCookie = cookie.getCookie("jwt", null);
    const authTokenCookieFromStorage = storage.getItem("jwt_cookie", null);
    const authTokenFromStorage = storage.getItem("jwt", null);

    /**
     * Construct headers that inherit from default headers first
     */
    options.headers = {
      ...this.defaultNetWorkOptions.headers,
      ...options.headers,
    };

    /**
     * Prioritize raising error if none of credentials are available
     */
    if (
      !authTokenFromCookie &&
      !authTokenCookieFromStorage &&
      !authTokenFromStorage
    )
      throw new Error("Credentials are not available");

    /**
     * Prioritize extracting credential from cookie
     */
    if (!!authTokenFromCookie) {
      options.credentials = "include";
      return options;
    }

    /**
     * Prioritize extracting cookie from storage
     */
    if (!!authTokenCookieFromStorage) {
      const cookieKey = `${BaseUrl[networkType]}_jwt`;
      options.headers = {
        Cookie: `${cookieKey}=${authTokenCookieFromStorage}`,
        ...options.headers,
      };
      return options;
    }

    /**
     * Prioritize extracting bearer jwt token from storage
     */
    if (!!authTokenFromStorage) {
      options.headers = {
        Authorization: `Bearer ${authTokenFromStorage}`,
        ...options.headers,
      };
      return options;
    }

    /**
     * Return default options.
     */
    return options;
  }

  /**
   * The function to make a request with credentials included.
   * @param url
   * @param options
   */
  protected requestWithCredential<T>(
    url: string,
    options: NetworkOptions
  ): Promise<T> {
    const networkProvider = this.getNetworkProvider();
    const expectedOptions = this.constructAuthHeaders(options);

    let networkOptions = Object.assign({}, this.defaultNetWorkOptions);
    networkOptions = Object.assign(networkOptions, expectedOptions);
    networkOptions.headers = JSON.parse(JSON.stringify(networkOptions.headers));

    return networkProvider.request<T>(url, networkOptions);
  }

  /**
   * The function to make a request with oauth credentials included.
   * @param url
   * @param options
   */
  protected requestWithOAuthCredential<T>(
    url: string,
    options: NetworkOptions
  ): Promise<T> {
    const networkProvider = this.getNetworkProvider();
    const expectedOptions = this.constructOAuthHeaders(options);

    let networkOptions = Object.assign({}, this.defaultNetWorkOptions);
    networkOptions = Object.assign(networkOptions, expectedOptions);
    networkOptions.headers = JSON.parse(JSON.stringify(networkOptions.headers));

    return networkProvider.request<T>(url, networkOptions);
  }

  /**
   * The function to make a request without credentials included.
   * @param url
   * @param options
   */
  protected request<T>(url: string, options: NetworkOptions): Promise<T> {
    const networkProvider = this.getNetworkProvider();

    let networkOptions = Object.assign({}, this.defaultNetWorkOptions);
    networkOptions = Object.assign(networkOptions, options);
    networkOptions.headers = JSON.parse(JSON.stringify(networkOptions.headers));

    return networkProvider.request<T>(url, networkOptions);
  }
}
