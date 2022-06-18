export enum AuthType {
  EVMChain = "AUTH_TYPE::EVM_CHAIN",
  Solana = "AUTH_TYPE::SOLANA",
  Password = "AUTH_TYPE::PASSWORD",
}

export enum GrantType {
  auth = "GRANT_TYPE::SELF",
  client = "GRANT_TYPE::SERVICE_CLIENT",
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
