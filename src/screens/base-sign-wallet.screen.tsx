import { FC, useEffect, useState, useCallback } from "react";
import { makeShorter } from "../utils";
import { useAppState } from "../hooks/useAppState";
import { useWallet } from "../hooks/useWallet";
import { useLocation } from "../components/router";
import { PolygonButton } from "../components/button";
import { ModalHeader } from "../components/modal/modal.header";
import { getUtilsProvider } from "../libs/providers";
import { getAuthAction } from "../libs/actions";
import { AuthChallenge } from "../libs/dto/entities";
import LoadingSpinner from "../components/loading-spinner";
import DefendIcon from "../assets/images/defend-yellow.png";

export interface BaseSignWalletScreenProps {
  description: string;
  title: string;
  onSigned(authChallenge: AuthChallenge, signature: string): void;
  existedWallet?: boolean;
}

/**
 * Move handler to outside component context.
 */
let handler: () => void;

/**
 * Move stop handler to outside component context.
 */
const stopHandler = () => {
  if (typeof handler === "function") {
    handler();
  }
};

export const BaseSignWalletScreen: FC<BaseSignWalletScreenProps> = ({
  description,
  title,
  onSigned,
  existedWallet,
}) => {
  const { walletAddress, sign, connect } = useWallet();
  const [signing, setSigning] = useState<boolean>(false);
  const { handleClose } = useAppState();
  const location = useLocation();
  const utilsProvider = getUtilsProvider();
  const authAction = getAuthAction();

  const handleClickSign = useCallback(async () => {
    setSigning(true);

    stopHandler();
    await connect();

    try {
      const authChallenge = await authAction.requestAuthChallenge(
        walletAddress
      );

      const signature = await sign(authChallenge.message);
      onSigned(authChallenge, signature);
    } catch {
      handler = utilsProvider.withInterval(async () => {
        await connect();
      }, 500);
    }

    setSigning(false);
  }, [onSigned, walletAddress]);

  useEffect(() => {
    handler = utilsProvider.withInterval(async () => {
      await connect();
    }, 500);
    return () => stopHandler();
  }, []);

  return (
    <div>
      <ModalHeader
        title={title.toUpperCase()}
        isBack={location.isBack}
        goBack={() => location.goBack(2)}
        onCloseModal={handleClose}
      />
      <div className="sm:py-[0px] py-[5%]">
        <div className="sign-wallet-screen w-full pt-[30px]">
          <div className="mx-auto ">
            <div>
              <p
                dangerouslySetInnerHTML={{ __html: description || "" }}
                className="text-center text-white text-[16px] mt-[10px]"
              />
              <div className="mt-[70px]">
                <p className="text-white text-[20px] text-center font-bold">
                  SIGNING WITH THIS ADDRESS
                </p>
                <p className="text-primary text-[20px] text-center font-bold">
                  {makeShorter(walletAddress)}
                </p>
              </div>
              <div className="flex justify-center mt-[30px] items-center">
                <div className="w-full rounded-[8px] px-[15px] py-[10px] bg-[#5537004d] flex">
                  <div className="float-left">
                    <img
                      src={DefendIcon}
                      className="w-[16px] h-[16px] mt-[3px]"
                    />
                  </div>
                  <div className="float-left pl-[20px] text-[#b57b0ff5]">
                    <p className="text-[14px] font-bold">
                      View only permission.
                    </p>
                    <p className="text-[12px] italic">
                      We will never do anything without your approval
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
                      <LoadingSpinner width={24} height={24} />
                    </div>
                  )}
                  <p className="float-left text-white text-[16px]">
                    {signing ? "Sign message in wallet" : "Continue"}
                  </p>
                </div>
              </PolygonButton>
            </div>

            {existedWallet === false && (
              <div className={"my-[20px] text-center text-[14px]"}>
                <div className={"text-white "}>
                  Want to connect this wallet to an existed UID?
                </div>
                <a
                  className={"text-primary underline"}
                  href={"https://ancient8.gg"}
                  target={"_blank"}
                >
                  Learn how here
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
