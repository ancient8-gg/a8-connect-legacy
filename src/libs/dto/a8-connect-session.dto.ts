import { UserInfo } from "./entities";
import { AuthAction, UserAction, WalletAction } from "../actions";
import { BaseWalletAdapter, ChainType } from "../adapters";

export interface ConnectedWalletPayload {
  walletAddress: string;
  provider: BaseWalletAdapter;
  chainType: ChainType;
  walletName: string;
}

export interface A8ConnectSession {
  Auth: AuthAction;
  Wallet: WalletAction;
  User: UserAction;
  connectedWallet: ConnectedWalletPayload | null;
  sessionUser: UserInfo | null;
}
