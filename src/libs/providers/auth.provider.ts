import { BusinessProvider } from "./business.provider";
import {
  AuthChallenge,
  AuthEntity,
  LoginResponse,
  User,
} from "../dto/entities";
import { LoginWalletAuthDto } from "../dto/login-wallet-auth.dto";
import { RegistrationAuthDto } from "../dto/registration-auth.dto";
import { ConnectOauthDto } from "../dto/connect-oauth.dto";
import { ConnectEmailAuthDto } from "../dto/connect-email-auth.dto";
import { CreateAuthDto } from "../dto/create-auth.dto";

/**
 * `AuthProvider` provides all the business request calls to A8Connect backend, which related to User Authentication.
 */
export class AuthProvider extends BusinessProvider {
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
  signUpWallet(signUpPayload: RegistrationAuthDto): Promise<LoginResponse> {
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
  sendAuthChallenge(target: string): Promise<AuthChallenge> {
    return this.request<AuthChallenge>(
      `/auth/challenge/${encodeURIComponent(target)}`,
      {
        method: "POST",
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
   * @param payload
   */
  connectWallet(payload: CreateAuthDto): Promise<AuthEntity> {
    return this.requestWithCredential<AuthEntity>("/auth/connect-wallet", {
      body: JSON.stringify(payload),
      method: "POST",
    });
  }

  /**
   * The function to log user out from the current session.
   */
  logout(): Promise<void> {
    return this.requestWithCredential<void>("/auth/logout", {
      method: "POST",
    });
  }
}
