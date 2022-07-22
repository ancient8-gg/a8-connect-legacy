import { FC, useCallback } from "react";

import { useLocation, useRouter } from "../components/router";
import { ModalHeader } from "../components/modal/modal.header";
import { useAppState } from "../hooks/useAppState";
import { PolygonButton } from "../components/button";
import { useSession } from "../hooks/useSession";
import { useWallet } from "../hooks/useWallet";

export const BASE_NOTIFICATION_SCREEN_KEY = "BASE_NOTIFICATION_SCREEN_KEY";

export const BaseNotificationScreen: FC = () => {
  const { params: screenParams } = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = screenParams as any;

  const { push, goBack } = useLocation();
  const { handleClose } = useAppState();
  const { logout } = useSession();
  const { disconnect } = useWallet();

  const handleNextFlow = useCallback(async () => {
    try {
      await logout();
    } catch {}

    try {
      await disconnect();
    } catch {}

    return handleClose();
  }, [logout, push, handleClose]);

  const titleColor = {
    0: "#FF4647",
    1: "#30C021",
  };

  return (
    <div>
      <ModalHeader
        title={
          <p
            className={
              !!titleColor[params?.status as "0" | "1"] ? "text-[20px]" : ""
            }
            style={{ color: titleColor[params?.status as "0" | "1"] }}
          >
            {params?.title}
          </p>
        }
        isBack={params?.isBack || false}
        goBack={goBack}
        onCloseModal={handleClose}
        disableCloseButton={params?.disableCloseButton}
      />
      <div className="sm:py-[0px] py-[5%]">
        <div className="base-welcome-screen w-full min-h-[120px] pt-[20px] pb-[40px] px-[10px]">
          <div className="mx-auto mt-[20px]">
            <p
              className="text-center text-[16px] text-white"
              dangerouslySetInnerHTML={{ __html: params?.description || "" }}
            />
          </div>

          {params?.showSuccessButton && (
            <div className={"mt-[40px] text-white w-[70%] mx-auto"}>
              <PolygonButton
                className={"h-[40px] leading-normal py-[5px]"}
                boxStyle={{ width: "100%" }}
                containerStyle={{ width: "100%", background: "#12151B" }}
                onClick={() => handleNextFlow()}
              >
                {params?.successButtonText || "Close"}
              </PolygonButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
