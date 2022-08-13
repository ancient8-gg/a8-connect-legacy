import { FC, useCallback, useEffect, useState } from "react";
import { AuthChallenge, AuthType } from "../libs/dto/entities";
import { BaseSignWalletScreen } from "./base-sign-wallet.screen";
import { WalletCredentialAuthDto } from "../libs/dto/wallet-credential-auth.dto";
import { BaseLoadingScreen } from "./base-loading.screen";
import { useWallet } from "../hooks/useWallet";
import { useLocation } from "../components/router";
import { ChainType } from "../libs/adapters";
import { getAuthAction } from "../libs/actions";
import { getUtilsProvider } from "../libs/providers";
import { BASE_NOTIFICATION_SCREEN_KEY } from "./base-notification.screen";

export const SIGN_WALLET_LOST_WALLET_KEY = "SIGN_WALLET_LOST_WALLET_KEY";

export const SignWalletLostWalletScreen: FC = () => {
  const { walletAddress, chainType } = useWallet();
  const [onLoad, setOnLoad] = useState<boolean>(true);
  const authAction = getAuthAction();
  const utilsProvider = getUtilsProvider();
  const { push } = useLocation();

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

      try {
        await authAction.resetWithNewWallet({ type, credential });
        return push(BASE_NOTIFICATION_SCREEN_KEY, {
          params: {
            isBack: false,
            disableCloseButton: false,
            status: 1,
            title: "Successful!",
            showSuccessButton: true,
            successButtonText: "Login now",
            description: `You have successfully added your new wallet. Wallet: <span class="text-[#2EB835]">${utilsProvider.makeWalletAddressShorter(
              walletAddress
            )}</span> `,
          },
        });
      } catch (err: unknown) {
        if (err.toString().includes("AUTH::AUTH_ENTITY::DUPLICATED_WALLET")) {
          return push(BASE_NOTIFICATION_SCREEN_KEY, {
            params: {
              isBack: true,
              disableCloseButton: true,
              status: 2,
              title: "ADD WALLET",
              description: `The <span class="text-[#2EB835]">${utilsProvider.makeWalletAddressShorter(
                walletAddress
              )}</span> wallet you selected is already connected to another UID. 
              <br/>
              <br/>
              <p> Please select another wallet. </p>`,
            },
          });
        }

        if (
          err.toString().includes("ERROR CODE: 401") ||
          err.toString().includes("Credentials is not available")
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
      }
    },
    [chainType]
  );

  useEffect(() => {
    (async () => {
      setOnLoad(false);
    })();
  }, [chainType, walletAddress]);

  return (
    <div>
      <div className="sm:py-[0px] py-[5%]">
        {onLoad ? (
          <BaseLoadingScreen />
        ) : (
          <BaseSignWalletScreen
            title="Sign in"
            description="Sign message to confirm you own the wallet address"
            onSigned={handleOnSigned}
          />
        )}
      </div>
    </div>
  );
};
