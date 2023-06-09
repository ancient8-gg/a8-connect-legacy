import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import ToastModal from "../components/modal/toast.modal";
import { ReactComponent as CloseIcon } from "../assets/icons/close-icon.svg";

export interface ToastContextProps {
  open(title: string, description: string): void;
  success(title: string, description: string, onClose?: () => void): void;
  error(title: string, description: string, onClose?: () => void): void;
  close(): void;
}

export const ToastContext = createContext<ToastContextProps>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleColor, setTitleColor] = useState("#30C021");
  const [onClose, setOnClose] = useState<() => void>();

  const open = (title: string, description: string) => {
    setTitle(title);
    setDescription(description);
    setIsOpened(true);
  };

  const error = (title: string, description: string, onClose?: () => void) => {
    open(title, description);
    setTitleColor("#FF4647");
    onClose !== undefined && setOnClose(onClose);
  };

  const success = (
    title: string,
    description: string,
    onClose?: () => void
  ) => {
    open(title, description);
    setTitleColor("#30C021");
    onClose !== undefined && setOnClose(onClose);
  };

  const close = useCallback(() => {
    setIsOpened(false);
    onClose !== undefined && onClose();
  }, [onClose]);

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
          className="absolute right-[5px] top-[5px] cursor-pointer"
          onClick={close}
        >
          <CloseIcon className={"h-[20px] w-[20px]"} />
        </div>
        <p className={`text-[20px] bold-[100]`} style={{ color: titleColor }}>
          {title}
        </p>
        <p className="text-[#FFFFFF] mt-[10px] text-[16px] bold-[100] opacity-[0.75]">
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
