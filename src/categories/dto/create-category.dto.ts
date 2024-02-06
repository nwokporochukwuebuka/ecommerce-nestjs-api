import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Title Cannot Be Empty' })
  @IsString({ message: 'Title Must be a String' })
  title: string;

  @IsNotEmpty({ message: 'Description Cannot Be Emty' })
  @IsString({ message: 'Descrption Must Be a String' })
  description: string;
}
