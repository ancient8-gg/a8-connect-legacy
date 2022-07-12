import { FC, useCallback, useMemo } from "react";
import { useAppState } from "../hooks/useAppState";
import { useWallet } from "../hooks/useWallet";
import { ChainType } from "../libs/adapters";
import { BASE_WALLET_SELECT_SCREEN_KEY } from "./base-wallet-select.screen";
import { useLocation } from "../components/router";
import { ModalHeader } from "../components/modal/modal.header";
import A8Logo from "../assets/images/a8-logo.png";
import SolBtnImage from "../assets/images/sol-btn.png";
import EvmBtnImage from "../assets/images/evm-btn.png";

export const BASE_WELCOME_LOST_WALLET_SCREEN_KEY =
  "BASE_WELCOME_LOST_WALLET_SCREEN_KEY";

export const BaseWelcomeLostWalletScreen: FC = () => {
  const {
    handleClose,
    resetWithNewWalletPayload: { email },
  } = useAppState();
  const { setChainType, chainType } = useWallet();
  const location = useLocation();

  const targetScreen = useMemo(() => {
    return BASE_WALLET_SELECT_SCREEN_KEY;
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
      <div className="content px-[20px]">
        <div className="base-welcome-screen w-full">
          <div className="mx-auto w-[350px]">
            <img src={A8Logo} className="mx-[auto]" />
            <p className="text-center text-primary text-[20px] font-bold">
              WELCOME TO
              <br />
              ANCIENT8 USER IDENTITY
            </p>
            <p className="mx-auto text-[16px] text-center text-white mt-[20px]">
              Connect your new wallet with Ancient8
              <br />
              User Identity account.
              <br />
              Email:
              <span className="text-primary ml-[3px]">{email}</span>
            </p>
            <p className="text-white text-center text-[16px] mt-[20px]">
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
            <div className="pt-[50px]">
              <p className="text-center text-white text-[14px] font-[100]">
                By connecting, you agree to our
                <br />
                <a className="text-primary underline text-[14px]">
                  Privacy Policy and Terms of Services
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
