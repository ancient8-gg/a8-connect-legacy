import { FC, useMemo } from "react";
import { useLocation } from "../hooks/router";
import { useWallet } from "../hooks/useWallet";
import { ConnectButton } from "../components/WalletConnect.button";
import { CONNECT_WALLET_SCREEN_KEY } from "./connect-wallet.screen";
import { useSession } from "../hooks/useSession";
import { makeShorter } from "../utils";
import { BaseWalletAdapter, ChainType } from "../libs/adapters";

export const BASE_CONNECT_UID_SCREEN_KEY = "BASE_CONNECT_UID_SCREEN";

export const BaseConnectUIDScreen: FC = () => {
  const { chainType, getAdapters, setWalletName } = useWallet();
  const { userInfo } = useSession();
  const location = useLocation();

  const handleClickWallet = (walletName: string) => {
    setWalletName(walletName);
    location.push(CONNECT_WALLET_SCREEN_KEY);
  };

  const chainAdapter = useMemo<BaseWalletAdapter[]>(() => {
    const adapters = getAdapters();
    return adapters.filter((adapter) => adapter.chainType === ChainType.SOL);
  }, [chainType]);

  return (
    <div className="base-welcome-screen w-full pt-[30px]">
      <div className="mx-auto w-[350px]">
        <p className="text-center text-gray text-[20px] mt-[-25px] font-[100]">
          CONNECT WALLET TO APP
        </p>
        <div className="pt-[50px]">
          <p className="mx-auto text-[16px] text-center text-white">
            Currently logged into the UID:
            <span className="text-primary ml-[3px]">
              {makeShorter(userInfo?._id)}
            </span>
          </p>
          <p className="mx-auto text-[16px] text-center text-white mt-[5px]">
            Please connect to a Solana wallet below
          </p>
          <div className="pt-[40px]">
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
      </div>
    </div>
  );
};
