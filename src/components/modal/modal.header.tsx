import { FC } from "react";
import BackBtnImage from "../../assets/images/back-btn.png";

export const ModalHeader: FC<{
  goBack: () => void;
  isBack: boolean;
  onCloseModal: () => void;
}> = (props) => {
  return (
    <>
      {props.isBack && (
        <img
          className="absolute left-[20px] top-[20px] cursor-pointer"
          src={BackBtnImage}
          onClick={() => props.goBack()}
        />
      )}
      <div className="flow-root">
        <button
          onClick={() => props.onCloseModal()}
          className="float-right text-[25px] text-primary-super mr-[20px]"
        >
          <i className="bx bx-x"></i>
        </button>
      </div>
    </>
  );
};
