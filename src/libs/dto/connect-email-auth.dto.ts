import { IsEmail, IsNumberString, MaxLength } from "class-validator";

export class ConnectEmailAuthDto {
  @IsEmail()
  email: string;

  @IsNumberString()
  @MaxLength(6)
  token: string;
}
