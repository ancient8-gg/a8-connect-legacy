import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ModalHeader } from "../components/modal/modal.header";
import { useAppState } from "../hooks/useAppState";
import LoadingSpinner from "../components/loading-spinner";
import { AppFlow, useLocation, useRouter } from "../components/router";
import { useSession } from "../hooks/useSession";
import { useWallet } from "../hooks/useWallet";
import { BASE_WELCOME_SCREEN_KEY } from "./base-welcome.screen";
import { BASE_WELCOME_ADD_WALLET_SCREEN_KEY } from "./base-welcome-add-wallet.screen";
import { BASE_WELCOME_LOST_WALLET_SCREEN_KEY } from "./base-welcome-lost-wallet.screen";
import { ChainType } from "../libs/adapters";

export const BUFFER_LOADING_APP_SCREEN_KEY = "BUFFER_LOADING_APP_SCREEN";

export const BufferLoadingAppScreen: FC = () => {
  const {
    handleClose,
    desiredChainType,
    isAppReady,
    currentAppFlow,
    detectAppFlow,
  } = useAppState();

  const {
    initState: initWalletState,
    isWalletConnected,
    chainType,
    walletAddress,
  } = useWallet();

  const { initState: initRouterState } = useRouter();

  const { initState: initSessionState, authEntities, userInfo } = useSession();
  const { push } = useLocation();

  const [isStateReset, setStateReset] = useState(false);
  const [isAppFlowReady, setAppFlowReady] = useState(false);

  const screenStateReady = useMemo(() => {
    return isStateReset && isAppReady && isAppFlowReady;
  }, [isStateReset, isAppReady, isAppFlowReady]);

  const shouldAutoCloseModal = useMemo(() => {
    /**
     * Prepare conditions
     */
    const connectedAuthEntity = authEntities.find(
      (wallet) => wallet.credential.walletAddress === walletAddress
    );

    const connectedWalletBelongsToCurrentUid = !!connectedAuthEntity;

    const connectedWalletMatchedDesiredChainType =
      (isWalletConnected && chainType === desiredChainType) ||
      desiredChainType === ChainType.ALL;

    const uidConnectedChainTypeMatchedDesiredChainType =
      connectedAuthEntity?.type.toString() === desiredChainType.toString() ||
      desiredChainType === ChainType.ALL;

    /**
     * Go to connect flow
     */
    return (
      connectedWalletMatchedDesiredChainType &&
      connectedWalletBelongsToCurrentUid &&
      uidConnectedChainTypeMatchedDesiredChainType
    );
  }, [
    isWalletConnected,
    desiredChainType,
    walletAddress,
    authEntities,
    chainType,
  ]);

  const handleNextFlow = useCallback(() => {
    console.log({ screenStateReady });

    /**
     * Do nothing if screen state isn't ready
     */
    if (!screenStateReady) return;

    /**
     * Prioritize redirecting to add lost wallet screen
     */
    if (currentAppFlow === AppFlow.LOST_WALLET_FLOW) {
      return push(BASE_WELCOME_LOST_WALLET_SCREEN_KEY);
    }

    /**
     * Prioritize redirecting to add wallet screen
     */
    if (currentAppFlow === AppFlow.ADD_WALLET_FLOW) {
      return push(BASE_WELCOME_ADD_WALLET_SCREEN_KEY);
    }

    /**
     * Auto close modal
     */
    if (shouldAutoCloseModal) {
      /**
       * Otherwise, close the modal
       */
      setTimeout(() => {
        handleClose();
      }, 200);

      return;
    }

    console.log("should push to BASE_WELCOME_SCREEN_KEY");

    /**
     * Fallback to default flow
     */
    return push(BASE_WELCOME_SCREEN_KEY);
  }, [
    handleClose,
    currentAppFlow,
    screenStateReady,
    shouldAutoCloseModal,
    push,
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

  const setupAppFlow = useCallback(() => {
    setAppFlowReady(false);

    const appFlow = detectAppFlow(!!userInfo);

    initRouterState(appFlow);

    setAppFlowReady(true);
  }, [userInfo, initRouterState]);

  useEffect(() => {
    resetAppState();
  }, []);

  useEffect(() => {
    if (isStateReset) {
      setupAppFlow();
    }
  }, [isStateReset]);

  useEffect(() => {
    if (screenStateReady) {
      handleNextFlow();
    }
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
