import { BaseUrl, NetworkType } from "./registry.provider";

export type NetworkOptions = {
  networkType?: NetworkType;
} & RequestInit;

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
    const endpoint = `${baseUrl}${url}`;

    const initialSettings = {
      ...this.networkOptions,
      ...init,
    };

    delete initialSettings.networkType;

    if (
      !init.body &&
      (initialSettings.headers as Record<string, string>)["Content-Type"] !==
        "multipart/form-data"
    ) {
      delete (initialSettings.headers as Record<string, string>)[
        "Content-Type"
      ];
    }

    const resp = await this.instance(endpoint, initialSettings);
    return (await resp.json()) as T;
  }
}

export type NetworkProviderGetter = () => NetworkProvider;
