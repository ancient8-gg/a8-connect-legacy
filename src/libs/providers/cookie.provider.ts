import { BaseUrl, RegistryProvider } from "./registry.provider";

/**
 * Cookie provider that handle all the stuffs related to cookie.
 */
export class CookieProvider {
  /**
   * The function to extract cookie according to the `networkType`.
   * @param key
   * @param defaultValue
   */
  public getCookie(key: string, defaultValue?: string): string | null {
    const networkType = RegistryProvider.getInstance().networkType;
    const document = RegistryProvider.getInstance().document;

    const cookieKey = `${BaseUrl[networkType]}_${key}`;

    try {
      const cookieArray = document.cookie.split(";");

      const foundCookie = cookieArray.find((cookieStr: string) =>
        cookieStr.includes(cookieKey)
      );

      if (foundCookie) {
        return foundCookie.split("=")[1];
      }

      return defaultValue || null;
    } catch {}

    return defaultValue || null;
  }
}

export type CookieProviderGetter = () => CookieProvider;
