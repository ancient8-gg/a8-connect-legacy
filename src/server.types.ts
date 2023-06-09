/** *******************************************************************************
 *  WARNING: THIS FILE IS FOR TYPES DECLARATION ONLY, DO NOT USE TO IMPORT AS VALUE
 * ********************************************************************************
 */

/**
 * Export DTOs
 */
export * as DiscordOAuthDto from "./libs/dto/discord-oauth.dto";
export * as ConnectSessionDto from "./libs/dto/a8-connect-session.dto";
export * as ConnectEmailAuthDto from "./libs/dto/connect-email-auth.dto";
export * as ConnectOAuthDto from "./libs/dto/connect-oauth.dto";
export * as ConnectWalletDto from "./libs/dto/connect-wallet.dto";
export * as CreateAuthDto from "./libs/dto/create-auth.dto";
export * as LoginWalletAuthDto from "./libs/dto/login-wallet-auth.dto";
export * as PersistKycDto from "./libs/dto/persist-kyc.dto";
export * as ProfileUserDto from "./libs/dto/profile-user.dto";
export * as RegistrationAuthDto from "./libs/dto/registration-auth.dto";
export * as WalletCredentialAuthDto from "./libs/dto/wallet-credential-auth.dto";
export * as Entities from "./libs/dto/entities";

/**
 * Export Adapters
 */
export * as Providers from "./libs/providers";

/**
 * Export Actions
 */
export type { AuthAction, OAuthAction, UserAction } from "./libs/actions";
