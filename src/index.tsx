import {
  Adapters,
  init,
  openModal,
  Providers,
  Router,
} from "./exports/browser";

if (document) {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init({
        disableCloseButton: false,
        cleanWalletCache: true,
        networkType: Providers.NetworkType.testnet,
        chainType: Adapters.ChainType.EVM,
        initAppFlow: Router.AppFlow.LOGIN_FLOW,
      }).then(() => {
        openModal();
      });
    }
  };
}
