import { FC } from "react";
import BackBtnImage from "../../assets/images/back-btn.png";
import { useAppState } from "../../hooks/useAppState";

export const ModalHeader: FC<{
  goBack: () => void;
  isBack: boolean;
  onCloseModal: () => void;
}> = (props) => {
  const { disableCloseButton } = useAppState();

  return (
    <div className="flow-root h-[60px]">
      {props.isBack && (
        <img
          className="absolute left-[20px] top-[20px] cursor-pointer"
          src={BackBtnImage}
          onClick={() => props.goBack()}
        />
      )}
      {!disableCloseButton && (
        <button
          onClick={() => props.onCloseModal()}
          className="float-right text-[25px] text-primary-super mr-[20px] text-white"
        >
          x
        </button>
      )}
    </div>
  );
};
