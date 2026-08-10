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
import { ProgramasService } from './programas.service';
import { ActualizarProgramaDto, CrearProgramaDto } from './dto/programa.dto';

@Controller('programas')
export class ProgramasController {
  constructor(private readonly programasService: ProgramasService) {}

  /** Listado público: solo programas activos, para el sitio. */
  @Get('publicos')
  listarPublicos() {
    return this.programasService.listarPublicos();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  listarTodos() {
    return this.programasService.listarTodos();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  obtener(@Param('id', ParseUUIDPipe) id: string) {
    return this.programasService.obtener(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  crear(@Body() dto: CrearProgramaDto) {
    return this.programasService.crear(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarProgramaDto,
  ) {
    return this.programasService.actualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.programasService.eliminar(id);
  }
}
