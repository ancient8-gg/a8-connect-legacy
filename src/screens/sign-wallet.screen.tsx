import React from "react";
import { useWallet } from "../hooks/useWallet";

export const SIGN_WALLET_SCREEN_KEY = "SIGN_WALLET_SCREEN_KEY";

export const SignWalletScreen: React.FC = () => {
  const { chainType, walletName } = useWallet();

  console.log(chainType, walletName);

  return (
    <div className="sign-wallet-screen w-full pt-[30px]">
      <div className="mx-auto w-[350px]">

      </div>
    </div>
  );
}