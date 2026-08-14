import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';

export interface DatosPostulacion {
  nombre: string;
  edad: number;
  correo: string;
  celular: string;
  area: string;
  disponibilidad: string;
  mensaje?: string | null;
}

/**
 * Escapa texto antes de incrustarlo en el HTML del correo: los datos vienen
 * de un formulario público y no deben poder inyectar marcado ni enlaces.
 */
const escapar = (texto: string): string =>
  texto
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

/**
 * Envío de notificaciones por correo (SMTP). Si las credenciales no están
 * configuradas, el servicio queda inactivo y solo registra en el log: las
 * postulaciones nunca se pierden porque siempre se guardan en la base.
 */
@Injectable()
export class CorreoService {
  private readonly logger = new Logger(CorreoService.name);
  private readonly transporte: Transporter | null;
  private readonly destinatario: string;
  private readonly remitente: string;

  constructor(private readonly config: ConfigService) {
    const usuario = this.config.get<string>('SMTP_USUARIO');
    const contrasena = this.config.get<string>('SMTP_CONTRASENA');
    this.destinatario =
      this.config.get<string>('CORREO_NOTIFICACIONES') ??
      usuario ??
      'contacto.sojat@gmail.com';
    this.remitente = usuario ?? 'no-reply@socializandojuntoati.org';

    if (!usuario || !contrasena) {
      this.transporte = null;
      this.logger.warn(
        'SMTP sin configurar: las postulaciones se guardan pero no se notifican por correo.',
      );
      return;
    }

    this.transporte = createTransport({
      host: this.config.get<string>('SMTP_HOST') ?? 'smtp.gmail.com',
      port: Number(this.config.get<string>('SMTP_PUERTO') ?? 465),
      secure: true,
      auth: { user: usuario, pass: contrasena },
    });
  }

  get activo(): boolean {
    return this.transporte !== null;
  }

  /** Notifica una postulación nueva. Nunca lanza: no debe romper el registro. */
  async notificarPostulacion(datos: DatosPostulacion): Promise<void> {
    if (!this.transporte) return;

    const filas: [string, string][] = [
      ['Nombre', datos.nombre],
      ['Edad', String(datos.edad)],
      ['Correo', datos.correo],
      ['Celular', datos.celular],
      ['Área de interés', datos.area],
      ['Disponibilidad', datos.disponibilidad],
    ];
    if (datos.mensaje) filas.push(['Mensaje', datos.mensaje]);

    // Enlaces: solo dígitos en el teléfono y un correo con forma válida.
    const telefono = datos.celular.replace(/\D/g, '');
    const correoValido = /^[^\s@"'<>]+@[^\s@"'<>]+\.[^\s@"'<>]+$/.test(
      datos.correo,
    )
      ? datos.correo
      : '';

    const html = `
      <div style="font-family:system-ui,sans-serif;color:#2c2a5e">
        <h2 style="color:#4a3f88">Nueva postulación de voluntariado</h2>
        <table style="border-collapse:collapse">
          ${filas
            .map(
              ([etiqueta, valor]) =>
                `<tr>
                   <td style="padding:6px 12px 6px 0;font-weight:600">${escapar(etiqueta)}</td>
                   <td style="padding:6px 0">${escapar(valor)}</td>
                 </tr>`,
            )
            .join('')}
        </table>
        <p style="margin-top:16px">
          ${
            telefono
              ? `<a href="https://wa.me/51${escapar(telefono)}">Escribir por WhatsApp</a>`
              : ''
          }
          ${telefono && correoValido ? ' · ' : ''}
          ${
            correoValido
              ? `<a href="mailto:${escapar(correoValido)}">Responder por correo</a>`
              : ''
          }
        </p>
        <p style="color:#6b6b8a;font-size:13px">
          También puedes verla en el panel administrativo del sitio.
        </p>
      </div>`;

    try {
      await this.transporte.sendMail({
        from: `"Socializando Junto A Ti" <${this.remitente}>`,
        to: this.destinatario,
        replyTo: correoValido || undefined,
        // Sin saltos de línea en el asunto (evita inyección de cabeceras).
        subject: `Nueva postulación: ${datos.nombre} (${datos.area})`.replace(
          /[\r\n]+/g,
          ' ',
        ),
        html,
      });
      this.logger.log(`Postulación notificada a ${this.destinatario}`);
    } catch (error) {
      this.logger.error(
        `No se pudo notificar la postulación: ${
          error instanceof Error ? error.message : 'error desconocido'
        }`,
      );
    }
  }
}
