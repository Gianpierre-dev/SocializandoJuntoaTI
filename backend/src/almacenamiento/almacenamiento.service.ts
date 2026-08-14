import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';

export interface UrlSubida {
  urlSubida: string;
  urlPublica: string;
  clave: string;
}

// Solo formatos de imagen pasivos. SVG queda excluido a propósito: es
// contenido activo (puede embeber scripts) y servirlo abriría XSS almacenado.
export const TIPOS_IMAGEN: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

const EXTENSIONES_PERMITIDAS = new Set(Object.keys(TIPOS_IMAGEN));

export const CARPETAS_PERMITIDAS = [
  'banners',
  'programas',
  'donaciones',
  'actividades',
  'equipo',
  'noticias',
] as const;

@Injectable()
export class AlmacenamientoService {
  private readonly cliente: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;
  private readonly urlApiPublica: string;

  constructor(configService: ConfigService) {
    this.bucket = configService.getOrThrow<string>('WASABI_BUCKET');
    this.endpoint = configService.getOrThrow<string>('WASABI_ENDPOINT');
    this.urlApiPublica = configService.getOrThrow<string>('API_URL_PUBLICA');
    this.cliente = new S3Client({
      region: configService.getOrThrow<string>('WASABI_REGION'),
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: configService.getOrThrow<string>('WASABI_ACCESS_KEY'),
        secretAccessKey: configService.getOrThrow<string>('WASABI_SECRET_KEY'),
      },
    });
  }

  /**
   * Genera una URL firmada para subir una imagen directamente a Wasabi.
   * El archivo queda con lectura pública para servirse desde el sitio.
   */
  async generarUrlSubida(
    carpeta: string,
    extension: string,
    peso: number,
  ): Promise<UrlSubida> {
    const extensionNormalizada = extension.toLowerCase().replace(/^\./, '');
    if (!EXTENSIONES_PERMITIDAS.has(extensionNormalizada)) {
      throw new BadRequestException(
        `Extensión no permitida: ${extension}. Formatos aceptados: ${[...EXTENSIONES_PERMITIDAS].join(', ')}`,
      );
    }

    const clave = `${carpeta}/${randomUUID()}.${extensionNormalizada}`;
    // ContentLength firmado: la subida solo acepta exactamente el peso
    // declarado (el límite de 5 MB se valida en el DTO).
    const comando = new PutObjectCommand({
      Bucket: this.bucket,
      Key: clave,
      ContentType: TIPOS_IMAGEN[extensionNormalizada],
      ContentLength: peso,
    });

    const urlSubida = await getSignedUrl(this.cliente, comando, {
      expiresIn: 300,
      signableHeaders: new Set(['content-length', 'content-type', 'host']),
    });

    return {
      urlSubida,
      // La media se sirve a través de la API (Wasabi no permite objetos públicos).
      urlPublica: `${this.urlApiPublica}/api/media/${clave}`,
      clave,
    };
  }

  obtenerObjeto(clave: string): Promise<GetObjectCommandOutput> {
    return this.cliente.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: clave }),
    );
  }
}
