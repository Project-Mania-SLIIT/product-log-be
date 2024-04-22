import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { CreateProductDto } from './dto/create-new-product.dto';
import { EditProductDto } from './dto/edit-product.dto';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    return await this.prisma.product.findMany({
      include: {
        images: {
          where: {
            isFeatured: true,
          },
        },
      },
    });
  }

  async getProductById(productId: string) {
    return await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
      },
    });
  }

  async createNewProduct(dto: CreateProductDto) {
    const { name, description, price, sku, images } = dto;

    const imageData = images?.map(({ file, isFeatured }) => {
      const contentType = file.mimetype;
      const base64Data = file?.buffer?.toString('base64');
      const data = `data:${contentType};base64,${base64Data}`;
      return {
        data,
        isFeatured,
        contentType: file.mimetype,
        filename: file.originalName,
      };
    });

    const productCreated = await this.prisma.product.create({
      data: {
        sku,
        name,
        description,
        price: price.replace(/[^0-9.]/g, ''),
        images: {
          createMany: {
            data: imageData,
          },
        },
      },
      include: {
        images: true,
      },
    });

    return productCreated;
  }

  async deleteProduct(productId: string) {
    const prodcutDeleted = await this.prisma.product.delete({
      where: { id: productId },
    });
    await this.prisma.prodcutImage.deleteMany({
      where: { productId },
    });
    return prodcutDeleted;
  }

  async editProduct({
    productId: id,
    sku,
    name,
    price,
    images,
    description,
  }: EditProductDto) {
    await this.prisma.product.update({
      where: { id },
      data: {
        name,
        sku,
        price,
        description,
      },
    });

    const imageUpdates = images
      ?.filter(({ imageId, isDeleted, isNew }) => {
        return imageId && !isDeleted && !isNew;
      })
      .map(({ imageId, isFeatured }) => {
        return this.prisma.prodcutImage.update({
          where: { id: imageId },
          data: { isFeatured },
        });
      });

    await Promise.all(imageUpdates);

    const imagesToDelete = images?.filter(
      ({ isDeleted, imageId }) => isDeleted && imageId,
    );
    if (imagesToDelete.length > 0) {
      await this.prisma.prodcutImage.deleteMany({
        where: {
          id: {
            in: imagesToDelete.map(({ imageId }) => imageId),
          },
        },
      });
    }

    const imagesToCreate = images?.filter(({ isNew, file }) => isNew && !!file);
    if (imagesToCreate.length > 0) {
      const imageData = imagesToCreate?.map(({ file, isFeatured }) => {
        const contentType = file.mimetype;
        const base64Data = file.buffer.toString('base64');
        const data = `data:${contentType};base64,${base64Data}`;
        return {
          data,
          isFeatured,
          productId: id,
          contentType: file?.mimetype,
          filename: file?.originalName,
        };
      });
      await this.prisma.prodcutImage.createMany({
        data: imageData,
      });
    }

    return await this.prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });
  }
}
