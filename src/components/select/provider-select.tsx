import { FC } from "react";
import { ChainType } from "../../libs/adapters";
import SolImage from "../../assets/images/2x_solana_welcome.png";
import EthImage from "../../assets/images/2x_eth_evm_chain.png";

import "./provider-select.scoped.css";

export const ProviderSelect: FC<{
  handleClickChain: (chainType: ChainType) => void;
}> = ({ handleClickChain }) => {
  return (
    <div>
      <button
        className={
          "select-chain-btn-sol w-full cursor-pointer mt-[20px] h-[50px] rounded-[3px] text-white"
        }
        onClick={() => handleClickChain(ChainType.SOL)}
      >
        <span className={"flex flex-row justify-center items-center"}>
          <img src={SolImage} className="h-[24px] w-[24px] mr-[3px]" />
          {"  "}
          Continue with Solana
        </span>
      </button>
      <button
        className="w-full cursor-pointer mt-[20px] h-[50px] rounded-[3px] bg-[#637eea] text-white"
        onClick={() => handleClickChain(ChainType.EVM)}
      >
        <span className={"flex flex-row justify-center items-center"}>
          <img src={EthImage} className="h-[24px] w-[16px] mr-[3px]" />
          Continue with EVM
        </span>
      </button>
    </div>
  );
};
