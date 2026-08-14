import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CorreoService } from './correo.service';

@Controller('correo')
@UseGuards(JwtAuthGuard)
export class CorreoController {
  constructor(private readonly correo: CorreoService) {}

  /** Verifica la configuración enviando un correo de prueba al buzón. */
  @Post('prueba')
  enviarPrueba() {
    return this.correo.enviarPrueba();
  }
}
