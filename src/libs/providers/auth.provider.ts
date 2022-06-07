import { BusinessProvider } from "./business.provider";
import { LoginResponse } from "../dto/entities";
import { LoginWalletAuthDto } from "../dto/login-wallet-auth.dto";

export class AuthProvider extends BusinessProvider {
  /**
   * The function to login using credential from wallet signature.
   * @param loginPayload
   */
  loginWallet(loginPayload: LoginWalletAuthDto): Promise<LoginResponse> {
    const networkProvider = this.getNetworkProvider();

    return networkProvider.request<LoginResponse>("/auth/login-wallet", {
      body: JSON.stringify(loginPayload),
    });
  }
}
