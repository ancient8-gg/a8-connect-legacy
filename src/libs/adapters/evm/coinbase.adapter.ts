import { Adapter } from "@/libs/dto/entities";
import { useCallback } from "react";
import { hexlify } from "@ethersproject/bytes";
import { toUtf8Bytes } from "@ethersproject/strings";

export const useCoinbaseWallet = (): Adapter => {
  const coinbaseProvider = (window as any).coinbaseWalletExtension as any;

  const isInstalled = useCallback(() => {
    return !!coinbaseProvider;
  }, []);

  const connect = useCallback(async () => {
    if (!isInstalled()) {
      return false;
    }

    try {
      await coinbaseProvider.request({ method: "eth_requestAccounts" });
      return true;
    } catch {
      return false;
    }

  }, [isInstalled]);

  const getWalletAddress = useCallback(async () => {
    const [address] = await coinbaseProvider.request({ method: "eth_accounts" });
    return address || null;
  }, []);

  const disconnect = useCallback(async () => {
    if (!coinbaseProvider) return;
    await coinbaseProvider.disconnect();
  }, []);

  const sign = useCallback(async (message: string) => {
    const currentWalletAddress = await getWalletAddress();
    const signature = await coinbaseProvider.request({
      method: 'personal_sign',
      params: [
        hexlify(toUtf8Bytes(message)),
        currentWalletAddress.toLowerCase(),
      ]
    });

    return {
      signature,
      walletAddress: currentWalletAddress,
    };
  },
    [connect, getWalletAddress]
  );

  return {
    sign,
    connect,
    disconnect,
    getWalletAddress,
    isInstalled,
  };
};
