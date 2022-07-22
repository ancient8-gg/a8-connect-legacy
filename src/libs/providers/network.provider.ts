import { BaseUrl, RegistryProvider } from "./registry.provider";

export type NetworkOptions = RequestInit;

export interface ErrorResponse {
  statusCode: string;
  path: string;
  errorType: string;
  errorMessage: string;
}

export class NetworkProvider {
  private readonly networkOptions: NetworkOptions;

  constructor(networkOptions: NetworkOptions) {
    this.networkOptions = networkOptions;
  }

  async request<T>(url: string, init?: NetworkOptions): Promise<T> {
    const instance = RegistryProvider.getInstance().fetch;
    const networkType = RegistryProvider.getInstance().networkType || null;

    const baseUrl = !!networkType ? BaseUrl[networkType] : "";
    const endpoint = `${baseUrl}/api${url}`;

    const initialSettings = {
      ...this.networkOptions,
      ...init,
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

export type NetworkProviderGetter = () => NetworkProvider;
