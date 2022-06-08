import { IsString } from "class-validator";

export class WalletCredentialAuthDto {
  @IsString()
  walletAddress: string;

  @IsString()
  signedData: string;

  @IsString()
  authChallengeId: string;
}
