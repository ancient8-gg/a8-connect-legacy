import { FC, useCallback, useEffect, useState } from "react";
import { AuthChallenge, AuthType } from "../libs/dto/entities";
import { BaseSignWalletScreen } from "./base-sign-wallet.screen";
import { WalletCredentialAuthDto } from "../libs/dto/wallet-credential-auth.dto";
import { BaseLoadingScreen } from "./base-loading.screen";
import { useWallet } from "../hooks/useWallet";
import { useSession } from "../hooks/useSession";
import { useAppState } from "../hooks/useAppState";
import { ChainType } from "../libs/adapters";
import { getAuthAction } from "../libs/actions";
import { useToast } from "../hooks/useToast";
import { getUtilsProvider } from "../libs/providers";

export const SIGN_WALLET_LOST_WALLET_KEY = "SIGN_WALLET_LOST_WALLET_KEY";

export const SignWalletLostWalletScreen: FC = () => {
  const { walletAddress, chainType } = useWallet();
  const {
    resetWithNewWalletPayload: { authToken },
  } = useAppState();
  const [onLoad, setOnLoad] = useState<boolean>(true);
  const [authChallenge, setAuthChallenge] = useState<AuthChallenge>(null);
  const authAction = getAuthAction();
  const utilsProvider = getUtilsProvider();
  const toast = useToast();

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

      try {
        await authAction.resetWithNewWallet(authToken, { type, credential });
        toast.success(
          "Successful!",
          `You have successfully added your new wallet.
           Wallet: ${utilsProvider.makeWalletAddressShorter(walletAddress)}`
        );
      } catch (err: unknown) {
        if (err.toString().includes("AUTH::AUTH_ENTITY::DUPLICATED_WALLET")) {
          toast.error(
            "Failed to add wallet",
            `The ${utilsProvider.makeWalletAddressShorter(
              walletAddress
            )} wallet you selected is already connected to another UID. Please select another wallet.`
          );
        }
      }
    },
    [chainType, authChallenge]
  );

  useEffect(() => {
    (async () => {
      const authChallengeData = await authAction.requestAuthChallenge(
        walletAddress
      );
      setAuthChallenge(authChallengeData);
      setOnLoad(false);
    })();
  }, [chainType, walletAddress]);

  return (
    <div>
      <div className="content px-[20px]">
        {onLoad ? (
          <BaseLoadingScreen />
        ) : (
          <BaseSignWalletScreen
            title="Sign in"
            description="Sign message to confirm you own the wallet address - lost wallet flow"
            signedMessage={authChallenge.message}
            onSigned={handleOnSigned}
          />
        )}
      </div>
    </div>
  );
};
