import { FC } from "react";
import { WalletProvider } from "./hooks/useWallet";
import { OnAuthPayload, SessionProvider } from "./hooks/useSession";
import { ChainType } from "./libs/adapters";
import { ConnectedWalletPayload } from "./libs/dto/a8-connect-session.dto";
import { AppStateProvider } from "./hooks/useAppState";
import { RouterProvider } from "./hooks/useRouter";
import { NetworkType } from "./libs/providers/registry.provider";

import "./index.css";
import LoadingSpinner from "./components/loading-spiner";

const A8Connect: FC<{
  networkType: NetworkType;
  chainType: ChainType;
  onClose?: () => void;
  onError?: (error: Error) => void;
  onAuth?: (payload: OnAuthPayload) => void;
  onConnected?: (payload: ConnectedWalletPayload) => void;
}> = ({ onAuth, onConnected, chainType, onClose, onError, networkType }) => {
  return (
    <div className="layout">
      <AppStateProvider
        onClose={onClose}
        onAuth={onAuth}
        onConnected={onConnected}
        onError={onError}
        desiredChainType={chainType}
        networkType={networkType}
      >
        <SessionProvider>
          <div className="loading-screen w-full py-[50px] flex justify-center items-center">
            <LoadingSpinner width={40} height={40} />
          </div>
          {/*<WalletProvider>*/}
          {/*  <RouterProvider />*/}
          {/*</WalletProvider>*/}
        </SessionProvider>
      </AppStateProvider>
    </div>
  );
};

export default A8Connect;
