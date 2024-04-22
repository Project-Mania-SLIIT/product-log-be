import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreateProductDto {
  @IsDefined()
  @Length(1, 45)
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description: string;

  @IsDefined()
  @IsString()
  @Length(1, 45)
  sku: string;

  @IsDefined()
  @IsString()
  @Length(1, 15)
  price: string;

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  images: ProductImageDto[];
}

class ProductImageDto {
  @IsDefined()
  @IsFile()
  @MaxFileSize(2 * 1024 * 1024)
  @HasMimeType(['image/jpeg', 'image/png'])
  file: MemoryStoredFile;

  @IsDefined()
  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  isFeatured: boolean;
}
