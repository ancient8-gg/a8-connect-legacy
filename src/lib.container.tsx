import { render, unmountComponentAtNode } from "react-dom";
import A8ConnectContainer from "./container";

import { ChainType, SupportedWallets } from "./libs/adapters";
import {
  A8ConnectSession,
  ConnectedWalletPayload,
  NetworkType,
  RegistryProvider,
  UserInfo,
} from "./types";
import { getAuthAction, getUserAction, getWalletAction } from "./libs/actions";
import { OnAuthPayload } from "./hooks/useSession";

export interface A8ConnectInitOptions {
  chainType: ChainType;
  networkType: NetworkType;
  onClose?: () => void;
  onError?: (error: Error) => void;
  onAuth?: (payload: OnAuthPayload) => void;
  onConnected?: (payload: ConnectedWalletPayload) => void;
}

/**
 * A8Connect object class. The Ancient8 authentication will be handled and the session will be persisted inside this object.
 */
export class A8Connect {
  /**
   * The selector id to determine the root DOM node.
   * @private
   */
  private readonly rootSelectorId: string;

  /**
   * Current available wallets that A8Connect supports.
   */
  public readonly availableWallets = SupportedWallets;

  /**
   * Current user session is initially set as null. After connecting wallet/login action, the `currentSession` will be available.
   */
  public currentSession: A8ConnectSession | null = null;

  /**
   * Constructor to initialize the A8Connect Container
   * @param rootSelectorId: the id selector of the A8Connect Container DOM object.
   */
  constructor(rootSelectorId: string) {
    this.rootSelectorId = rootSelectorId;
  }

  /**
   * The function to open the A8 Connect Modal.
   * The returned value will be the function to close the modal.
   * Consequently, the session will be stored inside the A8ConnectContainer after connecting wallet/login action.
   * @param options
   */
  public async init(options: A8ConnectInitOptions): Promise<{
    openModal: () => void;
    closeModal: () => void;
  }> {
    const rootDOM = document.getElementById(this.rootSelectorId);

    // initialize registry first
    this.initializeRegistryAndSession(options);

    // restore the session if applicable
    await this.restoreSession();

    // render DOM
    if (rootDOM !== null) {
      return {
        closeModal: () => unmountComponentAtNode(rootDOM),
        openModal: () =>
          render(
            <A8ConnectContainer
              onError={options.onError}
              onClose={options.onClose}
              onAuth={(payload) => {
                this.onAuth(payload);
                options.onAuth && options.onAuth(payload);
              }}
              onConnected={(payload) => {
                this.onConnected(payload);
                options.onConnected && options.onConnected(payload);
              }}
              selectedChainType={options.chainType}
            />,
            rootDOM
          ),
      };
    }

    // Or throw error
    throw new Error(`Root document #${this.rootSelectorId} not found`);
  }

  /**
   * The function to restore session if possible, can be fail-safe
   * @private
   */
  private async restoreSession(): Promise<void> {
    /**
     * Restore wallet connection first
     */
    try {
      await this.currentSession.Wallet.restoreConnection();
      const walletSession =
        await this.currentSession.Wallet.getConnectedSession();
      this.onConnected(walletSession);
    } catch {}

    /**
     * Now to restore UID session
     */
    try {
      const userSession = await this.currentSession.User.getUserProfile();
      this.onAuth(userSession);
    } catch {}
  }

  /**
   * Initialize registry and session
   * @param options
   * @private
   */
  private initializeRegistryAndSession(options: A8ConnectInitOptions) {
    const registryInstance = RegistryProvider.getInstance();

    /**
     * Initialize network type
     */
    registryInstance.networkType = options.networkType;

    /**
     * Initialize session
     */
    this.currentSession = {
      Auth: getAuthAction(),
      User: getUserAction(),
      Wallet: getWalletAction(),
      connectedWallet: null,
      sessionUser: null,
    };
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
  }

  /**
   * The function to be triggered to grab the current connected wallet.
   * @param payload
   * @private
   */
  private onConnected(payload: ConnectedWalletPayload | null): void {
    this.currentSession = {
      ...this.currentSession,
      connectedWallet: payload,
    };
  }
}
