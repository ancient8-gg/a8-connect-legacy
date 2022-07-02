// ======== Main interface ========
import { SessionInfoRecord } from "./persist-kyc.dto";

export type UserInfo = User & { session: AuthSession } & {
  accessedSites: AuthClientEntity[];
};

export type LoginResponse = {
  accessToken: string;
};

export interface AuthChallenge {
  target: string;
  message: string;
  expiredDate: Date;
  isResolved: boolean;
  _id: string;
}

export type A8ConnectInitOptions = {
  autoLogin: boolean;
  enabledWallets: string[];
};

export interface AuthSession {
  authorizedId: string; // userId or anything id
  grantType: GrantType;
  userId: string;
  authId: string;
  checksum: string;
  sessionType: SessionType;
  expiresAt: Date;
  authWallets: AuthEntity[];
}

export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  roles: string[];
  isEmailVerified: boolean;
  isEnabled: boolean;
  lastLoginTime: Date;
  kycSession?: SessionInfoRecord;
}

export interface AuthClientEntity {
  clientKey: string;
  clientSecret: string;
  clientName: string;
  redirectUri: string;
  hostname: string;
  avatar: string;
  createdBy: string;
  sessionExpiresDelta: string;
}

export interface AuthEntity {
  userId: string;
  type: AuthType;
  credential: WalletCredential;
  isPrimary: boolean;
}

// ======== Sub interfaces ========
export type WalletCredential = {
  walletAddress: string;
};

export enum AuthType {
  EVMChain = "AUTH_TYPE::EVM_CHAIN",
  Solana = "AUTH_TYPE::SOLANA",
  Password = "AUTH_TYPE::PASSWORD",
}

export enum GrantType {
  ServiceClient = "GRANT_TYPE::SERVICE_CLIENT",
  Self = "GRANT_TYPE::SELF",
}

export enum SessionType {
  Auth = "SESSION_TYPE::AUTH",
  ResetCredential = "SESSION_TYPE::RESET_CREDENTIAL",
}

export enum SdkMethod {
  login = "SDK-METHOD::LOGIN",
  connect = "SDK-METHOD::CONNECT",
}

export enum ConnectAgendaType {
  connectExistWallet = "CONNECT-AGENDA-TYPE::CONNECT-WIDTH-EXIST-WALLET",
  connectNewWallet = "CONNECT-AGENDA-TYPE::CONNECT-WITH-NEW-WALLET",
}
