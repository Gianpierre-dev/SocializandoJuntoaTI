import { IsEmail, IsString, MinLength } from 'class-validator';

export class IniciarSesionDto {
  @IsEmail({}, { message: 'El correo no es válido' })
  correo!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  contrasena!: string;
}
