import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from './upload.service'
import { UploadController } from './upload.controller'
import { Asset } from './asset.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  providers: [UploadService],
  controllers: [UploadController]
})
export class UploadModule {}
