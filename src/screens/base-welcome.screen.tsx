import { FC, useCallback, useEffect, useMemo } from "react";
import { useAppState } from "../hooks/useAppState";
import { useWallet } from "../hooks/useWallet";
import { ChainType } from "../libs/adapters";
import { BASE_WALLET_SELECT_SCREEN_KEY } from "./base-wallet-select.screen";
import { useSession } from "../hooks/useSession";
import { makeShorter } from "../utils";
import { AppFlow, useLocation } from "../components/router";
import { ModalHeader } from "../components/modal/modal.header";
import A8Logo from "../assets/images/a8-logo.png";
import { ProviderSelect } from "../components/select/provider-select";

export const BASE_WELCOME_SCREEN_KEY = "BASE_WELCOME_SCREEN_KEY";

export const BaseWelcomeScreen: FC = () => {
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
      <div className="content sm:py-[0px] py-[5%]">
        <div className="base-welcome-screen w-full">
          <div className="mx-auto">
            <img src={A8Logo} className="mx-[auto] mt-[-20px] mb-[10px]" />
            {currentAppFlow === AppFlow.LOGIN_FLOW ? (
              <p className="text-center text-primary text-[20px] font-bold">
                WELCOME TO
                <br />
                ANCIENT8 USER IDENTITY
              </p>
            ) : (
              <p className="mt-[20px] mx-auto text-[16px] text-center text-white">
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
              <ProviderSelect handleClickChain={handleClickChain} />
            </div>
            <div className="pt-[50px] pb-[20px]">
              <p className="text-center text-white text-[14px] ">
                By connecting, you agree to our
                <br />
                <a
                  className="text-primary underline text-[14px]"
                  href={"https://ancient8.gg"}
                  target={"_blank"}
                >
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
