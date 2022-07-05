import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { getAuthAction } from "../libs/actions/";
import { useSession } from "../hooks/useSession";
import { useWallet } from "../hooks/useWallet";
import { makeShorter } from "../utils";
import { WalletCredentialAuthDto } from "../libs/dto/wallet-credential-auth.dto";
import { LoginWalletAuthDto } from "../libs/dto/login-wallet-auth.dto";
import { CreateAuthDto } from "../libs/dto/create-auth.dto";
import { PolygonButton } from "../components/button";
import LoadingSpinner from "../components/loading-spiner";
import { BUFFER_LOADING_APP_SCREEN_KEY } from "./buffer-loading.screen";
import {
  AuthChallenge,
  AuthType,
  ConnectAgendaType,
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
  const { chainType, walletAddress, sign, connect } = useWallet();
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

  const handleSendAuthChallenge = async () => {
    const authChallenge = await authAction.sendChallenge(walletAddress);
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

  const handleConnectNewWallet = useCallback(
    async (createAuthDto: CreateAuthDto) => {
      const authEntity = await authAction.connectWallet(createAuthDto);
      if (authEntity) {
        push(BUFFER_LOADING_APP_SCREEN_KEY);
      }
    },
    []
  );

  const handleLogout = useCallback(async () => {
    await logout();
    push(BUFFER_LOADING_APP_SCREEN_KEY);
  }, [logout, goBack]);

  const handleSign = useCallback(async () => {
    setSigning(true);
    try {
      stopHandler();
      await connect();
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

      if (connectAgenda !== ConnectAgendaType.connectExistWallet) {
        if (authEntities.length >= 10) {
          toast.open(
            "Failed to add wallet!",
            "You can only add a maximum of 10 wallets to your UID."
          );
        } else {
          await handleConnectNewWallet(createAuthDto);
        }
      }
    } catch {
      handler = utilsProvider.withInterval(async () => {
        await connect();
      }, 500);
    }

    setSigning(false);
  }, [authChallenge, connectAgenda, sign, handleLogin, handleConnectNewWallet]);

  const handleCancelConnectUid = useCallback(() => {
    goBack();
  }, [goBack]);

  const authType = useMemo<AuthType>(() => {
    return chainType === ChainType.EVM ? AuthType.EVMChain : AuthType.Solana;
  }, [chainType]);

  useEffect(() => {
    (async () => {
      await handleSendAuthChallenge();

      const inIncluded =
        authEntities.filter(
          (item) => item.credential.walletAddress === walletAddress
        ).length > 0;

      if (inIncluded) {
        /**
         * Explain a little about this screen: user already chose the provider that matched with
         * the desired chain. So it's ok to redirect back to BUFFER_LOADING_APP_SCREEN to process
         * next flow.
         */
        setConnectAgenda(ConnectAgendaType.connectExistWallet);
        setDescription(
          `The wallet was already connected and added to your UID: <span class="text-primary">${makeShorter(
            userInfo?._id
          )}</span><br/><br/>You can <span class="text-primary">choose another wallet</span> or close this dialog.`
        );
        setBelongedError(false);
        return;
      }

      /**
       Inform error exists in another UID
       */
      const isWalletExisted = await authAction.isWalletExisted(walletAddress);
      setBelongedError(isWalletExisted);
      if (isWalletExisted) {
        await handleSendAuthChallenge();
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
        <span class='text-primary'>${makeShorter(userInfo._id)}</span>`
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
      <ModalHeader isBack={isBack} onCloseModal={handleClose} goBack={goBack} />
      <div className="sign-wallet-screen w-full pt-[30px]">
        <div className="mx-auto w-[350px]">
          <p className="text-center text-gray text-[20px] mt-[-60px] font-[100]">
            CONNECT WALLET TO APP
          </p>
          <div className="pt-[50px]">
            <div className="mt-[30px]">
              <p className="text-white text-[20px] text-center font-bold">
                {connectAgenda === ConnectAgendaType.connectExistWallet
                  ? "CONNECTED AS"
                  : "SIGNING WITH THIS ADDRESS"}
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
                  <div className="w-full rounded-[8px] px-[15px] py-[10px] bg-[#25282D] flex">
                    <div className="float-left pl-[20px] text-white">
                      <p className="text-[14px]">
                        The wallet you selected already belongs to another UID.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-[20px]">
                  <p className="text-[16px] text-white text-center font-bold">
                    Please select another wallet or re-login with this wallet
                  </p>
                </div>
              </>
            )}
          </div>
          {connectAgenda === ConnectAgendaType.connectExistWallet &&
            !isBelongedError && (
              <div className="button-container mt-[30px] flex justify-center">
                <PolygonButton
                  boxStyle={{
                    width: "50%",
                    marginRight: "10px",
                    background: "#2EB835",
                  }}
                  containerStyle={{ width: "100%", background: "#2EB835" }}
                  onClick={() => push(BUFFER_LOADING_APP_SCREEN_KEY)}
                >
                  Close
                </PolygonButton>
              </div>
            )}
          {connectAgenda === ConnectAgendaType.connectNewWallet && (
            <div className="button-container mt-[30px] flex">
              <PolygonButton
                boxStyle={{
                  width: "50%",
                  float: "left",
                  marginRight: "10px",
                  background: "#2EB835",
                }}
                containerStyle={{ width: "100%", background: "#2EB835" }}
                onClick={handleSign}
              >
                <div className="flex w-full justify-center items-center relative">
                  {signing && (
                    <div className="absolute left-[-20px]">
                      <LoadingSpinner width={7} height={7} />
                    </div>
                  )}
                  <p className="text-white">Sign message</p>
                </div>
              </PolygonButton>
              <PolygonButton
                boxStyle={{ width: "50%", float: "left", marginLeft: "10px" }}
                containerStyle={{ width: "100%", background: "#12151B" }}
                onClick={handleCancelConnectUid}
              >
                <p className="text-white">Cancel</p>
              </PolygonButton>
            </div>
          )}
          <div className="bottom-container mt-[20px] mb-[30px]">
            {isBelongedError && (
              <p className="text-center text-[14px] text-white">
                Having trouble?
                <a
                  className="text-primary underline"
                  onClick={() => handleLogout()}
                >
                  {" "}
                  Logout UID
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
