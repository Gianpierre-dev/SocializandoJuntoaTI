import { Module } from '@nestjs/common';
import { CifrasController } from './cifras.controller';
import { CifrasService } from './cifras.service';

@Module({
  controllers: [CifrasController],
  providers: [CifrasService],
})
export class CifrasModule {}
