import { NetworkType } from "./registry.provider";

/**
 * Cookie provider that handle all the stuffs related to cookie.
 */
export class CookieProvider {
  /**
   * The `window.document` object
   * @private
   */
  private readonly document: Document;

  /**
   * Network type which is prefixed when extracting cookie value.
   * @private
   */
  private readonly networkType: NetworkType;

  /**
   * Constructor needs `Document` and `NetworkType` parameters.
   * @param document
   * @param network
   */
  constructor(document: Document, network: NetworkType) {
    this.document = document;
    this.networkType = network;
  }

  /**
   * The function to extract cookie according to the `networkType`.
   * @param key
   */
  public getCookie(key: string) {
    const cookieKey = `${this.networkType}_${key}`;
    const cookieArray = document.cookie.split(";");

    const foundCookie = cookieArray.find((cookieStr: string) =>
      cookieStr.includes(cookieKey)
    );

    if (foundCookie) {
      return foundCookie.split("=")[1];
    }

    return null;
  }
}

export type CookieProviderGetter = () => CookieProvider;
