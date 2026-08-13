import { Module } from '@nestjs/common';
import { ValoresController } from './valores.controller';
import { ValoresService } from './valores.service';

@Module({
  controllers: [ValoresController],
  providers: [ValoresService],
})
export class ValoresModule {}
