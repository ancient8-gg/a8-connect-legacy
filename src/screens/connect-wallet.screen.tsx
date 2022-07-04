import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { SIGN_WALLET_CONNECT_UID_KEY } from "./sign-wallet-connect-uid.screen";
import { SIGN_WALLET_SCREEN_KEY } from "./sign-wallet.screen";
import { PolygonButton } from "../components/button";
import { useWallet } from "../hooks/useWallet";
import { useAppState } from "../hooks/useAppState";
import A8ConnectImage from "../assets/images/a8-connect.png";
import { BaseWalletAdapter } from "../libs/adapters";
import { AppFlow, useLocation } from "../components/router";
import { ModalHeader } from "../components/modal/modal.header";

export const CONNECT_WALLET_SCREEN_KEY = "CONNECT_WALLET_SCREEN_KEY";

export const ConnectWalletScreen: FC = () => {
  const { walletName, getWalletAdapter, connect } = useWallet();
  const { handleClose, currentAppFlow } = useAppState();
  const [connected, setConnected] = useState<boolean>(false);
  const [connectedError, setConnectedError] = useState<boolean>(false);
  const location = useLocation();

  const walletAdapter = useMemo<BaseWalletAdapter>(() => {
    return getWalletAdapter(walletName);
  }, [walletName]);

  const handleConnect = useCallback(async () => {
    const walletAddress = await connect();
    if (!walletAddress) {
      setConnectedError(true);
      return;
    }

    setConnected(true);
  }, [connect]);

  useEffect(() => {
    handleConnect();
  }, []);

  useEffect(() => {
    if (connected) {
      setConnected(false);
      location.push(
        currentAppFlow === AppFlow.LOGIN_FLOW
          ? SIGN_WALLET_SCREEN_KEY
          : SIGN_WALLET_CONNECT_UID_KEY,
        true
      );
    }
  }, [connected, currentAppFlow, location]);

  return (
    <div>
      <ModalHeader
        onCloseModal={handleClose}
        isBack={location.isBack}
        goBack={() => location.goBack()}
      />

      <div className="content px-[20px]">
        <div className="sign-wallet-screen w-full pt-[30px]">
          <div className="mx-auto w-[350px]">
            <p className="text-center text-gray text-[20px] mt-[-60px] font-[100]">
              CONNECT WALLET
            </p>
            <div className="pt-[50px]">
              <p className="text-center text-primary text-[20px]">
                CONNECTING...
              </p>
              <p className="text-center text-white text-[16px] mt-[30px]">
                Please unlock your Phantom wallet and select which wallet
                address you want to connect.
              </p>
              <div className="flex justify-center mt-[30px] items-center">
                <img
                  src={walletAdapter.adapterStyle.icon}
                  className="adapter-avatar h-[60px] w-[60px] rounded-[50%]"
                />
                <p className="text-white mx-[2px]">--------</p>
                <img
                  src={A8ConnectImage}
                  className="adapter-avatar h-[60px] w-[60px] rounded-[50%]"
                />
              </div>
              {connectedError && (
                <div className="mt-[100px]">
                  <PolygonButton
                    boxStyle={{ width: "100%" }}
                    containerStyle={{ width: "100%", background: "#12151B" }}
                    onClick={() => handleConnect()}
                  >
                    <p className="text-white">Retry</p>
                  </PolygonButton>
                </div>
              )}
            </div>
            <div className="bottom-container mt-[30px] mb-[30px]">
              <p className="text-center text-[14px] text-white">
                Having trouble?
                <a
                  className="text-primary underline"
                  onClick={() => location.goBack()}
                >
                  {" "}
                  Go back
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
