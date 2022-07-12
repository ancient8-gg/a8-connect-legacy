import { IsString, IsEnum, ValidateNested } from "class-validator";
import { WalletCredentialAuthDto } from "./wallet-credential-auth.dto";
import { AuthType } from "./entities";

export class ResetWithNewWalletDto {
  @IsEnum(AuthType)
  type: AuthType;

  @ValidateNested()
  credential: WalletCredentialAuthDto;
}

export class ResetWithNewWalletPayload {
  @IsString()
  authToken: string;

  @IsString()
  email: string;
}
