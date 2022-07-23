import { init, openModal } from "./browser";
import { NetworkType } from "./libs/providers";
import { ChainType } from "./libs/adapters";
import { AppFlow } from "./components/router";

if (document) {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init({
        disableCloseButton: false,
        cleanWalletCache: true,
        networkType: NetworkType.testnet,
        chainType: ChainType.EVM,
        initAppFlow: AppFlow.LOGIN_FLOW,
      }).then(() => {
        openModal();
      });
    }
  };
}
