import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingDto {
  @IsNotEmpty({ message: 'Phone Number Cannot Be Empty' })
  @IsString({ message: 'Phone Number Must be of String Format' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Name Must be of String Format' })
  name: string;

  @IsNotEmpty({ message: 'Address Cannot Be Empty' })
  @IsString({ message: 'Address Must be of String Format' })
  address: string;

  @IsNotEmpty({ message: 'City Cannot Be Empty' })
  @IsString({ message: 'City Must be of String Format' })
  city: string;

  @IsNotEmpty({ message: 'Post Code Cannot Be Empty' })
  @IsString({ message: 'Post Code Must be of String Format' })
  postCode: string;

  @IsNotEmpty({ message: 'State Cannot Be Empty' })
  @IsString({ message: 'State Must be of String Format' })
  state: string;

  @IsNotEmpty({ message: 'Country Cannot Be Empty' })
  @IsString({ message: 'Country Must be of String Format' })
  country: string;
}
