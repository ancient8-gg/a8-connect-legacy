import { OffChainAction } from "./offchain.action";
import {
  PaginatedResponse,
  PublicAuthClientEntity,
  User,
} from "../dto/entities";
import { OAuthCredential } from "../dto/connect-oauth.dto";

/**
 * The `UserAction` represents the underlying logic for oauth actions: get public client info, get user info via oauth credential...
 */
export class OAuthAction extends OffChainAction {
  /**
   * The function to modify/delete credential
   */
  setOAuthCredential(oauthCredential: OAuthCredential | null) {
    if (oauthCredential === null) return this.removeOAuthCredential();
    this.storageProvider.setItem(
      "oauth_credential",
      JSON.stringify(oauthCredential)
    );
  }

  /**
   * The function to remove credential
   */
  removeOAuthCredential() {
    this.storageProvider.removeItem("oauth_credential");
  }

  /**
   * `getPublicClientInfo` returns the public client info.
   * @param authClientKey
   */
  getPublicClientInfo(authClientKey: string): Promise<PublicAuthClientEntity> {
    return this.oauthProvider.getPublicClientInfo(authClientKey);
  }

  /**
   * `getUserInfo` returns the user info via oauth credential.
   * @param userId
   */
  getUserInfo(userId: string): Promise<User> {
    return this.oauthProvider.getUserInfo(userId);
  }

  /**
   * `getAuthorizerUsers` will retrieve users that authorized current auth client.
   * @param filters
   */
  public getAuthorizerUsers(filters: {
    searchQuery: string;
    skip?: number;
    limit?: number;
    sort?: string;
  }): Promise<PaginatedResponse<User>> {
    return this.oauthProvider.getAuthorizerUsers(filters);
  }
}
