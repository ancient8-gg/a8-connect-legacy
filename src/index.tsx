import { A8Connect } from "./lib.container";
import { NetworkType } from "./libs/providers/registry.provider";
import { ChainType } from "./libs/adapters";

const a8Connect = new A8Connect("a8-connect");
a8Connect
  .init({
    networkType: NetworkType.testnet,
    chainType: ChainType.EVM,
    onClose: () => {
      a8Connect.closeModal();
    },
  })
  .then(() => {
    a8Connect.openModal();
  });

if (window) {
  (window as any).a8Connect = a8Connect;
}
