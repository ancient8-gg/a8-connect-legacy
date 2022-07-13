import { FC, useCallback, useMemo } from "react";
import { useWallet } from "../hooks/useWallet";
import { CONNECT_WALLET_SCREEN_KEY } from "./connect-wallet.screen";
import EvmChainPreviewIcon from "../assets/images/evm-chain-preview.png";
import SolChainPreviewIcon from "../assets/images/sol-chain-preview.png";
import { BaseWalletAdapter, ChainType } from "../libs/adapters";
import { useSession } from "../hooks/useSession";
import { useAppState } from "../hooks/useAppState";
import { makeShorter } from "../utils";
import { AppFlow, useLocation } from "../components/router";
import { ModalHeader } from "../components/modal/modal.header";
import { ConnectButton } from "../components/select/wallet-select";

export const BASE_WALLET_SELECT_SCREEN_KEY = "BASE_WALLET_SELECT_SCREEN";

export const BaseWalletSelect: FC = () => {
  const { chainType, getAdapters, setWalletName, setChainType } = useWallet();
  const { userInfo } = useSession();
  const { handleClose, desiredChainType, currentAppFlow } = useAppState();
  const location = useLocation();

  const handleClickWallet = (walletName: string) => {
    setWalletName(walletName);
    location.push(CONNECT_WALLET_SCREEN_KEY);
  };

  const chainAdapter = useMemo<BaseWalletAdapter[]>(() => {
    const adapters = getAdapters();
    return adapters.filter((adapter) => adapter.chainType === chainType);
  }, [chainType]);

  const isBack = useMemo(() => {
    return (
      (desiredChainType === ChainType.ALL && location.isBack) ||
      (currentAppFlow === AppFlow.LOGIN_FLOW && location.isBack)
    );
  }, [currentAppFlow, desiredChainType, location.isBack]);

  const handleGoback = useCallback(() => {
    if (!isBack) {
      return;
    }

    setChainType(desiredChainType);
    location.goBack();
  }, [desiredChainType, location.goBack, isBack]);

  return (
    <div>
      <ModalHeader
        title={chainType === ChainType.EVM ? "EVM" : "SOLANA"}
        isBack={isBack}
        goBack={handleGoback}
        onCloseModal={handleClose}
      />
      <div className="content sm:py-[0px] py-[10%]">
        <div className="base-welcome-screen w-full pt-[30px]">
          <div className="mx-auto">
            <div className="mx-auto pt-[20px]">
              {chainType === ChainType.EVM ? (
                <img
                  src={EvmChainPreviewIcon}
                  className="mx-auto w-[260px] ml-[20%]"
                />
              ) : (
                <img src={SolChainPreviewIcon} className="mx-auto w-[40px]" />
              )}
            </div>

            {currentAppFlow === AppFlow.CONNECT_FLOW && (
              <p className="mx-auto mt-[20px] text-[16px] text-center text-white">
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
                    return (
                      Number(elm2.isInstalled()) - Number(elm.isInstalled())
                    );
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
      </div>
    </div>
  );
};
