import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CrearPostulacionDto {
  @IsString()
  @MinLength(3, { message: 'Escribe tu nombre completo' })
  @MaxLength(120)
  nombre!: string;

  @IsInt({ message: 'La edad debe ser un número' })
  @Min(14, { message: 'Debes tener al menos 14 años' })
  @Max(99)
  edad!: number;

  @IsEmail({}, { message: 'El correo no es válido' })
  @MaxLength(160)
  correo!: string;

  @IsString()
  @MinLength(9, { message: 'El celular debe tener al menos 9 dígitos' })
  @MaxLength(20)
  celular!: string;

  @IsString()
  @MinLength(2, { message: 'Selecciona un área de interés' })
  @MaxLength(80)
  area!: string;

  @IsString()
  @MinLength(2, { message: 'Indica tu disponibilidad' })
  @MaxLength(120)
  disponibilidad!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  mensaje?: string;
}
