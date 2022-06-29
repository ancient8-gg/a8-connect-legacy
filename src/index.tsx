import { render } from "react-dom";
import A8ConnectContainer from "./container";

const rootDOM = document.getElementById("a8-connect");
if (rootDOM !== null) {
  render(
    <A8ConnectContainer
      onClose={() => {}}
      onAuth={() => {}}
      onConnected={() => {}}
      selectedChainType={"all"}
    />,
    rootDOM
  );
}
