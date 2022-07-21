/**
 * Network cluster that SDK supports.
 */
export enum NetworkType {
  /**
   * Mainnet network cluster. Endpoint is located https://ancient8.gg/profile/api/.
   */
  mainnet = "mainnet",
  /**
   * Testnet network cluster. Endpoint is located https://ancient8.dev/profile/api.
   */
  testnet = "testnet",
}

export const BaseUrl = {
  [NetworkType.testnet]: "https://ancient8.dev/profile",
  [NetworkType.mainnet]: "https://ancient8.gg/profile",
};

export type Window = typeof window & { [key: string]: any };
export type ExternalContext = any;

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
  private _networkType: NetworkType = NetworkType.mainnet;

  /***
   * Storage instance. Should be set inside the React hooks.
   * @private
   */
  private _storage: Storage;

  /**
   * Document instance. Should be set inside the React hooks.
   * @private
   */
  private _document: Document;

  /**
   * `fetch` instance. Should be set inside the React hooks.
   * @private
   */
  private _fetch: typeof window.fetch;

  /**
   * Window instance
   * @private
   */
  private _window: Window;

  /**
   * `Storage` getter.
   */
  get storage(): Storage {
    return this._storage;
  }

  /**
   * `Storage` setter.
   * @param value
   */
  set storage(value: Storage) {
    this._storage = value;
  }

  /**
   * `Document` getter
   */
  get document(): Document {
    return this._document;
  }

  /**
   * `Document` setter
   * @param value
   */
  set document(value: Document) {
    this._document = value;
  }

  /**
   * `NetworkType` getter
   */
  get networkType(): NetworkType {
    return this._networkType;
  }

  /**
   * `NetworkType` setter
   * @param value
   */
  set networkType(value: NetworkType) {
    this._networkType = value;
  }

  /**
   * `fetch` getter
   */
  get fetch(): typeof fetch {
    return this._fetch;
  }

  /**
   * `fetch` setter
   * @param value
   */
  set fetch(value: typeof fetch) {
    this._fetch = value;
  }

  /**
   * window instance
   */
  get window(): Window {
    return this._window;
  }

  /**
   * set window instance
   * @param value
   */
  set window(value: Window) {
    this._window = value;
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

  /**
   * Initialize browser registry
   */
  public static initializeBrowserRegistry(
    window: ExternalContext,
    document: ExternalContext,
    fetch: ExternalContext,
    storage: ExternalContext
  ): void {
    const registryInstance = RegistryProvider.getInstance();

    registryInstance.window = window;
    registryInstance.document = document;
    registryInstance.fetch = fetch.bind(window);
    registryInstance.storage = storage;
  }

  /**
   * Initialize server registry
   */
  public static initializeServerRegistry(
    global: ExternalContext,
    fetch: ExternalContext,
    storage: ExternalContext
  ): void {
    const registryInstance = RegistryProvider.getInstance();

    registryInstance.fetch = fetch.bind(global);
    registryInstance.storage = storage;
  }
}
