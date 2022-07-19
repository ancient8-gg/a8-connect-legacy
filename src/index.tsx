import { Adapters, init, openModal, Providers, Router } from "./lib.entrypoint";

if (document) {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init({
        disableCloseButton: false,
        cleanWalletCache: true,
        networkType: Providers.NetworkType.testnet,
        chainType: Adapters.ChainType.EVM,
        initAppFlow: Router.AppFlow.LOST_WALLET_FLOW,
      }).then(() => {
        openModal();
      });
    }
  };
}
