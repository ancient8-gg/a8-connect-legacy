import { FC } from "react";
import LoadingSpinner from "../components/loading-spinner";
import { ModalHeader } from "../components/modal/modal.header";
import { useAppState } from "../hooks/useAppState";

export const BaseLoadingScreen: FC = () => {
  const { handleClose } = useAppState();
  return (
    <div>
      <ModalHeader isBack={false} onCloseModal={handleClose} goBack={null} />

      <div className="loading-screen w-full py-[50px] flex justify-center items-center">
        <LoadingSpinner width={40} height={40} />
      </div>
    </div>
  );
};
