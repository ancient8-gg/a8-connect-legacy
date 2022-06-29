import { FC, useEffect } from "react";

import { useWallet } from "../hooks/useWallet";
import { ChainType } from "../libs/adapters";
import { useLocation } from "../hooks/router";
import { BASE_WALLET_SELECT_SCREEN_KEY } from "./base-wallet-select.screen";
import A8Logo from "../assets/images/a8-logo.png";
import SolBtnImage from "../assets/images/sol-btn.png";
import EvmBtnImage from "../assets/images/evm-btn.png";

export const BASE_WELCOME_SCREEN_KEY = "BASE_WELCOME_SCREEN_KEY";

export const BaseWelcomeScreen: FC = () => {
  const { setChainType, chainType } = useWallet();
  const location = useLocation();

  useEffect(() => {
    if (chainType !== "all") {
      location.push(BASE_WALLET_SELECT_SCREEN_KEY);
    }
  }, []);

  const handleClickChain = (chainType: ChainType) => {
    setChainType(chainType);
    location.push(BASE_WALLET_SELECT_SCREEN_KEY);
  };

  return (
    <div className="base-welcome-screen w-full pt-[30px]">
      <div className="mx-auto w-[350px]">
        <img src={A8Logo} className="mx-[auto]" />
        <p className="text-center text-primary text-[20px] font-bold">
          WELCOME TO
          <br />
          ANCIENT8 USER IDENTITY
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
  );
};
