import { Module } from '@nestjs/common';
import { AlmacenamientoController } from './almacenamiento.controller';
import { AlmacenamientoService } from './almacenamiento.service';
import { MediaController } from './media.controller';

@Module({
  controllers: [AlmacenamientoController, MediaController],
  providers: [AlmacenamientoService],
  exports: [AlmacenamientoService],
})
export class AlmacenamientoModule {}
