import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TestimoniosService } from './testimonios.service';
import {
  ActualizarTestimonioDto,
  CrearTestimonioDto,
} from './dto/testimonio.dto';

@Controller('testimonios')
export class TestimoniosController {
  constructor(private readonly testimoniosService: TestimoniosService) {}

  /** Testimonios para la portada del sitio. */
  @Get('publicos')
  listarPublicos() {
    return this.testimoniosService.listar();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  listar() {
    return this.testimoniosService.listar();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  crear(@Body() dto: CrearTestimonioDto) {
    return this.testimoniosService.crear(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarTestimonioDto,
  ) {
    return this.testimoniosService.actualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.testimoniosService.eliminar(id);
  }
}
