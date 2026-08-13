import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CrearMiembroDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsString()
  usuarioRedes!: string;

  @IsString()
  rol!: string;

  @IsOptional()
  @IsString()
  fotoUrl?: string;

  @IsInt()
  orden!: number;
}

export class ActualizarMiembroDto extends PartialType(CrearMiembroDto) {}
