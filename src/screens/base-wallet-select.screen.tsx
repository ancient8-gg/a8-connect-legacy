import { FC, useMemo } from "react";
import { useWallet } from "../hooks/useWallet";
import { ConnectButton } from "../components/WalletConnect.button";
import { CONNECT_WALLET_SCREEN_KEY } from "./connect-wallet.screen";
import EvmChainPreviewIcon from "../assets/images/evm-chain-preview.png";
import SolChainPreviewIcon from "../assets/images/sol-chain-preview.png";
import { BaseWalletAdapter, ChainType } from "../libs/adapters";
import { useSession } from "../hooks/useSession";
import { SdkMethod } from "../libs/dto/entities";
import { makeShorter } from "../utils";
import { useLocation } from "../components/router";

export const BASE_WALLET_SELECT_SCREEN_KEY = "BASE_WALLET_SELECT_SCREEN";

export const BaseWalletSelect: FC = () => {
  const { chainType, getAdapters, setWalletName } = useWallet();
  const { userInfo, sdkMethod } = useSession();
  const location = useLocation();

  const handleClickWallet = (walletName: string) => {
    setWalletName(walletName);
    location.push(CONNECT_WALLET_SCREEN_KEY);
  };

  const chainAdapter = useMemo<BaseWalletAdapter[]>(() => {
    const adapters = getAdapters();
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
              src={EvmChainPreviewIcon}
              className="mx-auto w-[260px] ml-[20%]"
            />
          ) : (
            <img src={SolChainPreviewIcon} className="mx-auto w-[40px]" />
          )}
        </div>

        {sdkMethod === SdkMethod.connect && (
          <p className="mx-auto text-[16px] text-center text-white">
            Currently logged into the UID:
            <span className="text-primary ml-[3px]">
              {makeShorter(userInfo?._id)}
            </span>
          </p>
        )}

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
