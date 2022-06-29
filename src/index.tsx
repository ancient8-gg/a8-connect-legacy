import { render } from "react-dom";
import A8ConnectContainer from "./container";
import { ChainType } from "./libs/adapters";

const rootDOM = document.getElementById("a8-connect");
if (rootDOM !== null) {
  render(
    <A8ConnectContainer
      onClose={() => {}}
      onAuth={() => {}}
      onConnected={() => {}}
      selectedChainType={ChainType.SOL}
    />,
    rootDOM
  );
}
