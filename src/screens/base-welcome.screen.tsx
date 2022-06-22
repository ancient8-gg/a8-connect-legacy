import React from "react";
import { useWallet } from "../hooks/useWallet";
import { ChainType } from "../libs/adapters/interface";
import { useLocation } from "../hooks/router/component";
import { BASE_WALLET_SELECT_SCREEN_KEY } from "./base-wallet-select.screen";

export const BASE_WELCOME_SREEN_KEY = "BASE_WELCOME_SREEN_KEY";

export const BaseWelcomeScreen: React.FC = () => {
  const { setChainType } = useWallet();
  const location = useLocation();

  const handleClickChain = (chainType: ChainType) => {
    setChainType(chainType);
    location.push(BASE_WALLET_SELECT_SCREEN_KEY);
  };

  return (
    <div className="base-welcome-screen w-full pt-[30px]">
      <div className="mx-auto w-[350px]">
        <img src="/assets/images/a8-logo.png" className="mx-[auto]" />
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
            src="/assets/images/sol-btn.png"
            className="w-full cursor-pointer mt-[20px]"
            onClick={() => handleClickChain(ChainType.SOL)}
          />
          <img
            src="/assets/images/evm-btn.png"
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
