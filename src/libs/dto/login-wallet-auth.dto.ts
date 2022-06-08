import { IsEnum, ValidateNested } from "class-validator";
import { WalletCredentialAuthDto } from "./wallet-credential-auth.dto";
import { AuthType } from "./entities";

export class LoginWalletAuthDto {
  @IsEnum(AuthType)
  type: AuthType;

  @ValidateNested()
  credential: WalletCredentialAuthDto;
}
