import { encode } from "bs58";

/**
 * Utils provider provides utilities functions
 */
export class UtilsProvider {
  /**
   * The function to provide interval operation with setTimeout behind the scene.
   * @param handler
   * @param msec
   */
  public withInterval(handler: () => void | Promise<void>, msec: number) {
    /**
     * Stopped flag
     */
    let isStopped = false;

    /**
     * Construct handler
     */
    const timeOutHandler = () => {
      setTimeout(async () => {
        if (isStopped) return;

        await handler();
        await timeOutHandler();
      }, msec);
    };

    /**
     * Trigger handler
     */
    timeOutHandler();

    /**
     * The stop handler
     */
    return () => {
      isStopped = true;
    };
  }

  /**
   * The function to provide a wrapper to return null if the process duration exceeds a certain msec.
   * @param handler
   * @param msec
   */
  public withTimeout<Result>(
    handler: () => Result | Promise<Result>,
    msec: number
  ): Promise<Result | null> {
    return new Promise(async (resolve) => {
      /**
       * Assign a random value to make sure it's unique
       */
      const randomizeValue = this.randomize();
      let result: Result | string = randomizeValue;

      /**
       * Make a setTimeout to resolve the value
       */
      setTimeout(() => {
        /**
         * Compare the result to randomize value and return null.
         */
        if (result === randomizeValue) {
          console.log(`Process exceeded ${msec} ms and returned null.`);
          return resolve(null);
        }
      }, msec);

      /**
       * Assign the expected returned value
       */
      result = await handler();

      return resolve(result);
    });
  }

  /**
   * The function to collapse the wallet address shorter
   * @param walletAddress
   */
  public makeWalletAddressShorter(walletAddress: string) {
    return `${walletAddress?.substring(0, 5)}...${walletAddress?.substring(
      walletAddress.length - 3,
      walletAddress.length
    )}`;
  }

  /**
   * The function to randomize a string based on base58 hash algorithm
   */
  public randomize(): string {
    const seed = new Date().getUTCMilliseconds().toString();
    return encode(new TextEncoder().encode(seed));
  }
}
