import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsString, MinLength } from 'class-validator';

export class CrearValorDto {
  @IsString()
  @MinLength(2)
  titulo!: string;

  @IsString()
  descripcion!: string;

  @IsInt()
  orden!: number;
}

export class ActualizarValorDto extends PartialType(CrearValorDto) {}
