import { IsNotEmpty, IsEmail, MinLength, Matches } from 'class-validator';

export class UserSignInDto {
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password minimum character should be 8' })
  password: string;
}
