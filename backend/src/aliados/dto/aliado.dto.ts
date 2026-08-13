import { PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CrearAliadoDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nombre!: string;

  @IsString()
  @MaxLength(60)
  usuarioRedes!: string;

  @IsOptional()
  @IsString()
  @Matches(/^https?:\/\//, { message: 'El enlace debe empezar con https://' })
  @MaxLength(300)
  enlace?: string;

  @IsInt()
  orden!: number;
}

export class ActualizarAliadoDto extends PartialType(CrearAliadoDto) {}
