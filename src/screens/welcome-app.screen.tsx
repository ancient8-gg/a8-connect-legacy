import { FC } from "react";
import { ModalHeader } from "../components/modal/modal.header";
import { useAppState } from "../hooks/useAppState";

export const WELCOME_APP_SCREEN_KEY = "WELCOME_APP_SCREEN";

export const WelcomeAppScreen: FC = () => {
  const { handleClose } = useAppState();

  return (
    <div>
      <ModalHeader isBack={false} onCloseModal={handleClose} goBack={null} />

      <div className="w-full pt-[30px]">
        <div className="mx-auto w-[350px]">
          <p className="text-gray text-[16px] text-center font-[100]">
            WELCOME TO
            <br />
            ANCIENT8 USER IDENTITY!
          </p>
          <p className="text-primary md:text-[20px] text-[16px] text-center font-bold my-[20px]">
            With A8 UID profile you can:
          </p>
          <p className="text-white md:text-[16px] text-[14px] text-center">
            - Saving time and resources in proceeding
            <br />
            KYC and registering to Dapps
          </p>
          <p className="text-white md:text-[16px] text-[14px] text-center">
            - UID ability to integrate multichain and
            <br />
            multiwallet
          </p>
          <p className="text-white md:text-[16px] text-[14px] text-center">
            - One single dashboard for managing user profile
            <br /> across Dapps
          </p>
          <p className="text-white md:text-[16px] text-[14px] text-center">
            - User footprint on the metaverse to be used
            <br />
            for potential future usages
          </p>
        </div>
      </div>
    </div>
  );
};
