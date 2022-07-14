import { FC, useCallback, useMemo } from "react";
import { useWallet } from "../hooks/useWallet";
import { CONNECT_WALLET_SCREEN_KEY } from "./connect-wallet.screen";
import {
  BaseWalletAdapter,
  ChainType,
  Coin98EVMWalletName,
  Coin98SolanaWalletName,
  CoinbaseEVMWalletName,
} from "../libs/adapters";
import { useSession } from "../hooks/useSession";
import { useAppState } from "../hooks/useAppState";
import { makeShorter } from "../utils";
import { AppFlow, useLocation } from "../components/router";
import { ModalHeader } from "../components/modal/modal.header";
import { ConnectButton } from "../components/select/wallet-select";
import ETHChainPreviewIcon from "../assets/images/2x_eth_evm_chain.png";
import BNBChainPreviewIcon from "../assets/images/2x_bnb_evm_chain.png";
import PolygonChainPreviewIcon from "../assets/images/2x_matic_evm_chain.png";
import FantomEVMChain from "../assets/images/2x_phantom_evm_chain.png";
import AvaxChain from "../assets/images/2x_avax_evm_chain.png";
import ArbitrumChain from "../assets/images/2x_abitrum_evm_chain.png";
import SolChainPreviewIcon from "../assets/images/2x_solana_welcome.png";
import { Notification } from "../components/notification/notification";

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

  const overrideWarnMessage = useMemo(() => {
    const computedData = {
      coin98:
        chainAdapter.filter(
          (elm) =>
            elm.isInstalled() &&
            (elm.name === Coin98EVMWalletName ||
              elm.name === Coin98SolanaWalletName)
        ).length > 0,
      coinbase:
        chainAdapter.filter(
          (elm) => elm.isInstalled() && elm.name === CoinbaseEVMWalletName
        ).length > 0,
    };

    console.log({ computedData });

    if (computedData.coinbase && computedData.coin98)
      return "You need to turn off the override on Coin98/Coinbase to use Metamask normally";

    if (computedData.coin98)
      return "You need to turn off the override on Coin98 to use Metamask normally";

    if (computedData.coinbase)
      return "You need to turn off the override on Coinbase to use Metamask normally";

    return null;
  }, [chainAdapter]);

  const isBack = useMemo(() => {
    return (
      (desiredChainType === ChainType.ALL && location.isBack) ||
      (currentAppFlow === AppFlow.LOGIN_FLOW && location.isBack)
    );
  }, [currentAppFlow, desiredChainType, location.isBack]);

  const title = useMemo(() => {
    if (currentAppFlow !== AppFlow.CONNECT_FLOW) {
      return chainType === ChainType.EVM ? "EVM" : "SOLANA";
    }

    return "CONNECT WALLET TO APP";
  }, [currentAppFlow]);

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
        title={title}
        isBack={isBack}
        goBack={handleGoback}
        onCloseModal={handleClose}
      />
      <div className="content sm:py-[0px] py-[5%]">
        <div className="base-welcome-screen w-full pt-[30px]">
          <div className="mx-auto">
            {currentAppFlow !== AppFlow.CONNECT_FLOW && (
              <div className="mx-auto pt-[20px]">
                {chainType === ChainType.EVM ? (
                  <div
                    className={
                      "mx-auto flex flex-row items-center justify-center"
                    }
                  >
                    <img
                      src={ETHChainPreviewIcon}
                      className="w-[12px] h-[20px] mr-[15px]"
                    />
                    <img
                      src={BNBChainPreviewIcon}
                      className="w-[20px] h-[20px] mr-[15px]"
                    />
                    <img
                      src={PolygonChainPreviewIcon}
                      className="w-[20px] h-[20px] mr-[15px]"
                    />
                    <img
                      src={FantomEVMChain}
                      className="w-[20px] h-[20px] mr-[15px]"
                    />
                    <img
                      src={AvaxChain}
                      className="w-[20px] h-[20px] mr-[15px]"
                    />
                    <img src={ArbitrumChain} className="w-[24px] h-[24px]" />
                  </div>
                ) : (
                  <img
                    src={SolChainPreviewIcon}
                    className="mx-auto w-[20px] h-[20px]"
                  />
                )}
              </div>
            )}

            {currentAppFlow === AppFlow.CONNECT_FLOW && (
              <p className="mx-auto mt-[20px] text-[16px] text-center text-white">
                Currently logged into the UID:
                <span className="text-primary ml-[3px]">
                  {makeShorter(userInfo?._id)}
                </span>
              </p>
            )}

            <div className="pt-[30px]">
              {currentAppFlow === AppFlow.CONNECT_FLOW ? (
                <p className="mx-auto text-primary text-[20px] font-bold text-center">
                  Select wallet {chainType === ChainType.EVM ? "EVM" : "SOLANA"}{" "}
                  provider
                </p>
              ) : (
                <p className="mx-auto text-primary text-[20px] font-bold text-center">
                  Select wallet provider
                </p>
              )}

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

              {overrideWarnMessage && (
                <div className={"mt-30px"}>
                  <Notification
                    type={"warn"}
                    title={"Turn off override function"}
                    description={overrideWarnMessage}
                  />
                </div>
              )}
            </div>
            <div className="bottom-container my-[30px]">
              <p className="text-center text-[14px] text-primary underline">
                {currentAppFlow === AppFlow.LOGIN_FLOW && (
                  <a href="https://ancient8.gg/profile/lost-wallet">
                    Lost your wallet?
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
