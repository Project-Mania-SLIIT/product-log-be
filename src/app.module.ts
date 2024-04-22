import { Module } from '@nestjs/common';
import {
  MemoryStoredFile,
  NestjsFormDataModule
} from 'nestjs-form-data';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    NestjsFormDataModule.config({
      isGlobal: true,
      storage: MemoryStoredFile,
      fileSystemStoragePath: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
