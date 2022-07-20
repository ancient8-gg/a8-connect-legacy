import { FC, useCallback, useEffect, useState } from "react";
import { AuthChallenge, AuthType } from "../libs/dto/entities";
import { BaseSignWalletScreen } from "./base-sign-wallet.screen";
import { WalletCredentialAuthDto } from "../libs/dto/wallet-credential-auth.dto";
import { BaseLoadingScreen } from "./base-loading.screen";
import { useWallet } from "../hooks/useWallet";
import { useSession } from "../hooks/useSession";
import { useLocation } from "../components/router";
import { ChainType } from "../libs/adapters";
import { getAuthAction } from "../libs/actions";
import { getUtilsProvider } from "../libs/providers";
import { BASE_NOTIFICATION_SCREEN_KEY } from "./base-notification.screen";

export const SIGN_WALLET_ADD_WALLET_KEY = "SIGN_WALLET_SCREEN";

export const SignWalletAddWalletScreen: FC = () => {
  const { walletAddress, chainType } = useWallet();
  const { authEntities } = useSession();
  const { push } = useLocation();
  const [onLoad, setOnLoad] = useState<boolean>(true);
  const [authChallenge, setAuthChallenge] = useState<AuthChallenge>(null);
  const authAction = getAuthAction();
  const utilsProvider = getUtilsProvider();

  const handleOnSigned = useCallback(
    async (signature: string) => {
      if (chainType === ChainType.ALL) return;
      if (authEntities.length >= 10) {
        return push(BASE_NOTIFICATION_SCREEN_KEY, {
          params: {
            isBack: false,
            disableCloseButton: false,
            status: 0,
            title: "Fail to add wallet!",
            description: `<p class="w-[70%] mx-auto">You can add maximum 10 wallets to an UID.</p>`,
          },
        });
      }

      const credential: WalletCredentialAuthDto = {
        authChallengeId: authChallenge._id,
        walletAddress: authChallenge.target,
        signedData: signature,
      };

      // TODO: refactor using AuthType instead of ChainType
      const type =
        chainType === ChainType.EVM ? AuthType.EVMChain : AuthType.Solana;

      try {
        await authAction.connectWallet({ type, credential });
        return push(BASE_NOTIFICATION_SCREEN_KEY, {
          params: {
            isBack: false,
            disableCloseButton: false,
            status: 1,
            title: "Successful!",
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
      <div className="content sm:py-[0px] py-[5%]">
        {onLoad ? (
          <BaseLoadingScreen />
        ) : (
          <BaseSignWalletScreen
            title="add wallet"
            description="Sign message to confirm you own the wallet address"
            signedMessage={authChallenge.message}
            onSigned={handleOnSigned}
          />
        )}
      </div>
    </div>
  );
};
