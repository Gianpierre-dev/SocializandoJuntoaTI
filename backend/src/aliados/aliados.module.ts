import { Module } from '@nestjs/common';
import { AliadosController } from './aliados.controller';
import { AliadosService } from './aliados.service';

@Module({
  controllers: [AliadosController],
  providers: [AliadosService],
})
export class AliadosModule {}
