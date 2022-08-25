import { FC, useCallback, useEffect, useState } from "react";
import { AuthChallenge, AuthType, LoginResponse } from "../libs/dto/entities";
import { BaseSignWalletScreen } from "./base-sign-wallet.screen";
import { WalletCredentialAuthDto } from "../libs/dto/wallet-credential-auth.dto";
import { BUFFER_LOADING_APP_SCREEN_KEY } from "./buffer-loading.screen";
import { BaseLoadingScreen } from "./base-loading.screen";
import { useWallet } from "../hooks/useWallet";
import { ChainType } from "../libs/adapters";
import { useSession } from "../hooks/useSession";
import { getAuthAction } from "../libs/actions";
import { useLocation } from "../components/router";

export const SIGN_WALLET_SCREEN_KEY = "SIGN_WALLET_SCREEN";

export const SignWalletScreen: FC = () => {
  const location = useLocation();
  const { walletAddress, chainType } = useWallet();
  const [onLoad, setOnLoad] = useState<boolean>(true);
  const [existedWallet, setExistedWallet] = useState<boolean>(false);
  const { signIn, signUp } = useSession();
  const authAction = getAuthAction();

  const handleOnSigned = useCallback(
    async (authChallenge: AuthChallenge, signature: string) => {
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
        ? await signIn({ type, credential })
        : await signUp({ type, credential });

      if (!response.accessToken) {
        // Login failed
        return;
      }

      location.push(BUFFER_LOADING_APP_SCREEN_KEY);
    },
    [chainType, existedWallet, signIn, signUp]
  );

  useEffect(() => {
    (async () => {
      const existedWallet = await authAction.isWalletExisted(walletAddress);

      setExistedWallet(existedWallet);

      setOnLoad(false);
    })();
  }, [chainType, walletAddress]);

  return (
    <div>
      <div>
        {onLoad ? (
          <BaseLoadingScreen />
        ) : (
          <BaseSignWalletScreen
            existedWallet={existedWallet}
            title="Sign In"
            description={
              existedWallet
                ? "Sign a message to confirm you own the wallet address"
                : `Hey, <span class='text-primary'> this is a new wallet </span> <br /> Want to create a new Ancient8 UID?`
            }
            onSigned={handleOnSigned}
          />
        )}
      </div>
    </div>
  );
};
