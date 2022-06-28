import ReactDOM from "react-dom/client";
import App from "./container";

const rootNode = document.getElementById("a8-connect") as HTMLElement;
ReactDOM.createRoot(rootNode).render(
  <App onAuth={() => {}} onConnected={() => {}} selectedChainType={"all"} />
);
