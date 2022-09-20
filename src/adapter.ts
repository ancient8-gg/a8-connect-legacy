import { RPCWalletAdapter } from "./adapter.cointainer";

/**
 * Export default RPCWalletAdapter.
 */
export default RPCWalletAdapter;
export * as Types from "./adapter.types";

/**
 * Now to expose to window context
 */
if (window) {
  const windowInstance = window as any;

  /**
   * Initialize A8 object if needed.
   */
  if (!windowInstance.A8 || Object.keys(windowInstance.A8).length === 0) {
    windowInstance.A8 = {};
  }

  /**
   * Binding Solana wallet getters.
   */
  windowInstance.A8.getSolanaWalletAdapter =
    RPCWalletAdapter.getSolanaWalletAdapter;

  /**
   * Binding EVM wallet getters.
   */
  windowInstance.A8.getEVMWalletAdapter = RPCWalletAdapter.getEVMWalletAdapter;
}
