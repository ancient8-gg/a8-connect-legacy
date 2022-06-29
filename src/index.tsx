import React from "react";
import ReactDOM from "react-dom";
import A8ConnectContainer from "./container";

const rootDOM = document.getElementById("a8-connect");
if (rootDOM !== null) {
  ReactDOM.render(
    <A8ConnectContainer
      onAuth={() => {}}
      onConnected={() => {}}
      selectedChainType={"all"}
    />,
    rootDOM
  );
}
