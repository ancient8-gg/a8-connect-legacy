import {
  IsEnum,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { WalletCredentialAuthDto } from "./wallet-credential-auth.dto";
import { AuthType } from "./entities";

export class ConnectOauthDto {
  @IsEnum(AuthType)
  type: AuthType;

  @ValidateNested()
  credential: WalletCredentialAuthDto;

  @IsString()
  @MaxLength(32)
  clientKey: string;

  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
  })
  redirectUri: string;
}

/**
 * `OAuthCredential` for oauth apis usage.
 */
export class OAuthCredential {
  /**
   * `AuthClientKey` can be obtained by contacting A8 UID admins.
   */
  authClientKey: string;

  /**
   * `authClientSecret` can be obtained by contacting A8 UID admins.
   */
  authClientSecret: string;
}
