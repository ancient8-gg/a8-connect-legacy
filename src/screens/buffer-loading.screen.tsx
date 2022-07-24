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
import { BASE_NOTIFICATION_SCREEN_KEY } from "./base-notification.screen";
import { getWalletAction } from "../libs/actions";

export const BUFFER_LOADING_APP_SCREEN_KEY = "BUFFER_LOADING_APP_SCREEN";

export const BufferLoadingAppScreen: FC = () => {
  const {
    handleClose,
    desiredChainType,
    isAppReady,
    currentAppFlow,
    detectAppFlow,
    initAppFlow,
  } = useAppState();
  const { initState: initWalletState, handleWalletConnected } = useWallet();
  const { initState: initRouterState } = useRouter();
  const { initState: initSessionState, authEntities, userInfo } = useSession();
  const { push } = useLocation();

  const [isStateReset, setStateReset] = useState(false);
  const [isAppFlowReady, setAppFlowReady] = useState(false);

  const screenStateReady = useMemo(() => {
    return isStateReset && isAppReady && isAppFlowReady;
  }, [isStateReset, isAppReady, isAppFlowReady]);

  const shouldAutoCloseModal = useCallback(async () => {
    let result = false;

    try {
      result = await getWalletAction().isWalletStateValid(
        authEntities,
        desiredChainType
      );
    } catch {}

    return result;
  }, [desiredChainType, authEntities]);

  const handleNextFlow = useCallback(async () => {
    /**
     * Do nothing if screen state isn't ready
     */
    if (!screenStateReady) return;

    /**
     * Prioritize redirecting to error screen
     */
    if (
      currentAppFlow !== initAppFlow &&
      initAppFlow === AppFlow.LOST_WALLET_FLOW
    ) {
      return push(BASE_NOTIFICATION_SCREEN_KEY, {
        params: {
          isBack: false,
          disableCloseButton: false,
          status: 0,
          title: "Fail to add wallet!",
          description: `The link is expired, please resend the request to get a new link.`,
        },
      });
    }

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
    if (await shouldAutoCloseModal()) {
      /**
       * Emit connected wallet.
       */
      await handleWalletConnected();

      /**
       * Otherwise, close the modal.
       */
      setTimeout(() => {
        handleClose();
      }, 200);

      return;
    }

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
    handleWalletConnected,
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
