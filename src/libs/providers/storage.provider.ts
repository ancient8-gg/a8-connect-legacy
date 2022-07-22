/**
 * Storage Provider to store the desired values
 */
import { BaseUrl, RegistryProvider } from "./registry.provider";

export class StorageProvider {
  /**
   * The function to get the value with an associated key, is prefixed with `networkType`. Will support returning default value.
   * @param key
   * @param defaultValue
   */
  public getItem(
    key: string,
    defaultValue: string | null = null
  ): string | null {
    const networkType = RegistryProvider.getInstance().networkType;
    const storageInstance = RegistryProvider.getInstance().storage;

    const prefix = BaseUrl[networkType];
    return storageInstance.getItem(`${prefix}_${key}`) || defaultValue;
  }

  /**
   * The function to set the value with an associated key, is prefixed with `networkType`.
   * @param key
   * @param value
   */
  public setItem(key: string, value: string): void {
    const networkType = RegistryProvider.getInstance().networkType;
    const storageInstance = RegistryProvider.getInstance().storage;

    const prefix = BaseUrl[networkType];
    return storageInstance.setItem(`${prefix}_${key}`, value);
  }

  /**
   * The function to remove the value with an associated key, is prefixed with `networkType`.
   * @param key
   */
  public removeItem(key: string): void {
    const networkType = RegistryProvider.getInstance().networkType;
    const storageInstance = RegistryProvider.getInstance().storage;

    const prefix = BaseUrl[networkType];
    return storageInstance.removeItem(`${prefix}_${key}`);
  }
}

export type StorageProviderGetter = () => StorageProvider;
