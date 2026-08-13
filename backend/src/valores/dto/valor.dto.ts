import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class CrearValorDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  titulo!: string;

  @IsString()
  @MaxLength(400)
  descripcion!: string;

  @IsInt()
  orden!: number;
}

export class ActualizarValorDto extends PartialType(CrearValorDto) {}
