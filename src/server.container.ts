import {
  getMemoryStorageProvider,
  NetworkType,
  RegistryProvider,
} from "./libs/providers";
import { getAuthAction, getOAuthAction, getUserAction } from "./libs/actions";
import { OAuthCredential } from "./libs/dto/connect-oauth.dto";
import { A8ServerConnectSession } from "./libs/dto/a8-connect-session.dto";

/**
 * A8ServerConnect init options.
 */
export interface A8ServerConnectInitOptions {
  /**
   * `networkType` to determine whether the `testnet` cluster or `mainnet` cluster is in use.
   */
  networkType: NetworkType;

  /**
   * `globalContext` provide nodejs global context. Sometimes you need to directly pass `global` when init `A8ServerConnect`.
   */
  globalContext?: typeof global;

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
   * `withOAuthCredential` to import oauth credential to the storage.
   */
  withOAuthCredential?: OAuthCredential;
}

/**
 * A8ServerConnect instance is available when the current environment is nodejs.
 */
export class A8ServerConnect {
  /**
   * `currentSession` is initially set to null. After the `init` call, the property will become available.
   */
  public currentSession: A8ServerConnectSession = null;

  /**
   * Initialize session. After initialization, the `currentSession` will be available.
   */
  public init(options: A8ServerConnectInitOptions) {
    /**
     * Get global context or fallback to built-in global.
     */
    const globalContext = options.globalContext || global;

    /**
     * Assign network type
     */
    RegistryProvider.getInstance().networkType = options.networkType;

    /**
     * Initialize server registry
     */
    RegistryProvider.initializeServerRegistry(
      globalContext,
      globalContext.fetch,
      getMemoryStorageProvider()
    );

    /**
     * Initialize current session
     */
    this.currentSession = {
      Auth: getAuthAction({ reInit: true }),
      User: getUserAction({ reInit: true }),
      OAuth: getOAuthAction({ reInit: true }),
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
  private setOAuthCredential(oauthCredential: OAuthCredential | null) {
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
