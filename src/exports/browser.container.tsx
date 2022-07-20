import { createRoot, Root } from "react-dom/client";

import A8ConnectContainer from "../container";
import { ChainType, SupportedWallets } from "../libs/adapters";
import { AppFlow } from "../components/router";
import { OnAuthPayload } from "../hooks/useSession";
import { getUtilsProvider } from "../libs/providers";
import { getAuthAction, getUserAction, getWalletAction } from "../libs/actions";
import { ConnectSessionDto, Entities, Providers } from "./types";

/**
 * A8Connect init explanations
 */
export interface A8ConnectInitOptions {
  /**
   * `chainType` select supported chains for dapps
   */
  chainType: ChainType;

  /**
   * `networkType` select supported cluster for dapps
   */
  networkType: Providers.NetworkType;

  /**
   * `withCredential` replace current jwt credential. Usually useful for `LOST_WALLET_FLOW` flow.
   */
  withCredential?: string;

  /**
   * `cleanWalletCache` to clean wallet cache.
   */
  cleanWalletCache?: boolean;

  /**
   * `disableCloseButton` to disable close button,
   * so the popup won't be able to be closed manually until user completes the onboarding flow.
   */
  disableCloseButton?: boolean;

  /**
   * `initAppFlow` select the initial flow, default will be Login/Connect Flow.
   */
  initAppFlow?: AppFlow;

  /**
   * `onClose` callback will be triggered when user complete onboarding flow or close the A8Connect popup
   */
  onClose?: () => void;

  /**
   * `onError` callback will be triggered when errors occur.
   */
  onError?: (error: Error) => void;

  /**
   * `onAuth` callback will be triggered when user is authenticated.
   * @param payload
   */
  onAuth?: (payload: OnAuthPayload) => void;

  /**
   * `onConnected` callback will be triggered when user connect to a wallet
   * @param payload
   */
  onConnected?: (payload: ConnectSessionDto.ConnectedWalletPayload) => void;
}

/**
 * A8Connect object class. The Ancient8 authentication will be handled and the session will be persisted inside this object.
 */
export class A8Connect {
  /**
   * Root node selector id
   * @private
   */
  private readonly rootSelectorId: string;

  /**
   * Root node
   * @private
   */
  private rootNode: Root | null = null;

  /**
   * Current available wallets that A8Connect supports.
   */
  public readonly availableWallets = SupportedWallets;

  /**
   * Current user session is initially set as null. After connecting wallet/login action, the `currentSession` will be available.
   */
  public currentSession: ConnectSessionDto.A8ConnectSession | null = null;

  /**
   * Init options for UID container.
   */
  public options: A8ConnectInitOptions | null = null;

  /**
   * Constructor to initialize the A8Connect Container
   * @param rootSelectorId: the id selector of the A8Connect Container DOM object.
   */
  constructor(rootSelectorId: string) {
    const rootDOM = document.getElementById(rootSelectorId);

    if (!rootDOM) {
      /**
       * Initialize dom node
       */
      const dom = document.createElement("div");
      dom.setAttribute("id", rootSelectorId);
      document.body.appendChild(dom);
    }

    this.rootSelectorId = rootSelectorId;
  }

  /**
   * The function to init the A8Connect session.
   * The session will be updated whenever connecting wallet/login actions occur.
   * @param options
   */
  public async init(options: A8ConnectInitOptions): Promise<void> {
    // binding options
    this.options = options;

    // initialize registry first
    await this.initializeRegistryAndSession();

    // restore the session if applicable
    await this.fetchSession();
  }

  /**
   * The function to open the UID modal
   */
  public openModal(): void {
    const options = this.options;
    /**
     * Initialize root node
     */
    this.initializeRootNode();

    /**
     * Now to render root node
     */
    this.rootNode.render(
      <A8ConnectContainer
        containerSelector={this.rootSelectorId}
        disableCloseButton={options.disableCloseButton}
        networkType={options.networkType}
        chainType={options.chainType}
        initAppFlow={options.initAppFlow}
        onError={options.onError}
        onClose={() => {
          options.onClose && options.onClose();
          this.closeModal();
        }}
        onAuth={(payload) => {
          this.onAuth(payload);
          options.onAuth && options.onAuth(payload);
        }}
        onConnected={(payload) => {
          this.onConnected(payload);
          options.onConnected && options.onConnected(payload);
        }}
      />
    );
  }

  /**
   * The function to replace credential.
   * Call this function to remove the old credential and replace with a new one.
   * Set parameter to null to delete current credential.
   * @param jwt
   */
  private async setCredential(jwt: string | null) {
    /**
     * Remove current credential
     */
    await this.currentSession.Auth.removeCredential();

    /**
     * Persist new credential
     */
    await this.currentSession.Auth.setCredential(jwt);
  }

  /**
   * The function to close modal.
   */
  closeModal(): void {
    this.destroy();
  }

  /**
   * The function to destroy root node.
   */
  public destroy() {
    /**
     * Unmount root node
     */
    this.rootNode?.unmount();
    this.rootNode = null;

    /**
     * Remove root element
     */
    document.getElementById(this.rootSelectorId)?.remove();
  }

  /**
   * The function to restore session if possible, can be fail-safe.
   * @public
   */
  public async fetchSession(): Promise<void> {
    /**
     * Restore wallet connection first
     */
    try {
      await getUtilsProvider().withTimeout<string>(
        this.currentSession.Wallet.restoreConnection.bind(
          this.currentSession.Wallet
        ),
        10000
      );
      const walletSession =
        await this.currentSession.Wallet.getConnectedSession();
      this.onConnected(walletSession);
    } catch {}

    /**
     * Now to restore UID session.
     */
    try {
      const userSession = await this.currentSession.User.getUserProfile();
      this.onAuth(userSession);
    } catch {}
  }

  /**
   * The function to initialize root node.
   * @private
   */
  private initializeRootNode() {
    this.rootNode = createRoot(document.getElementById(this.rootSelectorId));
  }

  /**
   * Initialize registry and session.
   * @private
   */
  private async initializeRegistryAndSession() {
    const options = this.options;
    const registryInstance = Providers.RegistryProvider.getInstance();

    /**
     * Initialize registry provider
     */
    registryInstance.networkType = options.networkType;
    registryInstance.document = window.document;
    registryInstance.fetch = window.fetch.bind(window);
    registryInstance.storage = window.localStorage;
    registryInstance.window = window;

    /**
     * Clean wallet cache.
     */
    if (!!options.cleanWalletCache) {
      getWalletAction().cleanWalletCache();
    }

    /**
     * Initialize session.
     */
    this.currentSession = {
      Auth: getAuthAction(),
      User: getUserAction(),
      Wallet: getWalletAction(),
      connectedWallet: null,
      sessionUser: null,
    };

    /**
     * Replace credential if needed
     */
    if (!!options.withCredential) {
      await this.setCredential(options.withCredential);
    }
  }

  /**
   * The function to be triggered after the authentication to grab the current session user.
   * @param payload
   * @private
   */
  private onAuth(payload: Entities.UserInfo | null): void {
    this.currentSession = {
      ...this.currentSession,
      sessionUser: payload,
    };
  }

  /**
   * The function to be triggered to grab the current connected wallet.
   * @param payload
   * @private
   */
  private onConnected(
    payload: ConnectSessionDto.ConnectedWalletPayload | null
  ): void {
    this.currentSession = {
      ...this.currentSession,
      connectedWallet: payload,
    };
  }
}
