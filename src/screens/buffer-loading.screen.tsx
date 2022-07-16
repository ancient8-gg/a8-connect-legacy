import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ModalHeader } from "../components/modal/modal.header";
import { useAppState } from "../hooks/useAppState";
import LoadingSpinner from "../components/loading-spinner";
import { AppFlow, useLocation } from "../components/router";
import { useSession } from "../hooks/useSession";
import { useWallet } from "../hooks/useWallet";
import { BASE_WELCOME_SCREEN_KEY } from "./base-welcome.screen";
import { BASE_WELCOME_ADD_WALLET_SCREEN_KEY } from "./base-welcome-add-wallet.screen";
import { BASE_WELCOME_LOST_WALLET_SCREEN_KEY } from "./base-welcome-lost-wallet.screen";
import { ChainType } from "../libs/adapters";

export const BUFFER_LOADING_APP_SCREEN_KEY = "BUFFER_LOADING_APP_SCREEN";

export const BufferLoadingAppScreen: FC = () => {
  const { handleClose, desiredChainType, isAppReady, currentAppFlow } =
    useAppState();
  const {
    initState: initWalletState,
    isWalletConnected,
    chainType,
    walletAddress,
  } = useWallet();
  const { initState: initSessionState, authEntities } = useSession();
  const { push } = useLocation();

  const [isStateReset, setStateReset] = useState(false);

  const screenStateReady = useMemo(() => {
    return isStateReset && isAppReady;
  }, [isStateReset, isAppReady]);

  const shouldAutoCloseModal = useMemo(() => {
    /**
     * Prepare conditions
     */
    const connectedAuthEntity = authEntities.find(
      (wallet) => wallet.credential.walletAddress === walletAddress
    );
    console.log("connectedAuthEntity", connectedAuthEntity);

    const connectedWalletBelongsToCurrentUid = !!connectedAuthEntity;
    console.log(
      "connectedWalletBelongsToCurrentUid",
      connectedWalletBelongsToCurrentUid
    );

    const connectedWalletMatchedDesiredChainType =
      (isWalletConnected && chainType === desiredChainType) ||
      desiredChainType === ChainType.ALL;
    console.log(
      "connectedWalletMatchedDesiredChainType",
      connectedWalletMatchedDesiredChainType
    );
    const uidConnectedChainTypeMatchedDesiredChainType =
      connectedAuthEntity?.type.toString() === desiredChainType.toString() ||
      desiredChainType === ChainType.ALL;
    console.log(
      "uidConnectedChainTypeMatchedDesiredChainType",
      uidConnectedChainTypeMatchedDesiredChainType
    );

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
    /**
     * Do nothing if screen state isn't ready
     */
    if (!screenStateReady) return;
    console.log("shouldAutoCloseModal", shouldAutoCloseModal);
    if (shouldAutoCloseModal) {
      /**
       * Otherwise, close the modal
       */
      setTimeout(() => {
        handleClose();
      }, 300);

      return;
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
     * Prioritize fallback to default flow
     */
    return push(BASE_WELCOME_SCREEN_KEY);
  }, [handleClose, currentAppFlow, screenStateReady, shouldAutoCloseModal]);

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
