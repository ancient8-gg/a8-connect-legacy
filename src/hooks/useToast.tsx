import { ReactNode, createContext, useContext, useState } from "react";
import ToastModal from "../components/modal/toast.modal";
import CloseIcon from "../assets/icons/close-icon.svg";

export interface ToastContextProps {
  open(title: string, description: string): void;
  success(title: string, description: string): void;
  error(title: string, description: string): void;
  close(): void;
}

export const ToastContext = createContext<ToastContextProps>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleColor, setTitleColor] = useState("#30C021");

  const open = (title: string, description: string) => {
    setTitle(title);
    setDescription(description);
    setIsOpened(true);
  };

  const error = (title: string, description: string) => {
    open(title, description);
    setTitleColor("#FF4647");
  };

  const success = (title: string, description: string) => {
    open(title, description);
    setTitleColor("#30C021");
  };

  const close = () => {
    setIsOpened(false);
  };

  return (
    <ToastContext.Provider
      value={{
        open,
        success,
        error,
        close,
      }}
    >
      <div className="absolute inset-0">{children}</div>
      <ToastModal modalIsOpen={isOpened}>
        <div
          className="absolute right-[20px] top-[10px] cursor-pointer"
          onClick={close}
        >
          <img src={CloseIcon} />
        </div>
        <p className={`text-[20px] bold-[100]`} style={{ color: titleColor }}>
          {title}
        </p>
        <p className="text-[#FFFFFF] mt-[10px] text-[16px] bold-[100]">
          {description}
        </p>
      </ToastModal>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("Must be in hook");
  }
  return context;
};
