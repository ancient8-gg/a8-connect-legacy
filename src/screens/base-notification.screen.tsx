import { FC, useCallback } from "react";
import { useLocation, useRouter } from "../components/router";
import { ModalHeader } from "../components/modal/modal.header";

export const BASE_NOTIFICATION_SCREEN_KEY = "BASE_NOTIFICATION_SCREEN_KEY";

export const BaseNotificationScreen: FC = () => {
  const { params: screenParams } = useRouter();
  const location = useLocation();

  const handleGoback = useCallback(() => {
    location.goBack();
  }, [location.goBack]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = screenParams as any;

  return (
    <div>
      <ModalHeader
        title={
          <p
            className="text-[20px] font-[100]"
            style={{ color: params?.status === 0 ? "#FF4647" : "#30C021" }}
          >
            {params?.title}
          </p>
        }
        isBack={false}
        onCloseModal={handleGoback}
      />
      <div className="content py-[30px]">
        <div className="base-welcome-screen w-full">
          <div className="mx-auto ">
            <p
              className="text-center text-[16px] font-[100] text-white"
              dangerouslySetInnerHTML={{ __html: params?.description || "" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
