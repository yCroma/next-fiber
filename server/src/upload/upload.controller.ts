import { Controller, Param, Body, Response,Get, Post, UseInterceptors, UploadedFile, StreamableFile } from '@nestjs/common';
import { FileInterceptor  } from '@nestjs/platform-express'

import { CreateAssetDto } from './create-asset.dto'
import { UploadService } from './upload.service'

import { customAlphabet } from 'nanoid'
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService){}

  @Post('params')
  create(@Body() createAssetDto: CreateAssetDto)  {
    console.log("Body: ", createAssetDto)
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const nanoid = customAlphabet(alphabet, 16);
    const path = nanoid()
    const asset = {...createAssetDto, path}
    console.log("Asset: ", asset)
    this.uploadService.createAsset(asset)
    return path
  }
  @Post('fbx')
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  }) }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return "done"
  }
  @Get('fbx/:path')
  streamFile(@Response({ passthrough: true }) res, @Param("path") path: string): StreamableFile {
    console.log("path: ", path)
    /**
     * TASK:
     * findAsset から ファイル名をとってくる
     */

    const file = createReadStream(join(process.cwd(), 'uploads', path));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="package.json"',
    });
    return new StreamableFile(file);
  }

  @Get()
  async findAll(): Promise<string> {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const nanoid = customAlphabet(alphabet, 16);
    const fileid = nanoid()
    return fileid
  }
}

