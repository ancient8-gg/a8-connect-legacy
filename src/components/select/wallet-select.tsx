import { FC, useCallback } from "react";
import { BaseWalletAdapter } from "../../libs/adapters";
import Button from "../button";

export interface ConnectButtonProps {
  adapter: BaseWalletAdapter;
  onClick?: () => void;
  trackingId?: string;
}

export const ConnectButton: FC<ConnectButtonProps> = ({
  adapter,
  trackingId,
  onClick,
}) => {
  const handleClick = useCallback(() => {
    if (!adapter.isInstalled()) {
      return window.open(`https://${adapter.url}`, "_blank");
    }

    return onClick();
  }, [adapter]);

  return (
    <Button
      className="px-[20px] text-black w-full text-white hover:text-white relative h-[60px]"
      disabled={false}
      onClick={handleClick}
      id={trackingId}
      containerStyle={{
        padding: "10px 16px",
        borderRadius: "3px",
        marginBottom: "20px",
        background: adapter.adapterStyle.background,
      }}
    >
      <div className="inline-flex w-full items-center h-full">
        <img
          src={adapter.adapterStyle.icon}
          className="h-[40px] rounded-[10px]"
        />
        <div className="ml-[20px] text-left relative w-full">
          <p className="normal-case text-[14px] text-white font-bold">
            {adapter.displayName}
          </p>
          <p className="text-[9px] text-bold italic max-w-[80%]">
            {adapter.url}
            {!adapter.isInstalled() && (
              <span className={"ml-[3px] opacity-[0.6] text-[9px]"}>
                (Not installed)
              </span>
            )}
          </p>
        </div>
        <img
          src={adapter.adapterStyle.icon}
          className="absolute top-0 right-[10px] h-full opacity-[0.2]"
        />
      </div>
    </Button>
  );
};
