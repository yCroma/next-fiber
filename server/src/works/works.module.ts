import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorksService } from './works.service'
import { WorksController } from './works.controller'
import { Asset } from '../upload/asset.entity'
import { Comment } from './comment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Asset, Comment])],
  providers: [WorksService],
  controllers: [WorksController]
})
export class WorksModule {}
