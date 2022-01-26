import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>
  ){}

  async createAsset(asset: Asset): Promise<Asset> {
    return this.assetsRepository.save(asset)
  }

  // findOne(id: string): Promise<Params> {
  //   return this.paramsRepository.findOne(id)
  // }

}
