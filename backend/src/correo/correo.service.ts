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
  private readonly claveResend: string | null;
  private readonly destinatario: string;
  private readonly remitente: string;

  constructor(private readonly config: ConfigService) {
    const usuario = this.config.get<string>('SMTP_USUARIO');
    const contrasena = this.config.get<string>('SMTP_CONTRASENA');
    this.claveResend = this.config.get<string>('RESEND_API_KEY') ?? null;

    this.destinatario =
      this.config.get<string>('CORREO_NOTIFICACIONES') ??
      usuario ??
      'contacto.sojat@gmail.com';
    // Resend permite este remitente sin dominio propio verificado.
    this.remitente =
      this.config.get<string>('CORREO_REMITENTE') ??
      (this.claveResend ? 'onboarding@resend.dev' : (usuario ?? ''));

    if (this.claveResend) {
      this.transporte = null;
      this.logger.log('Notificaciones por correo activas (Resend)');
      return;
    }

    if (!usuario || !contrasena) {
      this.transporte = null;
      this.logger.warn(
        'Correo sin configurar: las postulaciones se guardan pero no se notifican.',
      );
      return;
    }

    this.transporte = createTransport({
      host: this.config.get<string>('SMTP_HOST') ?? 'smtp.gmail.com',
      port: Number(this.config.get<string>('SMTP_PUERTO') ?? 465),
      secure: true,
      auth: { user: usuario, pass: contrasena },
    });
    this.logger.log('Notificaciones por correo activas (SMTP)');
  }

  get activo(): boolean {
    return this.transporte !== null || this.claveResend !== null;
  }

  /** Envía por Resend (API HTTP) o por SMTP, según lo que esté configurado. */
  private async enviar(
    asunto: string,
    html: string,
    responderA?: string,
  ): Promise<void> {
    if (this.claveResend) {
      const respuesta = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.claveResend}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Socializando Junto A Ti <${this.remitente}>`,
          to: [this.destinatario],
          subject: asunto,
          html,
          ...(responderA ? { reply_to: responderA } : {}),
        }),
      });
      if (!respuesta.ok) {
        throw new Error(
          `Resend respondió ${respuesta.status}: ${await respuesta.text()}`,
        );
      }
      return;
    }

    if (!this.transporte) return;
    await this.transporte.sendMail({
      from: `"Socializando Junto A Ti" <${this.remitente}>`,
      to: this.destinatario,
      replyTo: responderA,
      subject: asunto,
      html,
    });
  }

  /** Envía un correo de prueba para verificar la configuración. */
  async enviarPrueba(): Promise<{ enviado: boolean; detalle: string }> {
    if (!this.activo) {
      return {
        enviado: false,
        detalle:
          'No hay proveedor configurado (falta RESEND_API_KEY o credenciales SMTP).',
      };
    }
    try {
      await this.enviar(
        'Prueba de notificaciones · Socializando Junto A Ti',
        `<div style="font-family:system-ui,sans-serif;color:#2c2a5e">
           <h2 style="color:#4a3f88">Las notificaciones funcionan</h2>
           <p>Si estás leyendo esto, cada nueva postulación de voluntariado
              llegará a este buzón automáticamente.</p>
         </div>`,
      );
      return {
        enviado: true,
        detalle: `Correo enviado a ${this.destinatario}`,
      };
    } catch (error) {
      return {
        enviado: false,
        detalle: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /** Notifica una postulación nueva. Nunca lanza: no debe romper el registro. */
  async notificarPostulacion(datos: DatosPostulacion): Promise<void> {
    if (!this.activo) return;

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
      // Sin saltos de línea en el asunto (evita inyección de cabeceras).
      const asunto =
        `Nueva postulación: ${datos.nombre} (${datos.area})`.replace(
          /[\r\n]+/g,
          ' ',
        );
      await this.enviar(asunto, html, correoValido || undefined);
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
