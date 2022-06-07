import { WalletCredentialAuthDto } from "./wallet-credential-auth.dto";
import { IsEnum, ValidateNested } from "class-validator";
import { AuthType } from "./entities";

export class CreateAuthDto {
  @ValidateNested()
  credential: WalletCredentialAuthDto;

  @IsEnum(AuthType)
  type: AuthType;
}
