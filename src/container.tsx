import { FC } from "react";
import { WalletProvider } from "./hooks/useWallet";
import { OnAuthPayload, SessionProvider } from "./hooks/useSession";
import { ChainType } from "./libs/adapters";
import { ConnectedWalletPayload } from "./libs/dto/a8-connect-session.dto";
import { ResetWithNewWalletPayload } from "./libs/dto/reset-with-new-wallet.dto";
import { AppStateProvider } from "./hooks/useAppState";
import { RouterProvider } from "./hooks/useRouter";
import { AppFlow } from "./components/router/type";
import { NetworkType } from "./libs/providers";

import "./index.css";

const A8Connect: FC<{
  networkType: NetworkType;
  chainType: ChainType;
  disableCloseButton?: boolean;
  initAppFlow?: AppFlow;
  resetWithNewWalletPayload?: ResetWithNewWalletPayload;
  onClose?: () => void;
  onError?: (error: Error) => void;
  onAuth?: (payload: OnAuthPayload) => void;
  onConnected?: (payload: ConnectedWalletPayload) => void;
}> = ({
  chainType,
  networkType,
  disableCloseButton,
  initAppFlow,
  resetWithNewWalletPayload,
  onClose,
  onError,
  onAuth,
  onConnected,
}) => {
  return (
    <div className="layout">
      <AppStateProvider
        disableCloseButton={disableCloseButton}
        desiredChainType={chainType}
        networkType={networkType}
        initAppFlow={initAppFlow}
        resetWithNewWalletPayload={resetWithNewWalletPayload}
        onClose={onClose}
        onError={onError}
        onAuth={onAuth}
        onConnected={onConnected}
      >
        <SessionProvider initAppFlow={initAppFlow}>
          <WalletProvider>
            <RouterProvider />
          </WalletProvider>
        </SessionProvider>
      </AppStateProvider>
    </div>
  );
};

export default A8Connect;
