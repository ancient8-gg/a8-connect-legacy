import { BaseUrl, NetworkType } from "./registry.provider";

export type NetworkOptions = {
  networkType?: NetworkType;
} & RequestInit;

export interface ErrorResponse {
  statusCode: string;
  path: string;
  errorType: string;
  errorMessage: string;
}

export class NetworkProvider {
  private readonly instance: typeof fetch;
  private readonly networkOptions: NetworkOptions;

  constructor(fetchInstance: typeof fetch, networkOptions: NetworkOptions) {
    this.instance = fetchInstance;
    this.networkOptions = networkOptions;
  }

  async request<T>(url: string, init?: NetworkOptions): Promise<T> {
    const networkType =
      init?.networkType || this.networkOptions.networkType || null;

    const baseUrl = !!networkType ? BaseUrl[networkType] : "";
    const endpoint = `${baseUrl}/api${url}`;

    const initialSettings = {
      ...this.networkOptions,
      ...init,
    };

    delete initialSettings.networkType;

    const resp = await this.instance(endpoint, initialSettings);
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
