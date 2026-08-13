// Cliente de la API del backend para el panel administrativo.

export const API_URL =
  import.meta.env.PUBLIC_API_URL ??
  "https://backend-production-98ca.up.railway.app";

const CLAVE_TOKEN = "sojat_token";

export const obtenerToken = (): string | null =>
  localStorage.getItem(CLAVE_TOKEN);

export const guardarToken = (token: string): void =>
  localStorage.setItem(CLAVE_TOKEN, token);

export const cerrarSesion = (): void => localStorage.removeItem(CLAVE_TOKEN);

export class ErrorApi extends Error {
  constructor(
    public readonly estado: number,
    mensaje: string,
  ) {
    super(mensaje);
  }
}

export async function api<T>(
  ruta: string,
  opciones: RequestInit = {},
): Promise<T> {
  const token = obtenerToken();
  const respuesta = await fetch(`${API_URL}/api${ruta}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opciones.headers ?? {}),
    },
  });

  if (respuesta.status === 401) {
    cerrarSesion();
    window.location.reload();
    throw new ErrorApi(401, "Sesión expirada");
  }

  if (!respuesta.ok) {
    const cuerpo = (await respuesta.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const mensaje = Array.isArray(cuerpo?.message)
      ? cuerpo.message.join(", ")
      : (cuerpo?.message ?? `Error ${respuesta.status}`);
    throw new ErrorApi(respuesta.status, mensaje);
  }

  return respuesta.json() as Promise<T>;
}

export async function iniciarSesion(correo: string, contrasena: string) {
  const datos = await api<{ tokenAcceso: string }>("/auth/iniciar-sesion", {
    method: "POST",
    body: JSON.stringify({ correo, contrasena }),
  });
  guardarToken(datos.tokenAcceso);
}

const TIPOS_IMAGEN: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

const PESO_MAXIMO_MB = 5;

/** Sube una imagen a Wasabi vía presigned URL y devuelve la URL pública. */
export async function subirImagen(
  carpeta: string,
  archivo: File,
): Promise<string> {
  const extension = archivo.name.split(".").pop()?.toLowerCase() ?? "";
  const tipo = TIPOS_IMAGEN[extension];
  if (!tipo) {
    throw new Error("Formato no permitido. Usa png, jpg, jpeg o webp.");
  }
  if (archivo.size > PESO_MAXIMO_MB * 1024 * 1024) {
    const pesoMb = (archivo.size / 1024 / 1024).toFixed(1);
    throw new Error(
      `La imagen pesa ${pesoMb} MB y el máximo es ${PESO_MAXIMO_MB} MB. Comprímela e inténtalo de nuevo.`,
    );
  }

  const { urlSubida, urlPublica } = await api<{
    urlSubida: string;
    urlPublica: string;
  }>("/almacenamiento/url-subida", {
    method: "POST",
    body: JSON.stringify({ carpeta, extension, peso: archivo.size }),
  });

  const subida = await fetch(urlSubida, {
    method: "PUT",
    headers: { "Content-Type": tipo },
    body: archivo,
  });
  if (!subida.ok) {
    throw new Error("La subida de la imagen falló. Intenta de nuevo.");
  }

  return urlPublica;
}
