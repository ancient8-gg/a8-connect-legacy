import { CSSProperties, FC, ReactNode } from "react";
import ReactModal from "react-modal";
import classnames from "classnames";

import { ReactComponent as TopGradientBorder } from "../../assets/images/top-gradient-border.svg";
import { ReactComponent as BottomGradientBorder } from "../../assets/images/bottom-gradient-border.svg";

import "./index.scoped.scss";

export interface ModalProps {
  containerClassName?: string;
  modalIsOpen: boolean;
  contentStyle?: CSSProperties;
  children?: ReactNode;
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

export const Modal: FC<ModalProps> = ({
  containerClassName,
  modalIsOpen,
  children,
  contentStyle,
}: ModalProps) => {
  return (
    <ReactModal
      className={"w-full h-full"}
      ariaHideApp={false}
      isOpen={modalIsOpen}
      style={customStyles}
      contentLabel="UID Modal"
      id="a8-connect-container"
    >
      <div
        className={
          "a8connect-container absolute md:h-auto md:w-[378px] w-full h-full"
        }
      >
        <div className="w-full">
          <TopGradientBorder className="float-right md:w-[30%] w-[40%]" />
        </div>
        <div
          style={contentStyle}
          className={classnames("polygon-modal h-full", containerClassName)}
        >
          <div className="polygon-modal-child px-[24px] py-[20px]">
            {children}
          </div>
        </div>
        <div className="w-full mt-[0px]">
          <BottomGradientBorder className="float-left md:w-[30%] w-[40%]" />
        </div>
      </div>
    </ReactModal>
  );
};

export default Modal;
