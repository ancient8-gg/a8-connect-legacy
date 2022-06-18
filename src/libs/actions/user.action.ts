import { OffChainAction } from "./offchain.action";
import { AuthEntity, AuthSession, User, UserInfo } from "../dto/entities";
import { UpdateProfileAuthDto } from "../dto/profile-user.dto";

/**
 * The `UserAction` represents the underlying logic for user actions: get profile, update profile, ...
 */
export class UserAction extends OffChainAction {
  /**
   * The function to get user profile.
   */
  getUserProfile(): Promise<UserInfo> {
    return this.userProvider.getUser();
  }

  /**
   * The function to upload user avatar.
   * @param file
   */
  updateAvatar(file: File): Promise<User> {
    return this.userProvider.uploadProfileImage(file);
  }

  /**
   * The function to update user profile
   * @param payload
   */
  updateProfile(payload: UpdateProfileAuthDto): Promise<User> {
    return this.userProvider.updateProfile(payload);
  }

  /**
   * Delete wallet.
   */
  deleteAuthEntity(authId: string): Promise<void> {
    return this.userProvider.deleteAuthEntity(authId);
  }

  /**
   * Make primary auth entity
   * @param authId
   */
  makePrimaryAuthEntity(authId: string): Promise<AuthEntity> {
    return this.userProvider.makePrimaryAuthEntity(authId);
  }

  /**
   * Get auth entities.
   */
  getAuthEntities(): Promise<AuthEntity[]> {
    return this.userProvider.getAuthEntities();
  }

  /**
   * Get auth sessions.
   */
  getAuthSessions(): Promise<AuthSession[]> {
    return this.userProvider.getAuthSessions();
  }
}
