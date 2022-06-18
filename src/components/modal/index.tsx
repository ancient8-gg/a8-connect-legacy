import React from "react";
import ReactModal from "react-modal";
import classnames from "classnames";
import { useLocation } from "../../hooks/router/component";

export interface ModalProps {
  containerClassName?: string;
  modalIsOpen: boolean;
  onCloseModal(): void;
  contentStyle?: React.CSSProperties;
  children?: React.ReactNode;
  isBack?: boolean | false;
}

export const customStyles = {
  content: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    background: "none",
    border: "none",
  },
  overlay: {
    background: "#191919bf",
  },
};

const Modal: React.FC<ModalProps> = ({
  containerClassName,
  modalIsOpen,
  onCloseModal,
  children,
  contentStyle,
  isBack,
}: any) => {
  const location = useLocation();
  return (
    <ReactModal
      isOpen={modalIsOpen}
      style={customStyles}
      contentLabel="UID Modal"
    >
      <div className={"a8connect-container absolute md:w-[450px] w-[400px]"}>
        <div className="w-full">
          <img
            src="/assets/images/top-gradient-border.svg"
            className="float-right md:w-[30%] w-[40%]"
          />
        </div>
        <div
          style={contentStyle}
          className={classnames("polygon-modal", containerClassName)}
        >
          <div className="polygon-modal-child pt-[10px] pb-[30px] ">
            {isBack && (
              <img
                className="absolute left-[20px] top-[20px] cursor-pointer"
                src="/assets/images/back-btn.png"
                onClick={() => location.goBack()}
              />
            )}
            <div className="flow-root">
              <button
                onClick={() => onCloseModal()}
                className="float-right text-[25px] text-primary-super mr-[20px]"
              >
                <i className="bx bx-x"></i>
              </button>
            </div>
            <div className="content px-[20px]">{children}</div>
          </div>
        </div>
        <div className="w-full mt-[0px]">
          <img
            src="/assets/images/bottom-gradient-border.svg"
            className="float-left md:w-[30%] w-[40%]"
          />
        </div>
      </div>
    </ReactModal>
  );
};

export default Modal;
