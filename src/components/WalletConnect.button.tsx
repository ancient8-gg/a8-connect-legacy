import React, { useMemo, useState, useEffect } from "react";
import classnames from "classnames";
import Button from "./button";
import {
  AdapterName,
  EvmAdapterName,
  SolanaAdapterName,
  AuthType,
} from "@/libs/dto/entities";
import { useAdapter } from "@/hooks/useAdapter";

export interface ConnectButtonProps {
  authType: AuthType;
  adapterName: AdapterName;
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
  authType,
  adapterName,
  text,
  className,
  textClassName,
  textStyle,
  trackingId,
  backgroundColor,
  icon,
  onClick,
}) => {
  const { isInstalled: checkInstalled } = useAdapter();
  const [isInstalled, setInstalled] = useState<boolean>(false);
  const imageData = icon;

  const isDisabled = useMemo(() => {
    if (
      adapterName === SolanaAdapterName.torus
      // ||
      // adapterName === EvmAdapterName.torus
    ) {
      return false;
    }
    return !isInstalled;
  }, [adapterName]);

  useEffect(() => {
    const value = checkInstalled({ authType, adapterName });
    setInstalled(value);
  }, []);

  return (
    <Button
      disabled={isDisabled}
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
            {(isInstalled || adapterName === SolanaAdapterName.torus) && (
              <span className={"ml-[10px] opacity-[0.6] text-[10px]"}>
                &#x1F7E2;
              </span>
            )}
          </p>
          {authType === AuthType.EVMChain
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
