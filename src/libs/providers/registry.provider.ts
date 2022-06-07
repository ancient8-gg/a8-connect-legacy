export enum NetworkType {
  mainnet = "mainnet",
  testnet = "testnet",
}

export type RegistryOptions = {
  network: NetworkType;
};

export const BaseUrl = {
  [NetworkType.testnet]: "https://web-dev.ancient8.gg/profile/api",
  [NetworkType.mainnet]: "https://ancient8.gg/profile/api",
};

/**
 * The singleton instance that stores the global configuration of A8Connect
 */
export class RegistryProvider {
  /**
   * Singleton described as a public and static property.
   */
  public static instance: RegistryProvider | null = null;

  /**
   * Network type is stored at private.
   * @private
   */
  private network: NetworkType = NetworkType.mainnet;

  /**
   * Getter to get the value of network type.
   */
  getNetworkType(): NetworkType {
    return this.network;
  }

  /**
   * Setter to set the value of network type.
   * @param type
   */
  setNetworkType(type: NetworkType): void {
    this.network = type;
  }

  /**
   * Public static method to get the singleton instance.
   */
  public static getInstance(): RegistryProvider {
    if (this.instance === null) {
      this.instance = new RegistryProvider();
    }

    return this.instance;
  }
}
