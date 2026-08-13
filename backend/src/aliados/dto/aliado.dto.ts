import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CrearAliadoDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsString()
  usuarioRedes!: string;

  @IsOptional()
  @IsString()
  enlace?: string;

  @IsInt()
  orden!: number;
}

export class ActualizarAliadoDto extends PartialType(CrearAliadoDto) {}
