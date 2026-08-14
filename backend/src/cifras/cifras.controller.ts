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
import { CifrasService } from './cifras.service';
import { ActualizarCifraDto, CrearCifraDto } from './dto/cifra.dto';

@Controller('cifras')
export class CifrasController {
  constructor(private readonly cifrasService: CifrasService) {}

  /** Cifras de impacto para la portada del sitio. */
  @Get('publicas')
  listarPublicas() {
    return this.cifrasService.listar();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  listar() {
    return this.cifrasService.listar();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  crear(@Body() dto: CrearCifraDto) {
    return this.cifrasService.crear(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarCifraDto,
  ) {
    return this.cifrasService.actualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.cifrasService.eliminar(id);
  }
}
