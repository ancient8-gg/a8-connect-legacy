import { getMemoryStorageProvider, RegistryProvider } from "./libs/providers";
import { getAuthAction, getOAuthAction, getUserAction } from "./libs/actions";
import { ConnectSessionDto, ConnectOAuthDto, Providers } from "./server.types";

/**
 * A8ServerConnect init options.
 */
export interface A8ServerConnectInitOptions {
  /**
   * `networkType` to determine whether the `testnet` cluster or `mainnet` cluster is in use.
   */
  networkType: Providers.NetworkType;

  /**
   * `withCredential` to import bearer jwt auth token to the storage.
   */
  withBearerCredential?: string;

  /**
   * `withCookieCredential` to import cookie jwt auth token to the storage.
   * Bearer credential is different from cookie credential.
   */
  withCookieCredential?: string;

  /**
   * `withOAuthCredential` to import oauth credential to the storage
   */
  withOAuthCredential?: ConnectOAuthDto.OAuthCredential;
}

/**
 * A8ServerConnect instance is available when the current environment is nodejs.
 */
export class A8ServerConnect {
  /**
   * `currentSession` is initially set to null. After the `init` call, the property will become available.
   */
  public currentSession: ConnectSessionDto.A8ServerConnectSession = null;

  /**
   * Public Constructor.
   */
  constructor() {
    /**
     * Initialize server registry
     */
    RegistryProvider.initializeServerRegistry(
      global,
      global.fetch,
      getMemoryStorageProvider()
    );
  }

  /**
   * Initialize session. After initialization, the `currentSession` will be available.
   */
  public init(options: A8ServerConnectInitOptions) {
    /**
     * Assign network type
     */
    RegistryProvider.getInstance().networkType = options.networkType;

    /**
     * Initialize current session
     */
    this.currentSession = {
      Auth: getAuthAction(),
      User: getUserAction(),
      OAuth: getOAuthAction(),
    };

    /**
     * Initialize credential
     */
    if (!!options.withBearerCredential) {
      this.setCredential(options.withBearerCredential);
    }

    /**
     * Initialize cookie credential
     */
    if (!!options.withCookieCredential) {
      this.setCookieCredential(options.withCookieCredential);
    }

    /**
     * Initialize oauth credential
     */
    if (!!options.withOAuthCredential) {
      this.setOAuthCredential(options.withOAuthCredential);
    }
  }

  /**
   * The function to replace bearer credential.
   * Call this function to remove the old credential and replace with a new one.
   * Set parameter to null to delete current credential.
   * @param jwt
   */
  private setCredential(jwt: string | null) {
    /**
     * Remove current credential
     */
    this.currentSession.Auth.removeCredential();

    /**
     * Persist new credential
     */
    this.currentSession.Auth.setCredential(jwt);
  }

  /**
   * The function to replace cookie credential.
   * Call this function to remove the old credential and replace with a new one.
   * Set parameter to null to delete current credential.
   * @param jwt
   */
  private setCookieCredential(jwt: string | null) {
    /**
     * Remove current credential
     */
    this.currentSession.Auth.removeCookieStorageCredential();

    /**
     * Persist new credential
     */
    this.currentSession.Auth.setCookieStorageCredential(jwt);
  }

  /**
   * The function to replace oauth credential.
   * Call this function to remove the old credential and replace with a new one.
   * Set parameter to null to delete current credential.
   * @param oauthCredential
   */
  private setOAuthCredential(
    oauthCredential: ConnectOAuthDto.OAuthCredential | null
  ) {
    /**
     * Remove current credential
     */
    this.currentSession.OAuth.removeOAuthCredential();

    /**
     * Persist new credential
     */
    this.currentSession.OAuth.setOAuthCredential(oauthCredential);
  }
}
