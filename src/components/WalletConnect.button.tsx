import React, { useState } from "react";
import classnames from "classnames";
import Button from "./button";
import {
  BaseWalletAdapter,
  ChainType
} from '@/libs/adapters/interface';

export interface ConnectButtonProps {
  adapter: BaseWalletAdapter;
  className?: string;
  textClassName?: string;
  text: string;
  containerStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  onClick: () => void;
  trackingId?: string;
  backgroundColor: string;
  icon: {
    left: string;
    right: string;
  };
}

const chainIcons = {
  EVMChain: [
    `/assets/icons/eth/eth.png`,
    `/assets/icons/eth/bnb.png`,
    `/assets/icons/eth/poilygon.png`,
    `/assets/icons/eth/1.png`,
    `/assets/icons/eth/2.png`,
    `/assets/icons/eth/3.png`,
  ],
  SOLChain: [`/assets/icons/sol/sol.png`],
};

const ConnectButton: React.FC<ConnectButtonProps> = ({
  adapter,
  text,
  className,
  textClassName,
  textStyle,
  trackingId,
  backgroundColor,
  icon,
  onClick,
}) => {
  const imageData = icon;
  return (
    <Button
      disabled={adapter.isInstalled()}
      onClick={onClick}
      id={trackingId}
      containerStyle={{
        padding: "10px 16px",
        borderRadius: "3px",
        marginBottom: "20px",
        background: backgroundColor,
      }}
      className={
        "px-[20px] bg-metamask text-black w-full text-white hover:text-white relative" +
        className
      }>
      <div className="inline-flex w-full items-center">
        <img src={imageData.left} className="h-[40px] rounded-[10px]" />
        <div className="ml-[20px] text-left relative w-full">
          <p
            className={classnames(
              textClassName,
              "normal-case md:text-[16px] text-[12px] text-white font-medium"
            )}
            style={textStyle}
          >
            {text}
            {adapter.isInstalled() && (
              <span className={"ml-[10px] opacity-[0.6] text-[10px]"}>
                &#x1F7E2;
              </span>
            )}
          </p>
          {adapter.chainType === ChainType.EVM
            ? chainIcons.EVMChain.map((item: string, index: number) => (
              <img
                className={classnames(
                  item,
                  "mt-[5px] mr-[10px] text-gray float-left h-[12px]"
                )}
                key={`evm-icon-item-${index}`}
                src={item}
              />
            ))
            : chainIcons.SOLChain.map((item: string, index: number) => (
              <img
                className={classnames(
                  item,
                  "mt-[5px] mr-[10px] text-gray float-left h-[12px]"
                )}
                key={`sol-icon-item-${index}`}
                src={item}
              />
            ))}
        </div>
        <img
          className="absolute top-0 right-[10px] h-full opacity-[0.2]"
          src={imageData.right}
        />
      </div>
    </Button>
  );
};

export default ConnectButton;
