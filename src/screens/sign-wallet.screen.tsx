import { FC, useCallback, useEffect, useState } from "react";
import { AuthChallenge, AuthType, LoginResponse } from "../libs/dto/entities";
import { BaseSignWalletScreen } from "./base-sign-wallet.screen";
import { WalletCredentialAuthDto } from "../libs/dto/wallet-credential-auth.dto";
import { WELCOME_APP_SCREEN_KEY } from "./welcome-app.screen";
import { BaseLoadingScreen } from "./base-loading.screen";
import { useWallet } from "../hooks/useWallet";
import { ChainType } from "../libs/adapters";
import { useSession } from "../hooks/useSession";
import { getAuthAction } from "../libs/actions";
import { useLocation } from "../components/router";
import { useAppState } from "../hooks/useAppState";
import { ModalHeader } from "../components/modal/modal.header";

export const SIGN_WALLET_SCREEN_KEY = "SIGN_WALLET_SCREEN";

export const SignWalletScreen: FC = () => {
  const location = useLocation();
  const { walletAddress, chainType } = useWallet();
  const [onLoad, setOnLoad] = useState<boolean>(true);
  const [existedWallet, setExistedWallet] = useState<boolean>(false);
  const [authChallenge, setAuthChallenge] = useState<AuthChallenge>(null);
  const { signIn, signUp } = useSession();
  const { isBack, handleClose } = useAppState();
  const authAction = getAuthAction();

  const handleOnSigned = useCallback(
    async (signature: string) => {
      if (chainType === ChainType.ALL) return;

      const credential: WalletCredentialAuthDto = {
        authChallengeId: authChallenge._id,
        walletAddress: authChallenge.target,
        signedData: signature,
      };

      // TODO: refactor using AuthType instead of ChainType
      const type =
        chainType === ChainType.EVM ? AuthType.EVMChain : AuthType.Solana;

      const response: LoginResponse = existedWallet
        ? await signIn({ type: type, credential: credential })
        : await signUp({ type: type, credential: credential });

      if (!response.accessToken) {
        // Login failed
        return;
      }

      location.push(WELCOME_APP_SCREEN_KEY);
    },
    [chainType, authChallenge, existedWallet]
  );

  useEffect(() => {
    (async () => {
      const existedWallet = await authAction.isWalletExisted(walletAddress);

      const authChallengeData = await authAction.sendChallenge(walletAddress);

      setAuthChallenge(authChallengeData);

      setExistedWallet(existedWallet);

      setOnLoad(false);
    })();
  }, [chainType, walletAddress]);

  return (
    <div>
      <ModalHeader
        isBack={isBack}
        onCloseModal={handleClose}
        goBack={location.goBack}
      />
      <div className="content px-[20px]">
        {onLoad ? (
          <BaseLoadingScreen />
        ) : (
          <BaseSignWalletScreen
            description={
              existedWallet
                ? "Sign a message to confirm you own the wallet address to sign in the User Identity"
                : `Hey, <span class='text-primary'> this is a new wallet </span> <br /> Please continue below to proceed with the signature request and to create a new Ancient8 User Identity account`
            }
            signedMessage={authChallenge.message}
            onSigned={handleOnSigned}
          />
        )}
      </div>
    </div>
  );
};
