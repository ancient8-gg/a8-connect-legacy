/**
 * Storage Provider to store the desired values
 */
import { BaseUrl, NetworkType } from "./registry.provider";
import { NetworkProvider } from "./network.provider";

export class StorageProvider {
  /**
   * storageInstance is set as private
   * @private
   */
  private storageInstance: Storage;

  /**
   * Network type which is prefixed when extracting cookie value.
   * @private
   */
  private readonly networkType: NetworkType;

  /**
   * Constructor needs `Storage` object as a parameter
   * @param storage
   * @param networkType
   */
  constructor(storage: Storage, networkType: NetworkType) {
    this.storageInstance = storage;
    this.networkType = networkType;
  }

  /**
   * The function to get the value with an associated key, is prefixed with `networkType`. Will support returning default value.
   * @param key
   * @param defaultValue
   */
  public getItem(
    key: string,
    defaultValue: string | null = null
  ): string | null {
    const prefix = BaseUrl[this.networkType];
    return this.storageInstance.getItem(`${prefix}${key}`) || defaultValue;
  }

  /**
   * The function to set the value with an associated key, is prefixed with `networkType`.
   * @param key
   * @param value
   */
  public setItem(key: string, value: string): void {
    const prefix = BaseUrl[this.networkType];
    return this.storageInstance.setItem(`${prefix}${key}`, value);
  }
}

export type StorageProviderGetter = () => StorageProvider;
