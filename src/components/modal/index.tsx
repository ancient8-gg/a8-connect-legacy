import { CSSProperties, FC, ReactNode } from "react";
import ReactModal from "react-modal";
import classnames from "classnames";
import { useLocation } from "../../hooks/router";
import TopGradientBorder from "../../assets/images/top-gradient-border.svg";
import BottomGradientBorder from "../../assets/images/bottom-gradient-border.svg";
import { ModalHeader } from "./modal.header";

export interface ModalProps {
  containerClassName?: string;
  modalIsOpen: boolean;
  onCloseModal(): void;
  contentStyle?: CSSProperties;
  children?: ReactNode;
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

const Modal: FC<ModalProps> = ({
  containerClassName,
  modalIsOpen,
  onCloseModal,
  children,
  contentStyle,
  isBack,
}: ModalProps) => {
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
            src={TopGradientBorder}
            className="float-right md:w-[30%] w-[40%]"
          />
        </div>
        <div
          style={contentStyle}
          className={classnames("polygon-modal", containerClassName)}
        >
          <div className="polygon-modal-child pt-[10px] pb-[30px] ">
            <ModalHeader
              onCloseModal={onCloseModal}
              isBack={isBack}
              goBack={() => location.goBack()}
            />

            <div className="content px-[20px]">{children}</div>
          </div>
        </div>
        <div className="w-full mt-[0px]">
          <img
            src={BottomGradientBorder}
            className="float-left md:w-[30%] w-[40%]"
          />
        </div>
      </div>
    </ReactModal>
  );
};

export default Modal;
