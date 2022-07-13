import { FC, useCallback, useEffect, useMemo } from "react";
import { useAppState } from "../hooks/useAppState";
import { useWallet } from "../hooks/useWallet";
import { ChainType } from "../libs/adapters";
import { BASE_WALLET_SELECT_SCREEN_KEY } from "./base-wallet-select.screen";
import { useSession } from "../hooks/useSession";
import { makeShorter } from "../utils";
import { AppFlow, useLocation } from "../components/router";
import { ModalHeader } from "../components/modal/modal.header";
import SolBtnImage from "../assets/images/sol-btn.png";
import EvmBtnImage from "../assets/images/evm-btn.png";

export const BASE_WELCOME_ADD_WALLET_SCREEN_KEY =
  "BASE_WELCOME_ADD_WALLET_SCREEN_KEY";

export const BaseWelcomeAddWallet: FC = () => {
  const { handleClose, desiredChainType, currentAppFlow } = useAppState();
  const { setChainType, chainType } = useWallet();
  const { userInfo } = useSession();
  const location = useLocation();

  const targetScreen = useMemo(() => {
    return BASE_WALLET_SELECT_SCREEN_KEY;
  }, []);

  useEffect(() => {
    if (
      currentAppFlow === AppFlow.CONNECT_FLOW &&
      desiredChainType !== ChainType.ALL
    ) {
      setChainType(desiredChainType);
      location.push(targetScreen, { deleted: true });
    }
  }, []);

  const handleClickChain = useCallback(
    (chainType: ChainType) => {
      setChainType(chainType);
      location.push(targetScreen);
    },
    [targetScreen, chainType]
  );
  return (
    <div>
      <ModalHeader isBack={false} onCloseModal={handleClose} goBack={null} />
      <div className="content px-[20px] pb-[20px]">
        <div className="base-welcome-screen w-full">
          <div className="mx-auto w-[350px]">
            <p className="text-center text-gray text-[20px] mt-[-60px] font-[100]">
              ADD WALLET
            </p>
            <p className="mx-auto text-[16px] text-center text-white mt-[50px]">
              Currently logged into the UID
              <p className="text-primary ml-[3px]">
                {makeShorter(userInfo?._id)}
              </p>
            </p>
            <p className="text-white text-center text-[16px] mt-[40px]">
              Please select desired chain below
            </p>
            <div className="pt-[50px]">
              <img
                src={SolBtnImage}
                className="w-full cursor-pointer mt-[20px]"
                onClick={() => handleClickChain(ChainType.SOL)}
              />
              <img
                src={EvmBtnImage}
                className="w-full cursor-pointer mt-[20px]"
                onClick={() => handleClickChain(ChainType.EVM)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
