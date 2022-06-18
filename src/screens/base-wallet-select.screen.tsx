import React, { useMemo } from "react";
<<<<<<< HEAD
import { useLocation } from '../hooks/router/component';
import { useWallet } from '../hooks/useWallet';
import { ChainType } from '../libs/adapters/interface';
import { ConnectButton } from '../components/WalletConnect.button';
import { SIGN_WALLET_SCREEN_KEY } from '../screens/sign-wallet.screen';
import * as Adapters from '../libs/adapters';
=======
import { useWallet } from "../hooks/useWallet";
import { ChainType } from "../libs/adapters/interface";
import { ConnectButton } from "../components/WalletConnect.button";
import * as Adapters from "../libs/adapters";
>>>>>>> 0e13a194a3e1d33db499a3162fab5b66b3fb6deb

export const BASE_WALLET_SELECT_SCREEN_KEY = "BASE_WALLET_SELECT_SCREEN";

export const BaseWalletSelect: React.FC = () => {
<<<<<<< HEAD
  const { chainType, adapters, setWalletName } = useWallet();
  const location = useLocation();

  const handleSelectWalletName = (walletName: string) => {
    setWalletName(walletName);
    location.push(SIGN_WALLET_SCREEN_KEY);
  }

  const chainAdapter = useMemo<Adapters.AdapterInterface.BaseWalletAdapter[]>(() => {
=======
  const { chainType, getAdapters } = useWallet();

  const chainAdapter = useMemo<
    Adapters.AdapterInterface.BaseWalletAdapter[]
  >(() => {
    const adapters = getAdapters();
>>>>>>> 0e13a194a3e1d33db499a3162fab5b66b3fb6deb
    return adapters.filter((adapter) => adapter.chainType === chainType);
  }, [chainType]);

  return (
    <div className="base-welcome-screen w-full pt-[30px]">
      <div className="mx-auto w-[350px]">
        <p className="text-center text-gray text-[20px] mt-[-25px] font-[100]">
          {chainType === ChainType.EVM ? "EVM" : "SOLANA"}
        </p>
        <div className="mx-auto w-[350px] pt-[20px]">
          {chainType === ChainType.EVM ? (
            <img
              src="/assets/images/evm-chain-preview.png"
              className="mx-auto w-[260px] ml-[20%]"
            />
          ) : (
            <img
              src="/assets/images/sol-chain-preview.png"
              className="mx-auto w-[40px]"
            />
          )}
        </div>
        <div className="pt-[30px]">
          <p className="mx-auto text-primary text-[20px] font-bold text-center">
            Select wallet provider
          </p>
          <div className="pt-[20px]">
<<<<<<< HEAD
            {chainAdapter.sort((elm, elm2) => {
              return Number(elm2.isInstalled()) - Number(elm.isInstalled())
            }).map((adapter, index: number) => (
              <ConnectButton
                key={`connect-nutton-${adapter.name}-${index}`}
                adapter={adapter}
                onClick={() => handleSelectWalletName(adapter.name)}
              />
            ))}
=======
            {chainAdapter
              .sort((elm, elm2) => {
                return Number(elm2.isInstalled()) - Number(elm.isInstalled());
              })
              .map((adapter) => (
                <ConnectButton
                  key={`connect-nutton-${adapter.name}`}
                  adapter={adapter}
                />
              ))}
>>>>>>> 0e13a194a3e1d33db499a3162fab5b66b3fb6deb
          </div>
        </div>
      </div>
    </div>
  );
};
