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
import { EquipoService } from './equipo.service';
import { ActualizarMiembroDto, CrearMiembroDto } from './dto/miembro.dto';

@Controller('equipo')
export class EquipoController {
  constructor(private readonly equipoService: EquipoService) {}

  /** Listado público para el sitio. */
  @Get('publico')
  listarPublico() {
    return this.equipoService.listar();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  listar() {
    return this.equipoService.listar();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  crear(@Body() dto: CrearMiembroDto) {
    return this.equipoService.crear(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarMiembroDto,
  ) {
    return this.equipoService.actualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.equipoService.eliminar(id);
  }
}
