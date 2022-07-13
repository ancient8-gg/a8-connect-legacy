import { OffChainAction } from "./offchain.action";
import { RegistrationAuthDto } from "../dto/registration-auth.dto";
import { LoginWalletAuthDto } from "../dto/login-wallet-auth.dto";
import { ConnectEmailAuthDto } from "../dto/connect-email-auth.dto";
import { ResetWithNewWalletDto } from "../dto/reset-with-new-wallet.dto";
import { LoginResponse, AuthChallenge, AuthEntity } from "../dto/entities";
import { CreateAuthDto } from "../dto/create-auth.dto";

/**
 * `AuthActions` provides methods to handle all authenticating actions.
 */
export class AuthAction extends OffChainAction {
  /**
   * The function to modify/delete credential
   */
  async setCredential(jwt: string | null) {
    if (jwt === null) return this.removeCredential();
    this.storageProvider.setItem("jwt", jwt);
  }

  /**
   * The function to remove credential
   */
  async removeCredential() {
    try {
      await this.logout();
    } catch {}

    this.storageProvider.removeItem("jwt");
  }

  /**
   * Send challenge data to server to confirm action
   * @param walletAddress
   */
  async requestAuthChallenge(walletAddress: string): Promise<AuthChallenge> {
    try {
      return this.authProvider.requestAuthChallenge(walletAddress);
    } catch {
      return null;
    }
  }

  /**
   * Check whether a wallet address is existed
   * @param walletAddress
   */
  async isWalletExisted(walletAddress: string): Promise<boolean> {
    try {
      await this.userProvider.validateWalletAddress(walletAddress);
      return false;
    } catch {
      return true;
    }
  }

  /**
   * Check whether a user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    try {
      await this.userProvider.getUser();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Send otp verification via email
   */
  sendEmailVerification(email: string): Promise<void> {
    return this.authProvider.sendEmailVerification(email);
  }

  /**
   * Connect new wallet to UID
   */
  async connectWallet(createAuthDto: CreateAuthDto): Promise<AuthEntity> {
    return this.authProvider.connectWallet(createAuthDto);
  }

  /**
   * Connect new wallet to UID when forget/lost old wallets via email
   */
  async resetWithNewWallet(
    authToken: string,
    resetWithNewWalletDto: ResetWithNewWalletDto
  ): Promise<AuthEntity> {
    return this.authProvider.resetWithNewWallet(
      authToken,
      resetWithNewWalletDto
    );
  }

  /**
   * Connect new email to UID
   */
  async connectEmail(connectEmailAuthDto: ConnectEmailAuthDto) {
    return this.authProvider.connectEmail(connectEmailAuthDto);
  }

  /**
   * Determine whether the access token is available or not.
   */
  isAuthTokenAvailable() {
    return (
      !!this.cookieProvider.getCookie("jwt") ||
      !!this.storageProvider.getItem("jwt")
    );
  }

  /**
   * Sign user in. Persist access token to storage.
   * @param authDto
   */
  async signIn(authDto: LoginWalletAuthDto): Promise<LoginResponse> {
    const { accessToken } = await this.authProvider.signInWallet(authDto);
    this.storageProvider.setItem("jwt", accessToken);
    return { accessToken };
  }

  /**
   * Sign user up. Persist access token to storage.
   * @param authDto
   */
  async signUp(authDto: RegistrationAuthDto): Promise<LoginResponse> {
    const { accessToken } = await this.authProvider.signUpWallet(authDto);
    this.storageProvider.setItem("jwt", accessToken);
    return { accessToken };
  }

  /**
   * Log user out of current session. Also remove access token from storage.
   */
  async logout(): Promise<void> {
    await this.authProvider.logout();
    this.storageProvider.removeItem("jwt");
  }
}
