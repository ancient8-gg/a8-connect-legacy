import { FC } from "react";
import { WalletProvider } from "./hooks/useWallet";
import { RouterProvider } from "./hooks/router";
import { OnAuthPayload, SessionProvider } from "./hooks/useSession";
import { ChainType } from "./libs/adapters";
import { ConnectedWalletPayload } from "./libs/dto/a8-connect-session.dto";

import "./index.css";
import { AppStateProvider } from "./hooks/useAppState";

const A8Connect: FC<{
  selectedChainType: ChainType;
  onClose?: () => void;
  onError?: (error: Error) => void;
  onAuth?: (payload: OnAuthPayload) => void;
  onConnected?: (payload: ConnectedWalletPayload) => void;
}> = ({ onAuth, onConnected, selectedChainType, onClose, onError }) => {
  return (
    <div className="layout">
      <AppStateProvider
        onClose={onClose}
        onAuth={onAuth}
        onConnected={onConnected}
        onError={onError}
      >
        <SessionProvider>
          <WalletProvider selectedChainType={selectedChainType}>
            <RouterProvider />
          </WalletProvider>
        </SessionProvider>
      </AppStateProvider>
    </div>
  );
};

export default A8Connect;
