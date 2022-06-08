import { Adapter } from "@/libs/dto/entities";
import { useCallback } from "react";
import { ethers } from "ethers";

export const useCoin98Wallet = (): Adapter => {
  const coin98Provider = (window as any).coin98?.provider as any;

  const isInstalled = useCallback(() => {
    return !!coin98Provider;
  }, []);

  const connect = useCallback(async () => {
    if (!isInstalled()) {
      return false;
    }

    try {
      await coin98Provider.request({ method: "eth_requestAccounts" });
      return true;
    } catch {
      return false;
    }
  }, [isInstalled]);

  const getWalletAddress = useCallback(async () => {
    const [address] = await coin98Provider.request({ method: "eth_accounts" });
    return address || null;
  }, []);

  const disconnect = useCallback(async () => {
    if (!coin98Provider) return;
    await coin98Provider.disconnect();
  }, []);

  const sign = useCallback(async (message: string) => {
    const currentWalletAddress = await getWalletAddress();
    const provider = new ethers.providers.Web3Provider(coin98Provider);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);

    return {
      signature: signature,
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
