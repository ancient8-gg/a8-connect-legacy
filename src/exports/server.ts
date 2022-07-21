import {
  A8ServerConnectInitOptions,
  A8ServerConnect,
} from "./server.container";

let a8ServerConnectInstance: A8ServerConnect;

/**
 * The function to get A8ServerConnect instance
 */
export const getA8ServerConnectInstance = () => {
  if (!a8ServerConnectInstance)
    throw new Error("A8ServerConnect isn't initialized");
  return a8ServerConnectInstance;
};

/**
 * Init an A8ServerConnect instance.
 * The function has its own boundary context.
 * @param options
 */
export const init = (options: A8ServerConnectInitOptions) => {
  /**
   * Initialize new instance
   */
  a8ServerConnectInstance = new A8ServerConnect();
  return a8ServerConnectInstance.init.call(a8ServerConnectInstance, options);
};

export default A8ServerConnect;

export type {
  A8ServerConnectInitOptions,
  A8ServerConnect,
} from "./server.container";

export * from "./server.types";
