import { FC, useCallback } from "react";
import { useAppState } from "../hooks/useAppState";
import { useLocation, useRouter } from "../components/router";
import { ModalHeader } from "../components/modal/modal.header";

export const BASE_NOTIFICATION_SCREEN_KEY = "BASE_NOTIFICATION_SCREEN_KEY";

export const BaseNotificationScreen: FC = () => {
  const { handleClose, desiredChainType } = useAppState();
  const { params: screenParams } = useRouter();
  const location = useLocation();

  const handleGoback = useCallback(() => {
    location.goBack();
  }, [desiredChainType, location.goBack]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = screenParams as any;

  return (
    <div>
      <ModalHeader
        isBack={true}
        goBack={handleGoback}
        onCloseModal={handleClose}
      />
      <div className="content px-[20px]">
        <div className="base-welcome-screen w-full pt-[30px]">
          <div className="mx-auto ">
            <p
              className="text-center text-[20px] mt-[-60px] font-[100]"
              style={{ color: params?.status === 0 ? "#FF4647" : "#30C021" }}
            >
              {params?.title}
            </p>
            <p
              className="text-center text-[16px] font-[100] text-white mt-[20px]"
              dangerouslySetInnerHTML={{ __html: params?.description || "" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
