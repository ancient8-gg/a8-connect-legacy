import { IsEmail, IsNumberString, Length } from "class-validator";

export class EmailOTPLoginAuthDto {
  @IsNumberString()
  @Length(6)
  token: string;

  @IsEmail()
  email: string;
}
