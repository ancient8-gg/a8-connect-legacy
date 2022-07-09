import {
  init,
  openModal,
  closeModal,
  Providers,
  Adapters,
  AppFlow,
} from "./lib.entrypoint";

if (document) {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init("a8-connect", {
        disableCloseButton: true,
        cleanWalletCache: true,
        networkType: Providers.NetworkType.testnet,
        chainType: Adapters.ChainType.SOL,
        initAppFlow: AppFlow.ADD_WALLET_FLOW,
        onClose: () => {
          closeModal();
        },
      }).then(() => {
        openModal();
      });
    }
  };
}
