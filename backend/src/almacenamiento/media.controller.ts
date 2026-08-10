import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Readable } from 'node:stream';
import { AlmacenamientoService } from './almacenamiento.service';

/**
 * Sirve la media almacenada en Wasabi a través de la API (la cuenta de
 * Wasabi no permite objetos públicos). Cachea agresivamente: las claves
 * son inmutables (UUID por archivo).
 */
@Controller('media')
export class MediaController {
  constructor(private readonly almacenamiento: AlmacenamientoService) {}

  @Get(':carpeta/:archivo')
  async servir(
    @Param('carpeta') carpeta: string,
    @Param('archivo') archivo: string,
    @Res() respuesta: Response,
  ): Promise<void> {
    const objeto = await this.almacenamiento
      .obtenerObjeto(`${carpeta}/${archivo}`)
      .catch(() => null);

    if (!objeto?.Body) {
      throw new NotFoundException('Archivo no encontrado');
    }

    respuesta.setHeader(
      'Content-Type',
      objeto.ContentType ?? 'application/octet-stream',
    );
    respuesta.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    if (objeto.ContentLength) {
      respuesta.setHeader('Content-Length', objeto.ContentLength);
    }

    (objeto.Body as Readable).pipe(respuesta);
  }
}
