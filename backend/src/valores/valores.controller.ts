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
import { ValoresService } from './valores.service';
import { ActualizarValorDto, CrearValorDto } from './dto/valor.dto';

@Controller('valores')
export class ValoresController {
  constructor(private readonly valoresService: ValoresService) {}

  /** Listado público para el sitio. */
  @Get('publicos')
  listarPublicos() {
    return this.valoresService.listar();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  listar() {
    return this.valoresService.listar();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  crear(@Body() dto: CrearValorDto) {
    return this.valoresService.crear(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarValorDto,
  ) {
    return this.valoresService.actualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.valoresService.eliminar(id);
  }
}
