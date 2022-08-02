import { BusinessProvider } from "./business.provider";
import {
  AuthChallenge,
  AuthEntity,
  LoginResponse,
  User,
} from "../dto/entities";
import { LoginWalletAuthDto } from "../dto/login-wallet-auth.dto";
import {
  DiscordRegistrationAuthDto,
  RegistrationAuthDto,
} from "../dto/registration-auth.dto";
import { ConnectOauthDto } from "../dto/connect-oauth.dto";
import { ConnectEmailAuthDto } from "../dto/connect-email-auth.dto";
import { CreateAuthDto } from "../dto/create-auth.dto";
import { DiscordCredentialDto } from "../dto/discord-oauth.dto";

/**
 * `AuthProvider` provides all the business request calls to A8Connect backend, which related to User Authentication.
 */
export class AuthProvider extends BusinessProvider {
  /**
   * The function to sign up user using Discord exchange code.
   * @param signUpPayload
   */
  signUpDiscord(
    signUpPayload: DiscordRegistrationAuthDto
  ): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/sign-up", {
      body: JSON.stringify(signUpPayload),
      method: "POST",
    });
  }

  /**
   * The function to login using Discord exchange code.
   * @param loginPayload
   */
  signInDiscord(loginPayload: DiscordCredentialDto): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login-discord", {
      body: JSON.stringify(loginPayload),
      method: "POST",
    });
  }

  /**
   * The function to connect Discord account using Discord exchange code.
   * @param payload
   */
  connectDiscord(payload: DiscordCredentialDto): Promise<AuthEntity> {
    return this.requestWithCredential<AuthEntity>("/auth/connect-discord", {
      body: JSON.stringify(payload),
      method: "POST",
    });
  }

  /**
   * The function to login using credential from wallet signature.
   * @param loginPayload
   */
  signInWallet(loginPayload: LoginWalletAuthDto): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login-wallet", {
      body: JSON.stringify(loginPayload),
      method: "POST",
    });
  }

  /**
   * The function to sign up user using credential from wallet signature.
   * @param signUpPayload
   */
  signUp(signUpPayload: RegistrationAuthDto): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/sign-up", {
      body: JSON.stringify(signUpPayload),
      method: "POST",
    });
  }

  /**
   * The function to connect oauth using credential from wallet signature.
   * @param payload
   */
  connectOAuth(payload: ConnectOauthDto): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/connect-oauth", {
      body: JSON.stringify(payload),
      method: "POST",
    });
  }

  /**
   * The function to request auth challenge before login/logout/connect wallet
   * @param target
   */
  requestAuthChallenge(target: string): Promise<AuthChallenge> {
    return this.request<AuthChallenge>(
      `/auth/challenge/${encodeURIComponent(target)}`,
      {
        method: "POST",
        body: "{}",
      }
    );
  }

  /**
   * The function to send email otp verification when user want to update email.
   * @param email
   */
  sendUpdateEmailOtp(email: string): Promise<void> {
    return this.request<void>(
      `/auth/send-email-otp/${encodeURIComponent(email)}`,
      {
        method: "POST",
        body: "{}",
      }
    );
  }

  /**
   * The function to send otp verification via email
   * @param email
   */
  sendEmailVerification(email: string): Promise<void> {
    return this.request<void>(
      `/auth/send-email-verification/${encodeURIComponent(email)}`,
      {
        method: "POST",
        body: "{}",
      }
    );
  }

  /**
   * The function to send email to connect wallet.
   * @param email
   */
  sendConnectWalletLink(email: string): Promise<void> {
    return this.request<void>(
      `/auth/send-connect-wallet-link/${encodeURIComponent(email)}`,
      {
        method: "POST",
        body: "{}",
      }
    );
  }

  /**
   * The function to connect email with a valid OTP token.
   * @param payload
   */
  connectEmail(payload: ConnectEmailAuthDto): Promise<User> {
    return this.requestWithCredential("/auth/connect-email", {
      body: JSON.stringify(payload),
      method: "POST",
    });
  }

  /**
   * The function to connect user wallet using credential from wallet signature.
   * @param createAuthPayload
   */
  connectWallet(createAuthPayload: CreateAuthDto): Promise<AuthEntity> {
    return this.requestWithCredential<AuthEntity>("/auth/connect-wallet", {
      body: JSON.stringify(createAuthPayload),
      method: "POST",
    });
  }

  /**
   * The function to connect new wallet to UID when forget/lost old wallets via email
   * @param createAuthDto
   */
  async resetWithNewWallet(createAuthDto: CreateAuthDto): Promise<AuthEntity> {
    return this.requestWithCredential<AuthEntity>("/auth/connect-wallet", {
      body: JSON.stringify(createAuthDto),
      method: "POST",
    });
  }

  /**
   * The function to verify user wallet using credential from wallet signature.
   * @param createAuthPayload
   */
  verifyWallet(createAuthPayload: CreateAuthDto): Promise<AuthEntity> {
    return this.requestWithCredential<AuthEntity>("/auth/verify-wallet", {
      body: JSON.stringify(createAuthPayload),
      method: "POST",
    });
  }

  /**
   * The function to log user out from the current session.
   */
  logout(): Promise<void> {
    return this.requestWithCredential<void>("/auth/logout", {
      method: "POST",
      body: "{}",
    });
  }
}
