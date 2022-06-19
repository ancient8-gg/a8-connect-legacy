import React, { useEffect, useMemo, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { useLocation } from "../hooks/router/component";
import { SIGN_WALLET_SCREEN_KEY } from "./sign-wallet.screen";
import * as Adapters from "../libs/adapters";

export const CONNECT_WALLET_SCREEN_KEY = "CONNECT_WALLET_SCREEN_KEY";

export const ConnectWalletScreen: React.FC = () => {
  const { walletName, getWalletAdapter, connect } = useWallet();
  const [connected, setConnected] = useState<boolean>(false);
  const location = useLocation();

  const walletAdapter =
    useMemo<Adapters.AdapterInterface.BaseWalletAdapter>(() => {
      return getWalletAdapter(walletName);
    }, [walletName]);

  const handleConnect = async () => {
    const walletAddress = await connect();
    if (!walletAddress) return;
    setConnected(true);
  }

  useEffect(() => {
    handleConnect();
  }, []);

  useEffect(() => {
    if (connected) {
      location.push(SIGN_WALLET_SCREEN_KEY, true);
      setConnected(false);
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
            Please unlock your Phantom wallet and select which wallet address you want to connect.
          </p>
          <div className="flex justify-center mt-[30px] items-center">
            <img
              src={walletAdapter.adapterStyle.icon}
              className="adapter-avatar h-[60px] w-[60px] rounded-[50%]"
            />
            {" "} <p className="text-white mx-[2px]">--------</p> {" "}
            <img
              src="/assets/images/a8-connect.png"
              className="adapter-avatar h-[60px] w-[60px] rounded-[50%]"
            />
          </div>
        </div>
        <div className="bottom-container mt-[100px] mb-[30px]">
          <p className="text-center text-[14px] text-white">
            Having trouble?
            <a className="text-primary underline" onClick={() => location.goBack()}>
              {" "} Go back
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
