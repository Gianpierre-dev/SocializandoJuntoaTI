import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostulacionesService } from './postulaciones.service';
import { CrearPostulacionDto } from './dto/postulacion.dto';

@Controller('postulaciones')
export class PostulacionesController {
  constructor(private readonly postulacionesService: PostulacionesService) {}

  /** Envío público del formulario de voluntariado del sitio. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: CrearPostulacionDto) {
    const postulacion = await this.postulacionesService.crear(dto);
    return { id: postulacion.id, recibida: true };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  listar() {
    return this.postulacionesService.listar();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.postulacionesService.eliminar(id);
  }
}
