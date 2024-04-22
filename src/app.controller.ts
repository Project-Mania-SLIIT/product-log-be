import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';

import { AppService } from './app.service';
import { CreateProductDto } from './dto/create-new-product.dto';
import { EditProductDto } from './dto/edit-product.dto';

@Controller({ path: 'product' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('all')
  async getAllProducts() {
    return await this.appService.getAllProducts();
  }

  @Get('id/:productId')
  async getProductById(@Param('productId') productId: string) {
    return await this.appService.getProductById(productId);
  }

  @Post()
  @FormDataRequest()
  async createNewProduct(@Body() dto: CreateProductDto) {
    return await this.appService.createNewProduct(dto);
  }

  @Put()
  @FormDataRequest()
  async EditProduct(@Body() dto: EditProductDto) {
    return await this.appService.editProduct(dto);
  }

  @Delete(':productId')
  async deleteProduct(@Param('productId') productId: string) {
    return await this.appService.deleteProduct(productId);
  }
}
