import React, { useEffect, useMemo, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { useLocation } from "../hooks/router/component";
import { makeShorter } from "../utils";
import { PolygonButton } from "../components/button";

export const SIGN_WALLET_SCREEN_KEY = "SIGN_WALLET_SCREEN_KEY";

export const SignWalletScreen: React.FC = () => {
  const { walletName, walletAddress } = useWallet();
  const [signing, setSigning] = useState<boolean>(false);
  const location = useLocation();

  const handleClickSign = () => {
    setSigning(true);
  };

  useEffect(() => {
    console.log(walletAddress);
  }, [walletName, walletAddress]);

  return (
    <div className="sign-wallet-screen w-full pt-[30px]">
      <div className="mx-auto w-[350px]">
        <p className="text-center text-gray text-[20px] mt-[-25px] font-[100]">
          SIGN IN
        </p>
        <div className="pt-[50px]">
          <p className="text-center text-white text-[16px] mt-[30px]">
            Sign a message to confirm you own the wallet address.
          </p>
          <div className="mt-[30px]">
            <p className="text-white text-[20px] text-center font-bold">SIGNING WITH THIS ADDRESS</p>
            <p className="text-primary text-[20px] text-center font-bold">{makeShorter(walletAddress)}</p>
          </div>
          <div className="flex justify-center mt-[30px] items-center">
            <div className="w-full rounded-[8px] px-[15px] py-[10px] bg-[#25282D] flex">
              <div className="float-left">
                <img src="/assets/images/defend.png" className="w-[16px] h-[16px] mt-[3px]" />
              </div>
              <div className="float-left pl-[20px] text-white">
                <p className="text-[14px] font-bold">View only permission.</p>
                <p className="text-[14px]">We wil never do anything without your approval</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-container mt-[100px] mb-[30px]">
          <PolygonButton
            boxStyle={{ width: "100%" }}
            containerStyle={{ width: '100%', background: '#12151B', }}
            onClick={() => handleClickSign()}>
            <div className="flex items-center justify-center">
              {signing && (
                <div className="float-left">
                  <svg role="status" className="inline w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                </div>
              )}
              <p className="float-left text-white text-[16px]">
                {signing ? "Sign message in wallet" : "Continue"}
              </p>
            </div>
          </PolygonButton>
        </div>
      </div>
    </div>
  );
};
