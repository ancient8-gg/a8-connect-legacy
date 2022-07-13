import { FC, ReactNode } from "react";
import BackBtnImage from "../../assets/images/back-btn.png";
import { useAppState } from "../../hooks/useAppState";

export const ModalHeader: FC<{
  isBack?: boolean;
  onCloseModal?: () => void;
  goBack?: () => void;
  title?: string | ReactNode;
}> = (props) => {
  const { disableCloseButton } = useAppState();

  return (
    <div className="flex flex-row items-center h-[30px]">
      <div className="flex-1">
        {props.isBack && (
          <img
            className="cursor-pointer"
            src={BackBtnImage}
            onClick={() => props.goBack()}
          />
        )}
      </div>
      <div className="flex-10 text-center text-gray">
        {props.title && <div className="text-[16px]">{props.title}</div>}
      </div>
      <div className="flex-1">
        {!disableCloseButton && (
          <button
            onClick={() => props.onCloseModal()}
            className="float-right text-primary-super text-[#2EB835] text-[16px]"
          >
            x
          </button>
        )}
      </div>
    </div>
  );
};
