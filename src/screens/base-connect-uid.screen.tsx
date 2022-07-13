import { FC, useMemo } from "react";
import { useAppState } from "../hooks/useAppState";
import { useWallet } from "../hooks/useWallet";
import { CONNECT_WALLET_SCREEN_KEY } from "./connect-wallet.screen";
import { useSession } from "../hooks/useSession";
import { makeShorter } from "../utils";
import { BaseWalletAdapter } from "../libs/adapters";
import { useLocation } from "../components/router";
import { ModalHeader } from "../components/modal/modal.header";
import { ConnectButton } from "../components/select/wallet-select";

export const BASE_CONNECT_UID_SCREEN_KEY = "BASE_CONNECT_UID_SCREEN";

export const BaseConnectUIDScreen: FC = () => {
  const { getAdapters, setWalletName } = useWallet();
  const { handleClose } = useAppState();
  const { userInfo } = useSession();
  const location = useLocation();

  const handleClickWallet = (walletName: string) => {
    setWalletName(walletName);
    location.push(CONNECT_WALLET_SCREEN_KEY);
  };

  const chainAdapter = useMemo<BaseWalletAdapter[]>(() => {
    return getAdapters();
  }, [getAdapters]);

  return (
    <div>
      <ModalHeader
        title={"CONNECT WALLET TO APP"}
        isBack={location.isBack}
        onCloseModal={handleClose}
        goBack={location.goBack}
      />
      <div className="content sm:py-[0px] py-[10%]">
        <div className="base-welcome-screen w-full pt-[30px]">
          <div className="mx-auto">
            <div className="pt-[20px]">
              <p className="mx-auto text-[16px] text-center text-white">
                Currently logged into the UID:
                <span className="text-primary ml-[3px]">
                  {makeShorter(userInfo?._id)}
                </span>
              </p>
              <p className="mx-auto text-[16px] text-center text-white mt-[5px]">
                Please connect to a Solana wallet below
              </p>
              <div className="pt-[40px]">
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
          </div>
        </div>
      </div>
    </div>
  );
};
