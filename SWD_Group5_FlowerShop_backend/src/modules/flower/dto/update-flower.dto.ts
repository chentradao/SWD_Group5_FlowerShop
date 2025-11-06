import { PartialType } from '@nestjs/mapped-types';
import { CreateFlowerDto } from './create-flower.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class UpdateFlowerDto extends PartialType(CreateFlowerDto) {
  @ApiProperty({ example: 'New Title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'New Image', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 250000, required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ example: ['3'], required: false })
  @IsOptional()
  @IsArray()
  categoryIds?: string[];
}
