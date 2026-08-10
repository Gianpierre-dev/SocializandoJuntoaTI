import { Module } from '@nestjs/common';
import { DonacionesController } from './donaciones.controller';
import { DonacionesService } from './donaciones.service';

@Module({
  controllers: [DonacionesController],
  providers: [DonacionesService],
})
export class DonacionesModule {}
