import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Fiyat sıfırdan büyük olmalıdır.' })
  price: number;

  @IsNotEmpty()
  @IsString()
  description: string;
} 