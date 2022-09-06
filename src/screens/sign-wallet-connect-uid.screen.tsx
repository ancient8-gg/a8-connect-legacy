import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { getAuthAction } from "../libs/actions/";
import { useSession } from "../hooks/useSession";
import { useWallet } from "../hooks/useWallet";
import { makeShorter } from "../utils";
import { WalletCredentialAuthDto } from "../libs/dto/wallet-credential-auth.dto";
import { LoginWalletAuthDto } from "../libs/dto/login-wallet-auth.dto";
import { CreateAuthDto } from "../libs/dto/create-auth.dto";
import { PolygonButton } from "../components/button";
import LoadingSpinner from "../components/loading-spinner";
import { BUFFER_LOADING_APP_SCREEN_KEY } from "./buffer-loading.screen";
import {
  AuthChallenge,
  AuthType,
  ConnectAgendaType,
  WalletCredential,
} from "../libs/dto/entities";
import { ChainType } from "../libs/adapters/";
import { useLocation } from "../components/router";
import { ModalHeader } from "../components/modal/modal.header";
import { useAppState } from "../hooks/useAppState";
import { useToast } from "../hooks/useToast";
import { getUtilsProvider } from "../libs/providers";

export const SIGN_WALLET_CONNECT_UID_KEY = "SIGN_WALLET_CONNECT_UID";

export const SignWalletConnectUID: FC = () => {
  const [description, setDescription] = useState<string>("");
  const [signing, setSigning] = useState<boolean>(false);
  const [isBelongedError, setBelongedError] = useState<boolean>(false);
  const [connectAgenda, setConnectAgenda] = useState<ConnectAgendaType>();
  const [authChallenge, setAuthChallenge] = useState<AuthChallenge>();
  const { userInfo, authEntities, logout, signIn } = useSession();
  const { chainType, walletAddress, sign, connect, handleWalletConnected } =
    useWallet();
  const { handleClose } = useAppState();
  const { goBack, isBack, push } = useLocation();
  const toast = useToast();
  const authAction = getAuthAction();
  const utilsProvider = getUtilsProvider();

  let handler: () => void;

  const stopHandler = useCallback(() => {
    if (typeof handler === "function") {
      handler();
    }
  }, []);

  const handleRequestAuthChallenge = async () => {
    const authChallenge = await authAction.requestAuthChallenge(walletAddress);
    setAuthChallenge(authChallenge);
  };

  const handleLogin = useCallback(
    async (createAuthDto: CreateAuthDto) => {
      const loginResponse = await signIn(createAuthDto as LoginWalletAuthDto);

      if (loginResponse.accessToken) {
        push(BUFFER_LOADING_APP_SCREEN_KEY);
      }
    },
    [signIn]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    push(BUFFER_LOADING_APP_SCREEN_KEY);
  }, [logout, goBack]);

  const handleConnectNewWallet = useCallback(async () => {
    /**
     * Raise this error if user already has 10 wallets
     */
    if (authEntities.length >= 10) {
      toast.error(
        "Failed to add wallet!",
        "You can only add a maximum of 10 wallets to your UID."
      );
      return;
    }

    /**
     * Indicate the signing process is running
     */
    setSigning(true);

    /**
     * Call stop handler
     */
    stopHandler();

    /**
     * Re-connect again to make sure the wallet is always connected
     */
    await connect();

    try {
      const signature = await sign(authChallenge.message);
      const credential: WalletCredentialAuthDto = {
        authChallengeId: authChallenge._id,
        walletAddress: authChallenge.target,
        signedData: signature,
      };

      const createAuthDto: CreateAuthDto = {
        type: authType,
        credential: credential,
      };

      await authAction.connectWallet(createAuthDto);

      /**
       * Push to loading screen if connect successfully
       */
      push(BUFFER_LOADING_APP_SCREEN_KEY);
    } catch {
      /**
       * Raise error and restart interval wallet syncing process
       */
      toast.error(
        "Failed to add wallet!",
        "The wallet isn't eligible to add to your UID."
      );
      handler = utilsProvider.withInterval(async () => {
        await connect();
      }, 500);
    }

    /**
     * Close signing process
     */
    setSigning(false);
  }, [authChallenge, connectAgenda, sign, handleLogin]);

  const handleCancelConnectUid = useCallback(() => {
    goBack();
  }, [goBack]);

  const authType = useMemo<AuthType>(() => {
    return chainType === ChainType.EVM ? AuthType.EVMChain : AuthType.Solana;
  }, [chainType]);

  useEffect(() => {
    (async () => {
      const inIncluded =
        authEntities.filter(
          (item) =>
            (item.type === AuthType.EVMChain ||
              item.type === AuthType.Solana) &&
            (item.credential as WalletCredential).walletAddress ===
              walletAddress
        ).length > 0;

      if (inIncluded) {
        /**
         * Explain a little about this screen: user already chose the provider that matched with
         * the desired chain. So it's ok to redirect back to BUFFER_LOADING_APP_SCREEN to process
         * next flow.
         */
        setConnectAgenda(ConnectAgendaType.connectExistWallet);
        setDescription(
          `The wallet already connected to App and UID: <span class="text-primary">${makeShorter(
            userInfo?._id
          )}</span>.`
        );
        setBelongedError(false);
        await handleWalletConnected();
        return;
      }

      /**
       * Request auth challenge here
       */
      await handleRequestAuthChallenge();

      /**
       Inform error exists in another UID
       */
      const isWalletExisted = await authAction.isWalletExisted(walletAddress);
      setBelongedError(isWalletExisted);
      if (isWalletExisted) {
        setConnectAgenda(ConnectAgendaType.connectExistWallet);
        setDescription(null);
        /**
         * Disconnect wallet when have error while connect with the UID
         */
        return;
      }

      setConnectAgenda(ConnectAgendaType.connectNewWallet);
      setDescription(
        `Hey, <span class='text-primary'> this is a new wallet, </span> 
        want to connect <br />
        wallet to the UID: 
        <span class='text-primary'>${makeShorter(userInfo._id)}</span>?`
      );
    })();
  }, [walletAddress, userInfo, authEntities]);

  useEffect(() => {
    handler = utilsProvider.withInterval(async () => {
      await connect();
    }, 500);
    return () => handler();
  }, []);

  return (
    <div>
      <ModalHeader
        title={"CONNECT WALLET TO APP"}
        isBack={isBack}
        onCloseModal={handleClose}
        goBack={goBack}
      />
      <div className="sm:py-[0px] py-[5%]">
        <div className="sign-wallet-screen w-full pt-[30px]">
          <div className="mx-auto">
            <div>
              <div className="mt-[30px]">
                <p className="text-white text-[20px] text-center font-bold">
                  SELECTED WALLET ADDRESS
                </p>
                <p className="text-primary text-[20px] text-center font-bold">
                  {makeShorter(walletAddress)}
                </p>
                <p
                  dangerouslySetInnerHTML={{ __html: description || "" }}
                  className="text-center text-white text-[16px] mt-[30px]"
                />
              </div>
              {isBelongedError && (
                <>
                  <div className="flex justify-center mt-[30px] items-center">
                    <div className="w-full rounded-[8px] px-[15px] py-[10px] bg-[#5537004d] flex">
                      <div className="float-left pl-[20px] text-[#b57b0ff5] italic">
                        <p className="text-[14px]">
                          The wallet you selected already belongs to another
                          UID.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-[30px]">
                    <p className="text-[16px] text-white text-center font-bold">
                      Please select another wallet or re-login with this wallet
                    </p>
                  </div>
                </>
              )}
            </div>
            {connectAgenda === ConnectAgendaType.connectExistWallet &&
              !isBelongedError && (
                <div className="button-container mt-[60px] flex justify-center">
                  <PolygonButton
                    boxStyle={{
                      width: "100%",
                      float: "left",
                      marginLeft: "10px",
                    }}
                    containerStyle={{ width: "100%", background: "#12151B" }}
                    onClick={() => push(BUFFER_LOADING_APP_SCREEN_KEY)}
                  >
                    <p className="text-white text-[0.9em]">Continue</p>
                  </PolygonButton>
                </div>
              )}
            {connectAgenda === ConnectAgendaType.connectNewWallet && (
              <div className="button-container mt-[60px] flex">
                <PolygonButton
                  boxStyle={{
                    width: "50%",
                    float: "left",
                    marginRight: "10px",
                    background: "#2EB835",
                  }}
                  containerStyle={{
                    width: "100%",
                    background: "#2EB835",
                    padding: "12px 0",
                  }}
                  onClick={handleConnectNewWallet}
                >
                  <div className="flex w-full justify-center items-center relative">
                    {signing ? (
                      <>
                        <div className="mr-[5px]">
                          <LoadingSpinner width={24} height={24} />
                        </div>
                        <p className="text-white text-[0.9em]">Signing</p>
                      </>
                    ) : (
                      <p className="text-white text-[0.9em]">
                        Sign and Connect
                      </p>
                    )}
                  </div>
                </PolygonButton>
                <PolygonButton
                  boxStyle={{ width: "50%", float: "left", marginLeft: "10px" }}
                  containerStyle={{ width: "100%", background: "#12151B" }}
                  onClick={handleCancelConnectUid}
                >
                  <p className="text-white text-[0.9em]">Cancel</p>
                </PolygonButton>
              </div>
            )}
            <div className="bottom-container mt-[30px] mb-[30px]">
              <p className="text-center text-[14px] text-white">
                Having trouble?
                {isBelongedError ? (
                  <a
                    className="text-primary underline cursor-pointer"
                    onClick={() => handleLogout()}
                  >
                    {" "}
                    Logout UID
                  </a>
                ) : (
                  <a
                    className="text-primary underline cursor-pointer"
                    onClick={() => goBack()}
                  >
                    {" "}
                    Go back
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
