import { CSSProperties, FC, ReactNode } from "react";
import ReactModal from "react-modal";

import "./toast.modal.scoped.scss";

export interface ModalProps {
  containerClassName?: string;
  modalIsOpen: boolean;
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
    background: "transparent",
  },
};

const Modal: FC<ModalProps> = ({ modalIsOpen, children }: ModalProps) => {
  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={modalIsOpen}
      style={customStyles}
      contentLabel="UID Toast Modal"
      portalClassName={"a8-connect-container"}
      parentSelector={() => document.getElementById("a8-connect-container")}
    >
      <div className={"sdk-toast-container w-[283px] bg-[#979797]"}>
        {children}
      </div>
    </ReactModal>
  );
};

export default Modal;
