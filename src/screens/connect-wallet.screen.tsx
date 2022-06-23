import React, { useEffect, useMemo, useState } from "react";
import { SING_WALLET_CONNECT_UID_KEY } from "./sign-wallet-connect-uid.screen";
import { SIGN_WALLET_SCREEN_KEY } from "./sign-wallet.screen";
import { useLocation } from "../hooks/router/component";
import { PolygonButton } from "../components/button";
import { useWallet } from "../hooks/useWallet";
import { useSession } from "../hooks/useSession";
import { SdkMethod } from "../libs/dto/entities";
import * as Adapters from "../libs/adapters";

export const CONNECT_WALLET_SCREEN_KEY = "CONNECT_WALLET_SCREEN_KEY";

export const ConnectWalletScreen: React.FC = () => {
  const { sdkMethod } = useSession();
  const { walletName, getWalletAdapter, connect } = useWallet();
  const [connected, setConnected] = useState<boolean>(false);
  const [connectedError, setConenctedError] = useState<boolean>(false);
  const [] = useState<boolean>(false);
  const location = useLocation();

  const walletAdapter =
    useMemo<Adapters.AdapterInterface.BaseWalletAdapter>(() => {
      return getWalletAdapter(walletName);
    }, [walletName]);

  const handleConnect = async () => {
    const walletAddress = await connect();
    if (!walletAddress) {
      setConenctedError(true);
      return;
    }

    setConnected(true);
  };

  useEffect(() => {
    handleConnect();
  }, []);

  useEffect(() => {
    if (connected) {
      setConnected(false);
      location.push(
        sdkMethod === SdkMethod.login
          ? SIGN_WALLET_SCREEN_KEY
          : SING_WALLET_CONNECT_UID_KEY,
        true
      );
    }
  }, [connected]);

  return (
    <div className="sign-wallet-screen w-full pt-[30px]">
      <div className="mx-auto w-[350px]">
        <p className="text-center text-gray text-[20px] mt-[-25px] font-[100]">
          CONNECT WALLET
        </p>
        <div className="pt-[50px]">
          <p className="text-center text-primary text-[20px]">CONNECTING...</p>
          <p className="text-center text-white text-[16px] mt-[30px]">
            Please unlock your Phantom wallet and select which wallet address
            you want to connect.
          </p>
          <div className="flex justify-center mt-[30px] items-center">
            <img
              src={walletAdapter.adapterStyle.icon}
              className="adapter-avatar h-[60px] w-[60px] rounded-[50%]"
            />
            <p className="text-white mx-[2px]">--------</p>
            <img
              src="/assets/images/a8-connect.png"
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
  );
};
