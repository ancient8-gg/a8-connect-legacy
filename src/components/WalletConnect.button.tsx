import React from "react";
import classnames from "classnames";
import Button from "./button";
import { BaseWalletAdapter } from "../libs/adapters/interface";

export interface ConnectButtonProps {
  adapter: BaseWalletAdapter;
  className?: string;
  textClassName?: string;
  containerStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  onClick?: () => void;
  trackingId?: string;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  adapter,
  className,
  textClassName,
  textStyle,
  trackingId,
  onClick,
}) => {
  return (
    <Button
      disabled={adapter.isInstalled()}
      onClick={onClick}
      id={trackingId}
      containerStyle={{
        padding: "10px 16px",
        borderRadius: "3px",
        marginBottom: "20px",
        background: adapter?.adapterStyle?.background,
      }}
      className={classnames(
        "px-[20px] text-black w-full text-white hover:text-white relative",
        className
      )}
    >
      <div className="inline-flex w-full items-center">
        <img
          src={adapter?.adapterStyle?.icon}
          className="h-[40px] rounded-[10px]"
        />
        <div className="ml-[20px] text-left relative w-full">
          <p
            className={classnames(
              textClassName,
              "normal-case md:text-[16px] text-[14px] text-white font-bold"
            )}
            style={textStyle}
          >
            {adapter?.adapterStyle?.title_name}
          </p>
          <p className="text-[12px] text-bold">
            {adapter?.adapterStyle?.url}
            {!adapter?.isInstalled() && (
              <span className={"ml-[1px] opacity-[0.6] text-[10px]"}>
                (Not installed)
              </span>
            )}
          </p>
        </div>
        <img
          src={adapter?.adapterStyle?.icon}
          className="absolute top-0 right-[10px] h-full opacity-[0.2]"
        />
      </div>
    </Button>
  );
};
