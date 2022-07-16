/**
 * SDK's supported onboarding flows
 */
export enum AppFlow {
  /**
   * Login flow. This is the default flow when `A8Connect.init()` is called without specific `initAppFlow`.
   */
  LOGIN_FLOW = "LOGIN_FLOW",

  /**
   * Enable this flow to onboard user to add new wallet to the UID.
   */
  ADD_WALLET_FLOW = "ADD_WALLET_FLOW",

  /**
   * Enable this flow to onboard users recovering their wallets.
   */
  LOST_WALLET_FLOW = "LOST_WALLET_FLOW",

  /**
   * Hidden flow. To onboard users to connect their wallet to the UID.
   */
  CONNECT_FLOW = "CONNECT_FLOW",

  /**
   * Hidden flow.
   */
  BUFFER_FLOW = "BUFFER_FLOW",
}
