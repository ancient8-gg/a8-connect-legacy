import {
  IsAlphanumeric,
  IsEmail,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { WalletCredentialAuthDto } from "./wallet-credential-auth.dto";
import { AuthType } from "./entities";
import { DiscordCredentialDto } from "./discord-oauth.dto";

export class RegistrationAuthDto {
  @IsOptional()
  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
  })
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  displayName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(32)
  username?: string;

  @IsIn([AuthType.EVMChain, AuthType.Solana])
  type: AuthType;

  @ValidateNested()
  credential: WalletCredentialAuthDto;
}

export class DiscordRegistrationAuthDto {
  @IsOptional()
  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
  })
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  displayName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(32)
  username?: string;

  @IsIn([AuthType.Discord])
  type: AuthType;

  @ValidateNested()
  credential: DiscordCredentialDto;
}

export class EmailOTPRegistrationAuthDto {
  @IsNumberString()
  @Length(6)
  token: string;

  @IsIn([AuthType.EmailOTP])
  type: AuthType;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
  })
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  displayName?: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(32)
  username?: string;
}
