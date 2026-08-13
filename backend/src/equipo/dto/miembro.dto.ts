import { PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CrearMiembroDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nombre!: string;

  @IsString()
  @MaxLength(60)
  usuarioRedes!: string;

  @IsString()
  @MaxLength(80)
  rol!: string;

  @IsOptional()
  @IsString()
  fotoUrl?: string;

  @IsInt()
  orden!: number;
}

export class ActualizarMiembroDto extends PartialType(CrearMiembroDto) {}
