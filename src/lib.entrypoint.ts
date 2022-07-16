import { A8Connect, A8ConnectInitOptions } from "./lib.container";

let a8ConnectInstance: A8Connect;

/**
 * The function to get A8Connect instance
 */
export const getA8ConnectInstance = () => {
  if (!a8ConnectInstance) throw new Error("A8Connect isn't initialized");
  return a8ConnectInstance;
};

/**
 * Init an A8Connect instance.
 * The function has its own boundary context.
 * @param rootDOMId
 * @param options
 */
export const init = (rootDOMId: string, options: A8ConnectInitOptions) => {
  /**
   * Destroy the old node if possible
   */
  a8ConnectInstance?.destroy();

  /**
   * Initialize new instance
   */
  a8ConnectInstance = new A8Connect(rootDOMId);
  return a8ConnectInstance.init.call(a8ConnectInstance, options);
};

/**
 * The function to open modal
 */
export const openModal = () => {
  if (!a8ConnectInstance) throw new Error("A8Connect isn't initialized");
  return a8ConnectInstance.openModal.call(a8ConnectInstance);
};

/**
 * The function to close the modal
 */
export const closeModal = () => {
  if (!a8ConnectInstance) throw new Error("A8Connect isn't initialized");
  return a8ConnectInstance.closeModal.call(a8ConnectInstance);
};

/**
 * Now to expose to window context
 */
if (window) {
  const windowInstance = window as any;

  windowInstance.A8 = {};
  windowInstance.A8.A8Connect = A8Connect;
  windowInstance.A8.getA8ConnectInstance = getA8ConnectInstance;
  windowInstance.A8.init = init;
  windowInstance.A8.openModal = openModal;
  windowInstance.A8.closeModal = closeModal;
}

export default A8Connect;
export type { A8Connect, A8ConnectInitOptions } from "./lib.container";
export * from "./types";
