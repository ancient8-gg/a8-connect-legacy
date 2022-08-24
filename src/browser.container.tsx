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
   * Enable `forceConnectWallet` to force connecting wallet regardless the wallet is connected or not.
   */
  forceConnectWallet?: boolean;

  /**
   * `withCredential` replace current jwt credential. Usually useful for `LOST_WALLET_FLOW` flow.
   */
  withCredential?: string;

  /**
   * `cleanWalletCache` to clean wallet cache. Enable this option to force open Connect Wallet popup since the wallet cache is disabled.
   */
  cleanWalletCache?: boolean;

  /**
   * `disableCloseButton` to disable close button,
   * so the popup won't be able to be closed manually until user completes the onboarding flow.
   */
  disableCloseButton?: boolean;

  /**
   * `initAppFlow` select the initial onboarding flow, default will be Login/Connect Flow.
   */
  initAppFlow?: AppFlow;

  /**
   * `onClose` callback will be triggered when user complete onboarding flow or close the A8Connect popup.
   */
  onClose?: () => void;

  /**
   * `onError` callback will be triggered when errors occur during the onboarding flow.
   */
  onError?: (error: Error) => void;

  /**
   * `onAuth` callback will be triggered when user is authenticated during the onboarding flow.
   * @param payload
   */
  onAuth?: (payload: OnAuthPayload) => void;

  /**
   * `onConnected` callback will be triggered when user connect to a wallet during the onboarding flow.
   * @param payload
   */
  onConnected?: (payload: ConnectedWalletPayload) => void;

  /**
   * `onLoggedOut` callback will be triggered when user logged out from the current session during the onboarding flow.
   */
  onLoggedOut?: () => void;

  /**
   * `onDisconnected` callback will be triggered when user disconnected the wallet during the onboarding flow. Currently, only Lost Wallet flow emits this event.
   */
  onDisconnected?: () => void;
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

    /**
     * Initialize session
     */
    this.initializeSession();

    /**
     * Update registry and credentials
     */
    this.initializeRegistry();

    /**
     * Try to restore the session if possible
     */
    await this.fetchSession(!!options.forceConnectWallet);
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
        onDisconnected={this.onDisconnected.bind(this)}
        onLoggedOut={this.onLoggedOut.bind(this)}
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
   * Normally the function won't connect if user has disconnected the wallet from DApp.
   * Enable `forceConnectWallet` to bypass and try to connect regardless the wallet is connected or not.
   *
   * @param forceConnectWallet
   * @public
   */
  public async fetchSession(forceConnectWallet = false): Promise<void> {
    /**
     * Raise error if session isn't initialized
     */
    if (!this.currentSession) throw new Error("Session isn't initialized");

    /**
     * Unset session if fetch session cannot be restored.
     */
    this.currentSession.sessionUser = null;
    this.currentSession.connectedWallet = null;

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
        () =>
          this.currentSession.Wallet.restoreConnection.bind(
            this.currentSession.Wallet
          )(forceConnectWallet),
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
   * Construct session
   * @private
   */
  private initializeSession(): void {
    /**
     * Initialize session.
     */
    this.currentSession = {
      Auth: getAuthAction({ reInit: true }),
      User: getUserAction({ reInit: true }),
      Wallet: getWalletAction({ reInit: true }),
      connectedWallet: null,
      sessionUser: null,
    };
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
  private initializeRegistry() {
    /**
     * Raise error if session isn't initialized
     */
    if (!this.currentSession) throw new Error("Session isn't initialized");

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
      this.currentSession.Wallet.cleanWalletCache();
    }

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
     * Return false if current session isn't available
     */
    if (!this.currentSession) return false;

    /**
     * Check whether the current wallet state is valid
     */
    const authEntities =
      (await this.currentSession.User.getAuthEntities()) || [];

    return this.currentSession.Wallet.isWalletStateValid(
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
   * The function to be triggered whenever use logged out from the current UID session.
   * @private
   */
  private onLoggedOut(): void {
    this.currentSession = {
      ...this.currentSession,
      sessionUser: null,
    };

    const options = this.options;
    options.onLoggedOut && options.onLoggedOut();
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

  /**
   * The function to be triggered whenever use disconnected wallet.
   * @private
   */
  private onDisconnected(): void {
    this.currentSession = {
      ...this.currentSession,
      connectedWallet: null,
    };

    const options = this.options;
    options.onDisconnected && options.onDisconnected();
  }
}
