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
