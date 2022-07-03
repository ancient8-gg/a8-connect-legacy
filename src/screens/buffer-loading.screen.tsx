import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ModalHeader } from "../components/modal/modal.header";
import { useAppState } from "../hooks/useAppState";
import LoadingSpinner from "../components/loading-spiner";
import { useLocation, useRouter } from "../components/router";
import { useSession } from "../hooks/useSession";
import { useWallet } from "../hooks/useWallet";

export const BUFFER_LOADING_APP_SCREEN_KEY = "BUFFER_LOADING_APP_SCREEN";

export const BufferLoadingAppScreen: FC = () => {
  const { handleClose, desiredChainType, isUIDReady } = useAppState();
  const { initState: initRouterState } = useRouter();
  const { initState: initWalletState } = useWallet();
  const { initState: initSessionState, userInfo } = useSession();
  const [isStateReset, setStateReset] = useState(false);
  const { push } = useLocation();

  const handleNextFlow = useCallback(() => {
    /**
     * Do nothing if the state isn't reset
     */
    if (!isStateReset) return;

    /**
     * Do nothing if UID isn't ready
     */
    if (!isUIDReady) return;

    if (!userInfo) {
    }

    /**
     * Extract uid chain type
     */
    const uidConnectedChainType = userInfo?.session.authWallets[0]
      .type as string;

    /**
     * Do nothing if desired chain type matched UID connected chain type
     */
    if (uidConnectedChainType.toString() === desiredChainType.toString())
      return;
  }, [userInfo, isStateReset, isUIDReady]);

  const resetAppState = useCallback(async () => {
    /**
     * Initially set state reset flag to false
     */
    setStateReset(false);

    /**
     * Reset session and wallet state first
     */
    await Promise.all([initSessionState(), initWalletState()]);

    /**
     * Set state reset flag
     */
    setStateReset(true);
  }, [initSessionState, initRouterState, initWalletState]);

  return (
    <div>
      <ModalHeader isBack={false} onCloseModal={handleClose} goBack={null} />
      <div className="loading-screen w-full py-[50px] flex justify-center items-center">
        <LoadingSpinner width={40} height={40} />
      </div>
    </div>
  );
};
