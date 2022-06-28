import React from "react";
import { WalletProvider } from "./hooks/useWallet";
import { RouterProvider } from "./hooks/router";
import { OnAuthPayload, SessionProvider } from "./hooks/useSession";
import { ChainType } from "./libs/adapters";
import { ConnectedWalletPayload } from "./libs/dto/a8-connect-session.dto";

import "./index.css";

const A8Connect: React.FC<{
  onAuth: (payload: OnAuthPayload) => void;
  onConnected: (payload: ConnectedWalletPayload) => void;
  selectedChainType: ChainType | "all";
}> = ({ onAuth, onConnected, selectedChainType }) => {
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
