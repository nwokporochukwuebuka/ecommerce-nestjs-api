import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Title Cannot Be Empty' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Description Cannot Be Empty' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Price Cannot Be Empty' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price Should be a Number With 2 Decimal Places' },
  )
  @IsPositive({ message: 'Price Should be a Positive Number' })
  price: number;

  @IsNotEmpty({ message: 'Stock Cannot Be Empty' })
  @IsNumber({}, { message: 'Stock Should be a Number' })
  @Min(0, { message: 'Price Cannot Be Lesser Than Zero' })
  stock: number;

  @IsNotEmpty({ message: 'Images Cannot Be Empty' })
  @IsArray({ message: 'Images Should Be In Array Format' })
  images: string[];

  @IsNotEmpty({ message: 'Category ID Cannot Be Empty' })
  @IsNumber({}, { message: 'Category ID Should be a Number' })
  category: number;
}
