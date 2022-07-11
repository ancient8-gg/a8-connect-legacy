import { FC, useMemo } from "react";
import { useAppState } from "../hooks/useAppState";
import { useWallet } from "../hooks/useWallet";
import { ConnectButton } from "../components/WalletConnect.button";
import { CONNECT_WALLET_SCREEN_KEY } from "./connect-wallet.screen";
import { useSession } from "../hooks/useSession";
import { makeShorter } from "../utils";
import { BaseWalletAdapter } from "../libs/adapters";
import { useLocation } from "../components/router";
import { ModalHeader } from "../components/modal/modal.header";

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
        isBack={location.isBack}
        onCloseModal={handleClose}
        goBack={location.goBack}
      />
      <div className="content px-[20px]">
        <div className="base-welcome-screen w-full pt-[30px]">
          <div className="mx-auto ">
            <p className="text-center text-gray text-[20px] mt-[-60px] font-[100]">
              CONNECT WALLET TO APP
            </p>
            <div className="pt-[50px]">
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
