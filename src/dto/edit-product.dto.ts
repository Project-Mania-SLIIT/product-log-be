import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDefined,
  IsMongoId,
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

export class EditProductDto {
  @IsDefined()
  @IsMongoId()
  productId: string;

  @IsDefined()
  @Length(1, 45)
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;

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
  @ArrayMaxSize(6)
  images: ProductImageDto[];
}

class ProductImageDto {
  @IsOptional()
  @IsMongoId()
  imageId?: string;

  @IsOptional()
  @IsFile()
  @MaxFileSize(2 * 1024 * 1024)
  @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'])
  file?: MemoryStoredFile;

  @IsDefined()
  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  isFeatured: boolean;

  @IsDefined()
  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  isDeleted: boolean;

  @IsDefined()
  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  isNew: boolean;
}
