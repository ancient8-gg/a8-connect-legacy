import { FC, useCallback, useMemo } from "react";
import { useAppState } from "../hooks/useAppState";
import { useWallet } from "../hooks/useWallet";
import { ChainType } from "../libs/adapters";
import { BASE_WALLET_SELECT_SCREEN_KEY } from "./base-wallet-select.screen";
import { useSession } from "../hooks/useSession";
import { makeShorter } from "../utils";
import { useLocation } from "../components/router";
import { ModalHeader } from "../components/modal/modal.header";
import { ProviderSelect } from "../components/select/provider-select";

export const BASE_WELCOME_ADD_WALLET_SCREEN_KEY =
  "BASE_WELCOME_ADD_WALLET_SCREEN_KEY";

export const BaseWelcomeAddWallet: FC = () => {
  const { handleClose } = useAppState();
  const { setChainType, chainType } = useWallet();
  const { userInfo } = useSession();
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
      <ModalHeader
        isBack={false}
        onCloseModal={handleClose}
        goBack={null}
        title={"ADD WALLET"}
      />
      <div className="content sm:py-[0px] py-[5%]">
        <div className="base-welcome-screen w-full">
          <div className="mx-auto">
            <p className="mx-auto text-[16px] text-center text-white mt-[50px]">
              Currently logged into the UID
            </p>
            <p className="mx-auto text-[16px] text-center text-primary ml-[3px]">
              {makeShorter(userInfo?._id)}
            </p>
            <p className="text-white text-center text-[16px] mt-[40px]">
              Please select desired chain below
            </p>
            <div className="pt-[50px]">
              <ProviderSelect handleClickChain={handleClickChain} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
