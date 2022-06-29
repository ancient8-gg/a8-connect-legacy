import { FC } from "react";
import { WalletProvider } from "./hooks/useWallet";
import { RouterProvider } from "./hooks/router";
import { OnAuthPayload, SessionProvider } from "./hooks/useSession";
import { ChainType } from "./libs/adapters";
import { ConnectedWalletPayload } from "./libs/dto/a8-connect-session.dto";

import "./index.css";

const A8Connect: FC<{
  onClose: () => void;
  onAuth: (payload: OnAuthPayload) => void;
  onConnected: (payload: ConnectedWalletPayload) => void;
  selectedChainType: ChainType;
}> = ({ onAuth, onConnected, selectedChainType, onClose }) => {
  return (
    <div className="layout">
      <SessionProvider onAuth={onAuth}>
        <WalletProvider
          onConnected={onConnected}
          selectedChainType={selectedChainType}
        >
          <RouterProvider />
        </WalletProvider>
      </SessionProvider>
    </div>
  );
};

export default A8Connect;
