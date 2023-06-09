import { OffChainAction } from "./offchain.action";
import {
  DiscordRegistrationAuthDto,
  RegistrationAuthDto,
} from "../dto/registration-auth.dto";
import { LoginWalletAuthDto } from "../dto/login-wallet-auth.dto";
import { ConnectEmailAuthDto } from "../dto/connect-email-auth.dto";
import { LoginResponse, AuthChallenge, AuthEntity } from "../dto/entities";
import { CreateAuthDto } from "../dto/create-auth.dto";
import { DiscordCredentialDto } from "../dto/discord-oauth.dto";

/**
 * `AuthActions` provides methods to handle all authenticating actions.
 */
export class AuthAction extends OffChainAction {
  /**
   * The function to modify/delete credential
   */
  setCredential(jwt: string | null) {
    if (jwt === null) return this.removeCredential();
    this.storageProvider.setItem("jwt", jwt);
  }

  /**
   * The function to remove credential
   */
  removeCredential() {
    this.storageProvider.removeItem("jwt");
  }

  /**
   * The function to modify/delete cookie credential
   */
  setCookieStorageCredential(jwt: string | null) {
    if (jwt === null) return this.removeCookieStorageCredential();
    this.storageProvider.setItem("jwt_cookie", jwt);
  }

  /**
   * The function to remove cookie credential
   */
  removeCookieStorageCredential() {
    this.storageProvider.removeItem("jwt_cookie");
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
   * Sign user up using Discord exchange code. Persist access token to storage.
   * @param authDto
   */
  async signUpDiscord(
    authDto: DiscordRegistrationAuthDto
  ): Promise<LoginResponse> {
    const { accessToken } = await this.authProvider.signUpDiscord(authDto);
    this.storageProvider.setItem("jwt", accessToken);
    return { accessToken };
  }

  /**
   * Sign user in using Discord exchange code. Persist access token to storage.
   * @param authDto
   */
  async signInDiscord(authDto: DiscordCredentialDto): Promise<LoginResponse> {
    const { accessToken } = await this.authProvider.signInDiscord(authDto);
    this.storageProvider.setItem("jwt", accessToken);
    return { accessToken };
  }

  /**
   * Connect Discord account to current UID using Discord exchange code.
   */
  async connectDiscord(
    createAuthDto: DiscordCredentialDto
  ): Promise<AuthEntity> {
    return this.authProvider.connectDiscord(createAuthDto);
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
  async resetWithNewWallet(createAuthDto: CreateAuthDto): Promise<AuthEntity> {
    return this.authProvider.resetWithNewWallet(createAuthDto);
  }

  /**
   * Connect new email to UID
   */
  async connectEmail(connectEmailAuthDto: ConnectEmailAuthDto) {
    return this.authProvider.connectEmail(connectEmailAuthDto);
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
   * Verify a wallet whether it belongs to current user or not.
   * @param createAuthDto
   */
  async verifyWallet(createAuthDto: CreateAuthDto): Promise<boolean> {
    try {
      await this.authProvider.verifyWallet(createAuthDto);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sign user up. Persist access token to storage.
   * @param authDto
   */
  async signUp(authDto: RegistrationAuthDto): Promise<LoginResponse> {
    const { accessToken } = await this.authProvider.signUp(authDto);
    this.storageProvider.setItem("jwt", accessToken);
    return { accessToken };
  }

  /**
   * Log user out of current session. Also remove access token from storage.
   */
  async logout(): Promise<void> {
    try {
      await this.authProvider.logout();
    } catch {}

    this.removeCredential();
  }
}
