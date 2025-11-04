import { IsOptional, IsNumber, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
// Use explicit allowed status values instead of importing BookStatus from Prisma

export class BookFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'page must be a number' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'limit must be a number' })
  limit?: number;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @IsIn(['AVAILABLE', 'OUT_OF_STOCK', 'DISCONTINUED', 'DISABLE'], { message: 'status must be one of AVAILABLE, OUT_OF_STOCK, DISCONTINUED, DISABLE' })
  status?: string;
}
