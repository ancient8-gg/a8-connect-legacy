import { BusinessProvider } from "./business.provider";
import { AuthEntity, AuthSession, User, UserInfo } from "../dto/entities";
import { UpdateProfileAuthDto } from "../dto/profile-user.dto";
import { SessionInfo } from "../dto/persist-kyc.dto";

/**
 * `UserProvider` provides all business request calls to A8Connect backend, which related to User profile.
 */
export class UserProvider extends BusinessProvider {
  /**
   * The function to get current user information using current session credential.
   */
  getUser(): Promise<UserInfo> {
    return this.requestWithCredential<UserInfo>("/user/profile", {
      method: "GET",
    });
  }

  /**
   * The function to update user profile using current session credential.
   * @param payload
   */
  updateProfile(payload: UpdateProfileAuthDto): Promise<User> {
    return this.requestWithCredential<User>("/user/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  /**
   * The function to upload user profile image using current session credential.
   * @param payload
   */
  uploadProfileImage(payload: File): Promise<User> {
    const formData = new FormData();
    formData.append(
      "files",
      payload,
      payload.name || `${new Date().getTime()}.png`
    );

    return this.requestWithCredential<User>("/user/profile/upload-image", {
      method: "POST",
      body: formData,
    });
  }

  /**
   * Get auth entities
   */
  getAuthEntities(): Promise<AuthEntity[]> {
    return this.requestWithCredential<AuthEntity[]>(
      `/user/profile/auth-entities/`,
      {
        method: "GET",
      }
    );
  }

  /**
   * Delete auth entity
   */
  deleteAuthEntity(authId: string): Promise<void> {
    return this.requestWithCredential<void>(
      `/user/profile/auth-entities/${authId}`,
      {
        method: "DELETE",
      }
    );
  }

  /**
   * Make primary auth entity
   * @param authId
   */
  makePrimaryAuthEntity(authId: string): Promise<AuthEntity> {
    return this.requestWithCredential<AuthEntity>(
      `/user/profile/auth-entities/${authId}/make-primary`,
      {
        method: "POST",
      }
    );
  }

  /**
   * Get Auth session
   */
  getAuthSessions(): Promise<AuthSession[]> {
    return this.requestWithCredential<AuthSession[]>(
      `/user/profile/auth-entities`,
      {
        method: "GET",
      }
    );
  }

  /**
   * Init kyc session
   */
  initKycSession(): Promise<SessionInfo> {
    return this.requestWithCredential<SessionInfo>(
      `/user/profile/init-kyc-session`,
      {
        method: "POST",
      }
    );
  }

  /**
   * The function to validate if a username is existed.
   * @param username
   */
  validateUsername(username: string): Promise<void> {
    return this.request<void>(
      `/user/validate/username/${encodeURIComponent(username)}`,
      {
        method: "POST",
      }
    );
  }

  /**
   * The function to validate if a wallet address is existed.
   * @param walletAddress
   */
  validateWalletAddress(walletAddress: string): Promise<void> {
    return this.request<void>(
      `/user/validate/wallet-address/${encodeURIComponent(walletAddress)}`,
      {
        method: "POST",
      }
    );
  }
}
