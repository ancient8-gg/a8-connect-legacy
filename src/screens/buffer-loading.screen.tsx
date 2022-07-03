import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ModalHeader } from "../components/modal/modal.header";
import { useAppState } from "../hooks/useAppState";
import LoadingSpinner from "../components/loading-spiner";
import { AppFlow, useLocation } from "../components/router";
import { useSession } from "../hooks/useSession";
import { useWallet } from "../hooks/useWallet";
import { BASE_WELCOME_SCREEN_KEY } from "./base-welcome.screen";
import { ChainType } from "../libs/adapters";

export const BUFFER_LOADING_APP_SCREEN_KEY = "BUFFER_LOADING_APP_SCREEN";

export const BufferLoadingAppScreen: FC = () => {
  const { handleClose, desiredChainType, currentAppFlow, isAppReady } =
    useAppState();
  const {
    initState: initWalletState,
    isWalletConnected,
    chainType,
    walletAddress,
  } = useWallet();
  const { initState: initSessionState, userInfo, authEntities } = useSession();
  const { push } = useLocation();

  const [isStateReset, setStateReset] = useState(false);

  const screenStateReady = useMemo(() => {
    return isStateReset && isAppReady;
  }, [isStateReset, isAppReady]);

  const shouldGoToLoginFlow = useMemo(() => {
    return currentAppFlow === AppFlow.LOGIN_FLOW;
  }, [currentAppFlow]);

  const shouldGoToConnectFlow = useMemo(() => {
    /**
     * Extract uid chain type
     */
    const uidConnectedChainType =
      (userInfo?.session.authWallets[0].type as string) || "";

    /**
     * Prepare conditions
     */
    const connectedWalletBelongsToCurrentUid = !!authEntities.find(
      (wallet) => wallet.credential.walletAddress === walletAddress
    );

    const connectedWalletMatchedDesiredChainType =
      (isWalletConnected && chainType === desiredChainType) ||
      desiredChainType === ChainType.ALL;

    const uidConnectedChainTypeMatchedDesiredChainType =
      uidConnectedChainType.toString() === desiredChainType.toString() ||
      desiredChainType === ChainType.ALL;

    /**
     * Go to connect flow
     */
    return !(
      connectedWalletMatchedDesiredChainType &&
      connectedWalletBelongsToCurrentUid &&
      uidConnectedChainTypeMatchedDesiredChainType
    );
  }, [isWalletConnected, userInfo, desiredChainType, walletAddress]);

  const handleNextFlow = useCallback(() => {
    /**
     * Do nothing if screen state isn't ready
     */
    if (!screenStateReady) return;

    /**
     * Prioritize redirecting to login flow first
     */
    if (shouldGoToLoginFlow || shouldGoToConnectFlow) {
      return push(BASE_WELCOME_SCREEN_KEY);
    }

    /**
     * Otherwise, close the modal
     */
    setTimeout(() => {
      handleClose();
    }, 300);
  }, [
    shouldGoToLoginFlow,
    shouldGoToConnectFlow,
    handleClose,
    screenStateReady,
  ]);

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
  }, [initSessionState, initWalletState]);

  useEffect(() => {
    resetAppState();
  }, []);

  useEffect(() => {
    handleNextFlow();
  }, [screenStateReady]);

  return (
    <div>
      <ModalHeader isBack={false} onCloseModal={handleClose} goBack={null} />
      <div className="loading-screen w-full py-[50px] flex justify-center items-center">
        <LoadingSpinner width={40} height={40} />
      </div>
    </div>
  );
};
