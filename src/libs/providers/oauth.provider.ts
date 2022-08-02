import { BusinessProvider } from "./business.provider";
import {
  PaginatedResponse,
  PublicAuthClientEntity,
  User,
  UserInfo,
} from "../dto/entities";

/**
 * `OAuthProvider` provides all business request calls to A8Connect backend, which related to OAuth actions.
 */
export class OAuthProvider extends BusinessProvider {
  /**
   * `getUserInfo` will retrieve user information via oauth credential.
   * @param userId
   */
  public getUserInfo(userId: string): Promise<User> {
    /**
     * Make request
     */
    return this.requestWithOAuthCredential<UserInfo>(`/oauth/user/${userId}`, {
      method: "GET",
    });
  }

  /**
   * `getPublicClientInfo` will retrieve public auth client information.
   * @param authClientKey
   */
  public getPublicClientInfo(
    authClientKey: string
  ): Promise<PublicAuthClientEntity> {
    /**
     * Make request
     */
    return this.request(`/oauth/${authClientKey}/public-info`, {
      method: "GET",
    });
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
    return this.requestWithOAuthCredential(
      `/oauth/user?${new URLSearchParams(
        filters as unknown as Record<string, string>
      ).toString()}`,
      {
        method: "GET",
      }
    );
  }
}
