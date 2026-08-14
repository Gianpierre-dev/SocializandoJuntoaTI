import { Module } from '@nestjs/common';
import { TestimoniosController } from './testimonios.controller';
import { TestimoniosService } from './testimonios.service';

@Module({
  controllers: [TestimoniosController],
  providers: [TestimoniosService],
})
export class TestimoniosModule {}
