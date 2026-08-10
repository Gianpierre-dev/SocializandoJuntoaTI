import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';

export interface CargaUtilJwt {
  sub: string;
  correo: string;
  rol: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async iniciarSesion(dto: IniciarSesionDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo.toLowerCase() },
    });

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const contrasenaValida = await bcrypt.compare(
      dto.contrasena,
      usuario.contrasena,
    );
    if (!contrasenaValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const cargaUtil: CargaUtilJwt = {
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    };

    return {
      tokenAcceso: await this.jwtService.signAsync(cargaUtil),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    };
  }
}
