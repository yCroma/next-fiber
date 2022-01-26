import { Controller, Response, Param, Get, Post, StreamableFile, Body } from '@nestjs/common';
import { WorksService } from './works.service'
import { CreateAssetDto } from '../upload/create-asset.dto'
import { CreateCommentDto } from './create-comment.dto'

import { createReadStream } from 'fs';
import { join } from 'path';
import { assert } from 'console';

@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService){}

  @Get(':path/fbx')
  async streamFile( @Param("path") path: string): Promise<StreamableFile >{
    const file = createReadStream(join(process.cwd(), 'uploads', path));
    return new StreamableFile(file);
  }
  @Get(':path')
  async findAsset(@Param("path") path: string): Promise<CreateAssetDto> {
    /**
     * TASK:
     * 例外処理
     */
    const asset = await this.worksService.findOne(path)
    const comments = await this.worksService.getComments(asset.id)
    asset.comments = comments
    return asset
  }
  @Get(':path/comments')
  async getComments(@Param("path") path: string ) {
    const asset = await this.worksService.findOne(path)
    const comments = await this.worksService.getComments(asset.id)
    return comments
  }
  @Post(':path/comment')
  async readComment(@Param("path") path: string, @Body() createCommentDto: CreateCommentDto): Promise<CreateCommentDto[]> {
    const newComment = await this.worksService.createComment(path, createCommentDto)
    /**
     * TASK:
     * 多対１のid参照
     */
    const comments = await this.worksService.getComments(newComment.asset.id)
    console.log("comments: ", comments)
    return comments
  }
}
