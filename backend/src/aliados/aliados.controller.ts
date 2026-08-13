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
import { AliadosService } from './aliados.service';
import { ActualizarAliadoDto, CrearAliadoDto } from './dto/aliado.dto';

@Controller('aliados')
export class AliadosController {
  constructor(private readonly aliadosService: AliadosService) {}

  /** Listado público para el sitio. */
  @Get('publicos')
  listarPublicos() {
    return this.aliadosService.listar();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  listar() {
    return this.aliadosService.listar();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  crear(@Body() dto: CrearAliadoDto) {
    return this.aliadosService.crear(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarAliadoDto,
  ) {
    return this.aliadosService.actualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.aliadosService.eliminar(id);
  }
}
