import {
  IsAlphanumeric,
  IsBoolean,
  IsString,
  MaxLength,
  IsOptional,
} from "class-validator";

class ProfileUserDto {
  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(32)
  username?: string;

  @IsOptional()
  @IsBoolean()
  removeEmail?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  displayName?: string;
}

export class UpdateProfileAuthDto extends ProfileUserDto {}
