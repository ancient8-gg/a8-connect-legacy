import { useCallback } from "react";
import { Adapter, SignData } from "@/libs/dto/entities";

export const useBinanceWallet = (): Adapter => {
  const binanceChainProvider = (window as any).BinanceChain as any;

  const isInstalled = useCallback(() => {
    return !!binanceChainProvider;
  }, []);

  const connect = useCallback(async () => {
    if (!isInstalled) return false;

    try {
      await binanceChainProvider.request({ method: "eth_requestAccounts" });
      return true;
    } catch {
      return false;
    }
  }, [isInstalled]);

  const disconnect = useCallback(() => {
    if (!binanceChainProvider) return;
  }, []);

  const getWalletAddress = useCallback(async () => {
    const [walletAddress] = await binanceChainProvider.request({
      method: "eth_accounts",
    });
    return walletAddress;
  }, [connect, disconnect]);

  const sign = useCallback(async (message: string) => {
    const currentWalletAddress = await getWalletAddress();
    const { signature } = await binanceChainProvider.bnbSign(
      currentWalletAddress, message
    );

    return {
      signature,
      walletAddress: currentWalletAddress,
    };
  },
    [connect, getWalletAddress]
  );

  return {
    connect,
    disconnect,
    sign,
    getWalletAddress,
    isInstalled,
  };
};
