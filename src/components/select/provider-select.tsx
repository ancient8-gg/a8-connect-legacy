import { FC } from "react";
import { ChainType } from "../../libs/adapters";
import SolImage from "../../assets/images/sol-chain-preview.png";
import EthImage from "../../assets/images/eth.png";

import "./provider-select.scoped.css";

// import classnames from "classnames";

export const ProviderSelect: FC<{
  handleClickChain: (chainType: ChainType) => void;
}> = ({ handleClickChain }) => {
  return (
    <div>
      <button
        className={
          "select-chain-btn-sol w-full cursor-pointer mt-[20px] h-[50px] rounded-[10px] text-white"
        }
        onClick={() => handleClickChain(ChainType.SOL)}
      >
        <span className={"flex flex-row justify-center items-center"}>
          <img src={SolImage} className="h-[24px] w-[24px]" />
          {"  "}
          Continue with Solana
        </span>
      </button>
      <button
        className="w-full cursor-pointer mt-[20px] h-[50px] rounded-[10px] bg-[#637eea] text-white"
        onClick={() => handleClickChain(ChainType.EVM)}
      >
        <span className={"flex flex-row justify-center items-center"}>
          <img src={EthImage} className="h-[24px] w-[24px]" />
          {"  "}
          Continue with EVM
        </span>
      </button>
    </div>
  );
};
