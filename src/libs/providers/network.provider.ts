import { BaseUrl, RegistryProvider } from "./registry.provider";

/**
 * Network options can be passed through `request` method or during object creation.
 */
export type NetworkOptions = RequestInit;

/**
 * Error message format.
 */
export interface ErrorResponse {
  /**
   * HTTP status code.
   */
  statusCode: string;
  /**
   * Error http path.
   */
  path: string;
  /**
   * Error type.
   */
  errorType: string;
  /**
   * Error message.
   */
  errorMessage: string;
}

/**
 * `NetworkProvider` provides infrastructure layer for every request calls.
 */
export class NetworkProvider {
  /**
   * Default network options. Can be passed during object creation.
   * @private
   */
  private readonly networkOptions: NetworkOptions;

  /**
   * Public constructor.
   * @param networkOptions
   */
  constructor(networkOptions: NetworkOptions) {
    this.networkOptions = networkOptions;
  }

  /**
   * Request method takes url as argument. Also has optional network `options`.
   * @param url
   * @param options
   */
  async request<T>(url: string, options?: NetworkOptions): Promise<T> {
    const instance = RegistryProvider.getInstance().fetch;
    const networkType = RegistryProvider.getInstance().networkType || null;

    const baseUrl = !!networkType ? BaseUrl[networkType] : "";
    const endpoint = `${baseUrl}/api${url}`;

    const initialSettings = {
      ...this.networkOptions,
      ...options,
    };

    const resp = await instance(endpoint, initialSettings);
    let jsonData = null;

    try {
      jsonData = await resp.json();
    } catch {}

    if (!resp.ok)
      throw new Error(
        `${(jsonData as ErrorResponse)?.errorMessage} - ERROR CODE: ${
          (jsonData as ErrorResponse)?.statusCode
        }`
      );
    return jsonData as T;
  }
}
