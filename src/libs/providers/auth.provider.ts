import { BusinessProvider } from "./business.provider";
import { LoginResponse } from "../dto/entities";
import { LoginWalletAuthDto } from "../dto/login-wallet-auth.dto";
import { RegistrationAuthDto } from "../dto/registration-auth.dto";

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
   * The function to log user out from the current session.
   */
  logout(): Promise<void> {
    return this.requestWithCredential<void>("/auth/logout", {
      method: "POST",
    });
  }
}
