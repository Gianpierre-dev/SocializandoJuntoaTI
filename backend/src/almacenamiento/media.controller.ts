import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Readable } from 'node:stream';
import {
  AlmacenamientoService,
  CARPETAS_PERMITIDAS,
  TIPOS_IMAGEN,
} from './almacenamiento.service';

// Forma exacta de las claves que produce el uploader: UUID v4 + extensión.
const PATRON_ARCHIVO =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]{2,5}$/;

/**
 * Sirve la media almacenada en Wasabi a través de la API (la cuenta de
 * Wasabi no permite objetos públicos). El Content-Type se deriva SIEMPRE
 * de la extensión contra un allowlist de imágenes pasivas — nunca del
 * metadato almacenado — para impedir XSS por archivos activos.
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
    if (
      !(CARPETAS_PERMITIDAS as readonly string[]).includes(carpeta) ||
      !PATRON_ARCHIVO.test(archivo)
    ) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const extension = archivo.split('.').pop()?.toLowerCase() ?? '';
    const tipoImagen = TIPOS_IMAGEN[extension];
    if (!tipoImagen) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const objeto = await this.almacenamiento
      .obtenerObjeto(`${carpeta}/${archivo}`)
      .catch(() => null);

    if (!objeto?.Body) {
      throw new NotFoundException('Archivo no encontrado');
    }

    respuesta.setHeader('Content-Type', tipoImagen);
    respuesta.setHeader('X-Content-Type-Options', 'nosniff');
    respuesta.setHeader(
      'Content-Security-Policy',
      "default-src 'none'; sandbox",
    );
    respuesta.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    if (objeto.ContentLength) {
      respuesta.setHeader('Content-Length', objeto.ContentLength);
    }

    (objeto.Body as Readable).pipe(respuesta);
  }
}
