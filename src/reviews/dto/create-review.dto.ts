import { IsNotEmpty, Min, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Product Cannot Be Empty' })
  @IsNumber({}, { message: 'Product Id Must Be a Number' })
  @Min(1, { message: 'Product Id Cannot be Lesser Than 1' })
  product: number;

  @IsNotEmpty({ message: 'Rating Cannot Be Empty' })
  @IsNumber({}, { message: 'Rating Must Be a Number' })
  ratings: number;

  @IsNotEmpty({ message: 'Comment Cannot Be Empty' })
  @IsString()
  comment: string;
}
