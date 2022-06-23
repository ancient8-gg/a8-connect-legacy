import { AuthType } from "./entities";
import { WalletCredentialAuthDto } from "./wallet-credential-auth.dto";
import { ValidateNested, IsEnum } from "class-validator";

export class ConnectWalletDto {
  @IsEnum(AuthType)
  type: AuthType;

  @ValidateNested()
  credential: WalletCredentialAuthDto;
}
