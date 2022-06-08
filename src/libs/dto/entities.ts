// ======== Main interface ========
export type UserInfo = User & { session: AuthSession } & {
  accessedSites: AuthClientEntity[];
};

export type LoginResponse = {
  accessToken: string;
};

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
  authWallets: [];
}

export interface User {
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

export type GeneralSession = {
  session_id: string;
  sandbox: boolean;
};

export type SessionInfo = {
  status: SessionState;
  alias: string;
  verifiedDate?: number;
} & GeneralSession;

export enum SessionState {
  PENDING = "PENDING",
  FINISHED = "FINISHED",
  VERIFIED = "VERIFIED",
  CANCELLED = "CANCELLED",
}

export type HistoryMessage = {
  review_message: string;
  review_date: string;
};

export enum StepState {
  VALIDATED = "VALIDATED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
  NOT_STARTED = "NOT_STARTED",
}

export enum StepName {
  LIVENESS = "LIVENESS",
  IDENTITY = "IDENTITY",
  RESIDENCY = "RESIDENCY",
  PHONE = "PHONE",
}

export type SessionStep = {
  state: StepState;
  name: StepName;
  did_issued: boolean;
  id: string;
  ip: string;
  history: HistoryMessage[];
};

export type DetailSessionInfo = {
  session: SessionInfo;
  steps: SessionStep[];
};

export type SessionInfoRecord = SessionInfo & {
  steps?: SessionStep[];
};

export enum GrantType {
  ServiceClient = "GRANT_TYPE::SERVICE_CLIENT",
  Self = "GRANT_TYPE::SELF",
}

export enum SessionType {
  Auth = "SESSION_TYPE::AUTH",
  ResetCredential = "SESSION_TYPE::RESET_CREDENTIAL",
}

export interface SignData {
  walletAddress: string;
  signature: string;
}
export interface ICredential {
  signedData: string;
  walletAddress: string;
  authChallengeId: string;
}
export interface IAuthData {
  type: AuthType;
  credential: ICredential;
}
export interface Oauth {
  type: AuthType;
  credential: ICredential;
  clientId: string;
  redirectUri: string;
}

// ======== Wallet adapter interface ========

/** @description */
/** Evm adapters */
export enum EvmAdapterName {
  metamask = "Adapter::EVM::Metamask",
  coin98 = "Adapter::EVM::Coin98",
  binanceChain = "Adapter::EVM::BinanceChain",
  coinbase = "Adapter::EVM::Coinbase",
  torus = "Adapter::EVM::Torus",
}

/** @description */
/** Solana adapters */
export enum SolanaAdapterName {
  phantom = "Adapter::SOL::PHANTOM",
  slope = "Adapter::SOL::SLOPE",
  torus = "Adapter::SOL::TORUS",
  sollet = "Adapter::SOL::SOLLET",
  coin98 = "Adapter::SOL:COIN98",
}

export type AdapterName = EvmAdapterName | SolanaAdapterName;
