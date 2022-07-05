import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Records } from '../database/entities/Records.entity';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  controllers: [RecordsController],
  providers: [RecordsService],
  imports: [
    TypeOrmModule.forFeature([Records]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),],
  exports: [TypeOrmModule]
})
export class RecordsModule {}
