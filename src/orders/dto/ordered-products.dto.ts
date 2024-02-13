import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderedProductsDto {
  @IsNotEmpty({ message: 'ProductId Cannot be Empty' })
  id: number;
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price should be in 2 decimal places' },
  )
  @IsPositive({ message: 'Price Cannot Be Negative' })
  product_unit_price: number;

  @IsNumber({}, { message: 'Quantity should be Number' })
  @IsPositive({ message: 'Quantity Should Have a Positive Integer Value' })
  product_quantity: number;
}
