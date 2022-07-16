import {
  Adapters,
  closeModal,
  init,
  openModal,
  Providers,
  Router,
} from "./lib.entrypoint";

if (document) {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init("a8-connect", {
        disableCloseButton: false,
        cleanWalletCache: true,
        networkType: Providers.NetworkType.testnet,
        chainType: Adapters.ChainType.ALL,
        initAppFlow: Router.AppFlow.ADD_WALLET_FLOW,
        onClose: () => {
          closeModal();
        },
      }).then(() => {
        openModal();
      });
    }
  };
}
