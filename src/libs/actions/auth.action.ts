import { OffChainAction } from "./offchain.action";
import { RegistrationAuthDto } from "../dto/registration-auth.dto";
import { LoginWalletAuthDto } from "../dto/login-wallet-auth.dto";
import { LoginResponse } from "../dto/entities";

/**
 * `AuthActions` provides methods to handle all authenticating actions.
 */
export class AuthAction extends OffChainAction {
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
   * Sign user in
   * @param authDto
   */
  async signIn(authDto: LoginWalletAuthDto): Promise<LoginResponse> {
    return this.authProvider.signInWallet(authDto);
  }

  /**
   * Sign user up
   * @param authDto
   */
  async signUp(authDto: RegistrationAuthDto): Promise<LoginResponse> {
    return this.authProvider.signUpWallet(authDto);
  }
}
