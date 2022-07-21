import { OffChainAction } from "./offchain.action";
import { PublicAuthClientEntity, User } from "../dto/entities";

/**
 * The `UserAction` represents the underlying logic for user actions: get profile, update profile, ...
 */
export class OAuthAction extends OffChainAction {
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
}
