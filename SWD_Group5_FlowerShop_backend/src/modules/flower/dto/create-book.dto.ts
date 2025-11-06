import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateFlowerDto {
  @IsString()
  title: string;

  @IsString()
  image: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsArray()
  categoryIds: string[] | string; // danh sách ID thể loại
}
