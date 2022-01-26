import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../upload/asset.entity';
import { Comment } from './comment.entity';
import { assert } from 'console';

@Injectable()
export class WorksService {
  constructor(private connection: Connection) {}
  // constructor(
  //   @InjectRepository(Asset)
  //   private assetsRepository: Repository<Asset>,
  // ){}

  async findOne(path: string): Promise<Asset> {
    /**
     * TASK:
     * commentsを最新の10件だけ取得するようにする
     */
    const assetsRepository = this.connection.getRepository(Asset);
    const asset = await assetsRepository.findOne({ path: path })
    return asset
  }

  getComments(id: number): Promise<Array<Comment>> {
    const commentsRepository = this.connection.getRepository(Comment)
    const comments = commentsRepository.find({
      where: { assetId: id },
      order: {
        "createdAt": "DESC"
      },
      take: 5, 
    })
    return comments
  }

  async createComment(path: string ,comment: Comment): Promise<Comment> {
    const assetsRepository = this.connection.getRepository(Asset);
    const commentsRepository = this.connection.getRepository(Comment)
    const asset = await assetsRepository.findOne({ path: path }, {relations: ["comments"]})
    comment.asset = asset
    await commentsRepository.save(comment)
    return comment
  }
}
