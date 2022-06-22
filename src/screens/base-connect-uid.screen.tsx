import React, { useMemo } from "react";
import * as Adapters from "../libs/adapters";
import { useLocation } from "../hooks/router";
import { useWallet } from "../hooks/useWallet";
import { ConnectButton } from "../components/WalletConnect.button";
import { CONNECT_WALLET_SCREEN_KEY } from "./connect-wallet.screen";

export const BASE_CONNECT_UID_SCREEN_KEY = "BASE_CONNECT_UID_SCREEN";

export const BaseConnectUIDScreen: React.FC = () => {
  const { chainType, getAdapters, setWalletName } = useWallet();
  const location = useLocation();

  const handleClickWallet = (walletName: string) => {
    setWalletName(walletName);
    location.push(CONNECT_WALLET_SCREEN_KEY);
  };

  const chainAdapter = useMemo<
    Adapters.AdapterInterface.BaseWalletAdapter[]
  >(() => {
    const adapters = getAdapters();
    return adapters.filter((adapter) => adapter.chainType === chainType);
  }, [chainType]);

  return (
    <div className="base-welcome-screen w-full pt-[30px]">
      <div className="mx-auto w-[350px]">
        <p className="text-center text-gray text-[20px] mt-[-25px] font-[100]">
          SOLANA
        </p>
        <div className="mx-auto w-[350px] pt-[20px]">
          <img
            src="/assets/images/sol-chain-preview.png"
            className="mx-auto w-[40px]"
          />
        </div>
        <div className="pt-[30px]">
          <p className="mx-auto text-primary text-[20px] font-bold text-center">
            Select wallet provider
          </p>
          <div className="pt-[20px]">
            {chainAdapter
              .sort((elm, elm2) => {
                return Number(elm2.isInstalled()) - Number(elm.isInstalled());
              })
              .map((adapter) => (
                <ConnectButton
                  key={`connect-button-${adapter.name}`}
                  adapter={adapter}
                  onClick={() => handleClickWallet(adapter.name)}
                />
              ))}
          </div>
        </div>
        <div className="bottom-container my-[30px]">
          <p className="text-center text-[14px] text-primary underline">
            <a href="https://ancient8.gg/profile/lost-wallet">
              Lost your wallet?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
