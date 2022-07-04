import { FC, useEffect, useState, useCallback } from "react";
import { makeShorter } from "../utils";
import { useAppState } from "../hooks/useAppState";
import { useWallet } from "../hooks/useWallet";
import { useLocation } from "../components/router";
import { PolygonButton } from "../components/button";
import LoadingSpinner from "../components/loading-spiner";
import DefendIcon from "../assets/images/defend.png";
import { ModalHeader } from "../components/modal/modal.header";
import { getUtilsProvider } from "../libs/providers";

export interface BaseSignWalletScreenProps {
  description: string;
  signedMessage: string;
  onSigned(signature: string): void;
}

export const BaseSignWalletScreen: FC<BaseSignWalletScreenProps> = ({
  description,
  signedMessage,
  onSigned,
}) => {
  const { walletAddress, sign, connect } = useWallet();
  const [signing, setSigning] = useState<boolean>(false);
  const { handleClose } = useAppState();
  const location = useLocation();
  const utilsProvider = getUtilsProvider();

  let handler: () => void;

  const stopHandler = useCallback(() => {
    if (typeof handler === "function") {
      handler();
    }
  }, []);

  const handleClickSign = useCallback(async () => {
    setSigning(true);
    try {
      stopHandler();
      await connect();
      const signature = await sign(signedMessage);
      onSigned(signature);
    } catch {
      handler = utilsProvider.withInterval(async () => {
        await connect();
      }, 500);
    }
    setSigning(false);
  }, [signedMessage, onSigned, stopHandler]);

  useEffect(() => {
    handler = utilsProvider.withInterval(async () => {
      await connect();
    }, 500);
    return () => handler();
  }, []);

  return (
    <div>
      <ModalHeader
        isBack={location.isBack}
        goBack={location.goBack}
        onCloseModal={handleClose}
      />
      <div className="content px-[20px]">
        <div className="sign-wallet-screen w-full pt-[30px]">
          <div className="mx-auto w-[350px]">
            <p className="text-center text-gray text-[20px] mt-[-60px] font-[100]">
              SIGN IN
            </p>
            <div className="pt-[50px]">
              <p
                dangerouslySetInnerHTML={{ __html: description || "" }}
                className="text-center text-white text-[16px] mt-[30px]"
              />
              <div className="mt-[30px]">
                <p className="text-white text-[20px] text-center font-bold">
                  SIGNING WITH THIS ADDRESS
                </p>
                <p className="text-primary text-[20px] text-center font-bold">
                  {makeShorter(walletAddress)}
                </p>
              </div>
              <div className="flex justify-center mt-[30px] items-center">
                <div className="w-full rounded-[8px] px-[15px] py-[10px] bg-[#25282D] flex">
                  <div className="float-left">
                    <img
                      src={DefendIcon}
                      className="w-[16px] h-[16px] mt-[3px]"
                    />
                  </div>
                  <div className="float-left pl-[20px] text-white">
                    <p className="text-[14px] font-bold">
                      View only permission.
                    </p>
                    <p className="text-[14px]">
                      We wil never do anything without your approval
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-container mt-[100px] mb-[30px]">
              <PolygonButton
                boxStyle={{ width: "100%" }}
                containerStyle={{ width: "100%", background: "#12151B" }}
                onClick={() => handleClickSign()}
              >
                <div className="flex items-center justify-center">
                  {signing && (
                    <div className="float-left">
                      <LoadingSpinner width={5} height={5} />
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
      </div>
    </div>
  );
};
