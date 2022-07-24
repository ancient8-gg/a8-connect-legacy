import { createRoot, Root } from "react-dom/client";

import A8ConnectContainer from "./container";
import { ChainType, SupportedWallets } from "./libs/adapters";
import { AppFlow } from "./components/router";
import { OnAuthPayload } from "./hooks/useSession";
import {
  getUtilsProvider,
  NetworkType,
  RegistryProvider,
} from "./libs/providers";
import { getAuthAction, getUserAction, getWalletAction } from "./libs/actions";
import {
  A8ConnectSession,
  ConnectedWalletPayload,
} from "./libs/dto/a8-connect-session.dto";
import { UserInfo } from "./libs/dto/entities";

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
  networkType: NetworkType;

  /**
   * `globalContext` provide window context. Sometimes you need to directly pass `window` when init `A8Connect`.
   */
  globalContext?: typeof window;

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
  onConnected?: (payload: ConnectedWalletPayload) => void;
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
  public currentSession: A8ConnectSession | null = null;

  /**
   * Init options for UID container.
   */
  public options: A8ConnectInitOptions | null = null;

  /**
   * Constructor to initialize the A8Connect Container
   * @param rootSelectorId: the id selector of the A8Connect Container DOM object.
   */
  public constructor(rootSelectorId: string) {
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

    /**
     * Get window context or fallback to default window.
     */
    const windowContext = options.globalContext || window;

    /**
     * Initialize base registry first
     */
    RegistryProvider.initializeBrowserRegistry(
      windowContext,
      windowContext.document,
      windowContext.fetch,
      windowContext.localStorage
    );

    /**
     * Then initialize root selector
     */
    this.initializeRootSelector();

    // initialize registry first
    this.initializeSession();

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
        onClose={this.closeModal.bind(this)}
        onAuth={this.onAuth.bind(this)}
        onConnected={this.onConnected.bind(this)}
      />
    );
  }

  /**
   * The function to close modal.
   */
  public closeModal(): void {
    const options = this.options;
    options.onClose && options.onClose();

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
    const document = RegistryProvider.getInstance().document;
    document.getElementById(this.rootSelectorId)?.remove();
  }

  /**
   * The function to restore session if possible, can be fail-safe.
   * @public
   */
  public async fetchSession(): Promise<void> {
    /**
     * Now to restore UID session.
     */
    try {
      const userSession = await this.currentSession.User.getUserProfile();
      this.onAuth(userSession);
    } catch {}

    /**
     * Restore wallet connection first
     */
    try {
      /**
       * Execute restoring connection with timeout handler.
       */
      await getUtilsProvider().withTimeout<string>(
        this.currentSession.Wallet.restoreConnection.bind(
          this.currentSession.Wallet
        ),
        10000
      );

      /**
       * get wallet session.
       */
      const walletSession =
        await this.currentSession.Wallet.getConnectedSession();

      /**
       * Emit connected session.
       */
      if (await this.isWalletStateValid()) {
        await this.onConnected(walletSession);
      }
    } catch {}
  }

  /**
   * Initialize root selector
   * @private
   */
  private initializeRootSelector(): void {
    const document = RegistryProvider.getInstance().document;

    const rootDOM = document.getElementById(this.rootSelectorId);

    if (!rootDOM) {
      /**
       * Initialize dom node
       */
      const dom = document.createElement("div");
      dom.setAttribute("id", this.rootSelectorId);
      document.body.appendChild(dom);
    }
  }

  /**
   * The function to replace credential.
   * Call this function to remove the old credential and replace with a new one.
   * Set parameter to null to delete current credential.
   * @param jwt
   */
  private setCredential(jwt: string | null) {
    /**
     * Remove current credential
     */
    this.currentSession.Auth.removeCredential();

    /**
     * Persist new credential
     */
    this.currentSession.Auth.setCredential(jwt);
  }

  /**
   * The function to initialize root node.
   * @private
   */
  private initializeRootNode() {
    const document = RegistryProvider.getInstance().document;
    this.rootNode = createRoot(document.getElementById(this.rootSelectorId));
  }

  /**
   * Initialize registry and session.
   * @private
   */
  private initializeSession() {
    const options = this.options;
    const registryInstance = RegistryProvider.getInstance();

    /**
     * Initialize registry provider
     */
    registryInstance.networkType = options.networkType;

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
      this.setCredential(options.withCredential);
    }
  }

  /**
   * The function to check whether the wallet state is valid
   * @private
   */
  private async isWalletStateValid(): Promise<boolean> {
    const options = this.options;

    /**
     * Check whether the current wallet state is valid
     */
    const authEntities =
      (await this.currentSession?.User.getAuthEntities()) || [];

    return this.currentSession?.Wallet.isWalletStateValid(
      authEntities,
      options.chainType
    );
  }

  /**
   * The function to be triggered after the authentication to grab the current session user.
   * @param payload
   * @private
   */
  private onAuth(payload: UserInfo | null): void {
    this.currentSession = {
      ...this.currentSession,
      sessionUser: payload,
    };

    const options = this.options;
    options.onAuth && options.onAuth(payload);
  }

  /**
   * The function to be triggered to grab the current connected wallet.
   * @param payload
   * @private
   */
  private onConnected(payload: ConnectedWalletPayload | null): void {
    /**
     * If wallet state is valid, emit listener.
     */
    this.currentSession = {
      ...this.currentSession,
      connectedWallet: payload,
    };

    const options = this.options;
    options.onConnected && options.onConnected(payload);
  }
}
