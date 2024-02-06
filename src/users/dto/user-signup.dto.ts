import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserSignInDto } from './user-signin.dto';

export class UserSignUpDto extends UserSignInDto {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name should be of type string' })
  name: string;
}
