import { CSSProperties, FC, ReactNode } from "react";
import ReactModal from "react-modal";

import { useAppState } from "../../hooks/useAppState";

import "./toast.modal.scoped.scss";
import { RegistryProvider } from "../../libs/providers";

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
  const { containerSelector } = useAppState();
  const document = RegistryProvider.getInstance().document;

  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={modalIsOpen}
      style={customStyles}
      contentLabel="UID Toast Modal"
      portalClassName={"a8-connect-container"}
      parentSelector={() => document.getElementById(containerSelector)}
    >
      <div className={"sdk-toast-container w-[283px] opacity-[1]"}>
        {children}
      </div>
    </ReactModal>
  );
};

export default Modal;
