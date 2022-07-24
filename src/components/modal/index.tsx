import { CSSProperties, FC, ReactNode, useEffect } from "react";
import ReactModal from "react-modal";
import classnames from "classnames";

import { ReactComponent as TopGradientBorder } from "../../assets/images/top-gradient-border.svg";
import { ReactComponent as BottomGradientBorder } from "../../assets/images/bottom-gradient-border.svg";

import "./index.scoped.scss";

import { useAppState } from "../../hooks/useAppState";
import { RegistryProvider } from "../../libs/providers";

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
    width: "100%",
    height: "100%",
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
  const { containerSelector, handleClose, disableCloseButton } = useAppState();
  const document = RegistryProvider.getInstance().document;

  useEffect(() => {
    if (!disableCloseButton) {
      setTimeout(() => {
        const containers = document.getElementsByClassName("a8-modal-overlay");

        for (const elm in containers) {
          containers[elm].addEventListener("click", () => {
            handleClose();
          });
        }
      }, 100);
    }
  }, []);

  return (
    <ReactModal
      className={"w-full h-full"}
      ariaHideApp={false}
      isOpen={modalIsOpen}
      style={customStyles}
      contentLabel="UID Modal"
      portalClassName={"a8-connect-container"}
      parentSelector={() => document.getElementById(containerSelector)}
    >
      <div className={"a8-modal-overlay absolute w-full h-full z-[1]"} />
      <div className={"absolute md:h-auto md:w-[378px] w-full h-full z-[99]"}>
        <div className="w-full">
          <TopGradientBorder className="float-right md:w-[30%] w-[40%]" />
        </div>
        <div
          style={contentStyle}
          className={classnames(
            "polygon-modal h-full w-full",
            containerClassName
          )}
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
