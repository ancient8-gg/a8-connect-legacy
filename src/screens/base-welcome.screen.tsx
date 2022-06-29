import { FC, useCallback, useEffect, useMemo } from "react";

import { useWallet } from "../hooks/useWallet";
import { ChainType } from "../libs/adapters";
import { useLocation, useRouter } from "../hooks/router";
import { BASE_WALLET_SELECT_SCREEN_KEY } from "./base-wallet-select.screen";
import A8Logo from "../assets/images/a8-logo.png";
import SolBtnImage from "../assets/images/sol-btn.png";
import EvmBtnImage from "../assets/images/evm-btn.png";
import { useSession } from "../hooks/useSession";
import { SdkMethod } from "../libs/dto/entities";
import { makeShorter } from "../utils";
import { useAppState } from "../hooks/useAppState";

export const BASE_WELCOME_SCREEN_KEY = "BASE_WELCOME_SCREEN_KEY";

export const BaseWelcomeScreen: FC = () => {
  const { isReady } = useAppState();
  const { setChainType, chainType } = useWallet();
  const { sdkMethod, userInfo } = useSession();
  const { isRouterReady } = useRouter();
  const location = useLocation();

  const targetScreen = useMemo(() => {
    return BASE_WALLET_SELECT_SCREEN_KEY;
  }, []);

  useEffect(() => {
    console.log({ isReady });
    if (chainType !== ChainType.ALL && isReady && isRouterReady) {
      location.push(targetScreen);
    }
  }, [isReady, isRouterReady]);

  const handleClickChain = useCallback(
    (chainType: ChainType) => {
      setChainType(chainType);
      location.push(targetScreen);
    },
    [targetScreen, chainType]
  );

  return (
    <div className="base-welcome-screen w-full pt-[30px]">
      <div className="mx-auto w-[350px]">
        <img src={A8Logo} className="mx-[auto]" />
        {sdkMethod === SdkMethod.login ? (
          <p className="text-center text-primary text-[20px] font-bold">
            WELCOME TO
            <br />
            ANCIENT8 USER IDENTITY
          </p>
        ) : (
          <p className="mx-auto text-[16px] text-center text-white">
            Currently logged into the UID:
            <span className="text-primary ml-[3px]">
              {makeShorter(userInfo?._id)}
            </span>
          </p>
        )}

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
