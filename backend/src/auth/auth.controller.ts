import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('iniciar-sesion')
  @HttpCode(HttpStatus.OK)
  iniciarSesion(@Body() dto: IniciarSesionDto) {
    return this.authService.iniciarSesion(dto);
  }
}
