import { init, openModal } from "./browser";
import { NetworkType } from "./libs/providers";
import { ChainType } from "./libs/adapters";
import { AppFlow } from "./components/router";
import { RPCWalletAdapter } from "./adapter.cointainer";

if (document) {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init({
        disableCloseButton: false,
        cleanWalletCache: true,
        networkType: NetworkType.testnet,
        chainType: ChainType.SOL,
        initAppFlow: AppFlow.LOGIN_FLOW,
        async onConnected(payload) {
          if (payload.chainType === ChainType.SOL) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.rpcWallet = await RPCWalletAdapter.getSolanaWalletAdapter(
              payload.walletName
            );
          }
          if (payload.chainType === ChainType.EVM) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.rpcWallet = await RPCWalletAdapter.getEVMWalletAdapter(
              payload.walletName,
              payload.provider.injectedProvider
            );
          }
        },
      }).then(() => {
        openModal();
      });
    }
  };
}
