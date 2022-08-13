import { IsIn, IsString, MinLength } from "class-validator";

/**
 * DiscordCredentialDto.
 */
export class DiscordCredentialDto {
  @IsString()
  @MinLength(6)
  exchangeCode: string;

  @IsIn(["auth", "connect"])
  type: "auth" | "connect";
}
