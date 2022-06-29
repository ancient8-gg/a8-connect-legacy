import { useEffect, useState, useMemo, FC, useCallback } from "react";
import { getAuthAction } from "../libs/actions/";
import { useSession } from "../hooks/useSession";
import { useWallet } from "../hooks/useWallet";
import { makeShorter } from "../utils";
import { WalletCredentialAuthDto } from "../libs/dto/wallet-credential-auth.dto";
import { LoginWalletAuthDto } from "../libs/dto/login-wallet-auth.dto";
import { CreateAuthDto } from "../libs/dto/create-auth.dto";
import { PolygonButton } from "../components/button";
import LoadingSpinner from "../components/loading-spiner";
import { WELCOME_APP_SCREEN_KEY } from "./welcome-app.screen";
import {
  ConnectAgendaType,
  AuthChallenge,
  AuthType,
} from "../libs/dto/entities";
import WalletImage from "../assets/images/wallet.png";
import { ChainType } from "../libs/adapters/";
import { useLocation } from "../components/router";

export const SIGN_WALLET_CONNECT_UID_KEY = "SIGN_WALLET_CONNECT_UID";

export const SignWalletConnectUID: FC = () => {
  const [description, setDescription] = useState<string>("");
  const [signing, setSigning] = useState<boolean>(false);
  const [isBelongedError, setBelongedError] = useState<boolean>(false);
  const [connectAgenda, setConnectAgenda] = useState<ConnectAgendaType>();
  const [authChallenge, setAuthChallenge] = useState<AuthChallenge>();
  const { userInfo, authEntities, logout } = useSession();
  const { chainType, walletAddress, sign, disconnect } = useWallet();
  const authAction = getAuthAction();
  const location = useLocation();

  const handleSendAuthChallenge = async () => {
    const authChallenge = await authAction.sendChallenge(walletAddress);
    setAuthChallenge(authChallenge);
  };

  const handleLogin = async (createAuthDto: CreateAuthDto) => {
    const loginResponse = await authAction.signIn(
      createAuthDto as LoginWalletAuthDto
    );

    if (loginResponse.accessToken) {
      location.push(WELCOME_APP_SCREEN_KEY);
    }
  };

  const handleConnectNewWallet = async (createAuthDto: CreateAuthDto) => {
    const authEntity = await authAction.connectWallet(createAuthDto);
    if (authEntity) {
      location.push(WELCOME_APP_SCREEN_KEY);
    }
  };

  const handleLogout = useCallback(async () => {
    await logout();
    location.goBack();
  }, [logout, location]);

  const handleSign = async () => {
    setSigning(true);
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

    if (connectAgenda === ConnectAgendaType.connectExistWallet) {
      await handleLogin(createAuthDto);
    } else {
      await handleConnectNewWallet(createAuthDto);
    }

    setSigning(false);
  };

  const handleCancelConnectUid = async () => {
    await disconnect();
  };

  const authType = useMemo<AuthType>(() => {
    return chainType === ChainType.EVM ? AuthType.EVMChain : AuthType.Solana;
  }, [chainType]);

  useEffect(() => {
    (async () => {
      const inIncluded =
        authEntities.filter(
          (item) => item.credential.walletAddress === walletAddress
        ).length > 0;

      if (inIncluded) {
        await handleSendAuthChallenge();
        setConnectAgenda(ConnectAgendaType.connectExistWallet);
        setDescription(
          `You are logged into UID with this wallet
          Sign to connect wallet to Ancient8's apps`
        );
        return;
      }

      /**
       Inform error exists in another UID
       */
      const isWalletExisted = await authAction.isWalletExisted(walletAddress);
      if (isWalletExisted) {
        /**
         * Disconnect wallet when have error while connect with the UID
         */
        await disconnect();
        setBelongedError(true);
        return;
      }
      await handleSendAuthChallenge();
      setConnectAgenda(ConnectAgendaType.connectNewWallet);
      setDescription(
        `Hey, <span class='text-primary'> this is a new wallet, </span> 
        want to connect <br />
        wallet to the UID: 
        <span class='text-primary'>${makeShorter(userInfo._id)}</span>`
      );
    })();
  }, [walletAddress, userInfo, authEntities]);

  return (
    <div className="sign-wallet-screen w-full pt-[30px]">
      <div className="mx-auto w-[350px]">
        <p className="text-center text-gray text-[20px] mt-[-25px] font-[100]">
          CONNECT WALLET TO APP
        </p>
        <div className="pt-[50px]">
          <div className="mt-[30px]">
            <p className="text-white text-[20px] text-center font-bold">
              SIGNING WITH THIS ADDRESS
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
            <div className="flex justify-center mt-[30px] items-center">
              <div className="w-full rounded-[8px] px-[15px] py-[10px] bg-[#25282D] flex">
                <div className="float-left pl-[20px] text-white">
                  <p className="text-[14px]">
                    The wallet you selected already belongs to another UID.
                  </p>
                </div>
              </div>
            </div>
          )}
          {isBelongedError && (
            <div className="mt-[20px]">
              <p className="text-[16px] text-white text-center font-bold">
                Please select another wallet or re-login with this wallet
              </p>
            </div>
          )}
        </div>
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
              <div className="flex w-full justify-center items-center">
                {signing && (
                  <div className="float-left">
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
        {connectAgenda === ConnectAgendaType.connectExistWallet && (
          <div className="button-container mt-[30px]">
            <PolygonButton
              boxStyle={{ width: "100%" }}
              containerStyle={{ width: "100%", background: "#12151B" }}
              onClick={handleSign}
            >
              <div className="flex w-full justify-center items-center">
                {signing ? (
                  <div className="float-left">
                    <LoadingSpinner width={20} height={20} />
                  </div>
                ) : (
                  <img src={WalletImage} className="w-[18px] h-[18px]" />
                )}
                <p className="text-white ml-[10px]">Sign to connect wallet</p>
              </div>
            </PolygonButton>
          </div>
        )}
        <div className="bottom-container mt-[20px] mb-[30px]">
          <p className="text-center text-[14px] text-white">
            Having trouble?
            {isBelongedError ? (
              <a
                className="text-primary underline"
                onClick={() => handleLogout()}
              >
                {" "}
                Logout UID
              </a>
            ) : (
              <a
                className="text-primary underline"
                onClick={() => location.goBack()}
              >
                {" "}
                Go back
              </a>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
