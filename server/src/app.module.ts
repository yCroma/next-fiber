import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from './upload/upload.module';
import { Asset } from './upload/asset.entity'
import { WorksController } from './works/works.controller';
import { WorksService } from './works/works.service';
import { WorksModule } from './works/works.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    "type": "mysql",
    "host": "db",
    "port": 3306,
    "username": "root",
    "password": "root",
    "database": "develop",
    "entities": [Asset],
    "synchronize": true,
    "autoLoadEntities": true,
  }), UploadModule, WorksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
