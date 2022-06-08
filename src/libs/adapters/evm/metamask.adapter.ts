import { Adapter } from '@/libs/dto/entities';
import { useCallback } from "react";
import { ethers } from "ethers";

export const useMetamaskWallet = (): Adapter => {
  const metamaskProvider =
    ((window as any).ethereum as any).providers?.find(
      (provider: any) => provider.isMetaMask === true
    ) ||
    (window as any).ethereum
    ;

  const isInstalled = useCallback(() => {
    return !!metamaskProvider && metamaskProvider.isMetaMask === true;
  }, []);

  const connect = useCallback(async () => {
    if (!isInstalled()) {
      return false;
    }

    try {
      await metamaskProvider.request({ method: "eth_requestAccounts" });
      return true;
    } catch {
      return false;
    }
  }, [isInstalled]);

  const getWalletAddress = useCallback(async () => {
    const [address] = await metamaskProvider.request({ method: 'eth_accounts' });
    return address || null;
  }, []);

  const disconnect = useCallback(async () => {
    // There is no function to trigger disconnect metamask yet.
    // Need to wait for further changes as of now.
    // https://github.com/MetaMask/metamask-extension/issues/8990
  }, []);


  const sign = useCallback(async (message: string) => {
    const currentWalletAddress = await getWalletAddress();
    const provider = new ethers.providers.Web3Provider(metamaskProvider);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);

    return {
      signature,
      walletAddress: currentWalletAddress
    }

  }, [connect, getWalletAddress]);

  return {
    sign,
    connect,
    disconnect,
    getWalletAddress,
    isInstalled,
  };
}