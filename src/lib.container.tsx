import React from "react";
import ReactDOM from "react-dom";
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

export interface A8ConnectInitOptions {
  chainType: ChainType | "all";
  networkType: NetworkType;
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
  public init(options: A8ConnectInitOptions): () => void {
    const rootDOM = document.getElementById(this.rootSelectorId);

    // initialize registry first
    this.initializeRegistryAndSession(options);

    // render DOM
    if (rootDOM !== null) {
      ReactDOM.render(
        <A8ConnectContainer
          onAuth={this.onAuth.bind(this)}
          onConnected={this.onConnected.bind(this)}
          selectedChainType={options.chainType}
        />,
        rootDOM
      );
      return () => ReactDOM.unmountComponentAtNode(rootDOM);
    }

    // Or throw error
    throw new Error(`Root document #${this.rootSelectorId} not found`);
  }

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
