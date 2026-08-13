import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

interface Postulacion {
  id: string;
  nombre: string;
  edad: number;
  correo: string;
  celular: string;
  area: string;
  disponibilidad: string;
  mensaje: string | null;
  creadoEn: string;
}

export default function ListaPostulaciones() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setPostulaciones(await api<Postulacion[]>("/postulaciones"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const eliminar = async (postulacion: Postulacion) => {
    if (
      !window.confirm(
        `¿Eliminar la postulación de "${postulacion.nombre}"? Esta acción no se deshace.`,
      )
    )
      return;
    try {
      await api(`/postulaciones/${postulacion.id}`, { method: "DELETE" });
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-content">
        Postulaciones de voluntariado
      </h1>
      <p className="mt-1 text-sm text-content/60">
        Llegan desde el formulario del sitio. Contacta a cada persona por
        WhatsApp o correo.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {cargando ? (
        <p className="mt-6 text-sm text-content/60">Cargando…</p>
      ) : postulaciones.length === 0 ? (
        <p className="mt-8 rounded-xl border border-line bg-white p-8 text-center text-content/50">
          Todavía no hay postulaciones.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {postulaciones.map((p) => (
            <article
              key={p.id}
              className="rounded-xl border border-line bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-content">
                    {p.nombre}{" "}
                    <span className="font-normal text-content/50">
                      · {p.edad} años
                    </span>
                  </p>
                  <p className="mt-0.5 text-sm text-content/70">
                    {p.correo} · {p.celular}
                  </p>
                </div>
                <p className="text-xs text-content/50">
                  {new Date(p.creadoEn).toLocaleString("es-PE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <p className="mt-3 text-sm text-content">
                <span className="rounded-full bg-subtle px-2.5 py-1 font-medium">
                  {p.area}
                </span>{" "}
                <span className="rounded-full bg-subtle px-2.5 py-1 font-medium">
                  {p.disponibilidad}
                </span>
              </p>
              {p.mensaje && (
                <p className="mt-3 rounded-lg bg-subtle px-3 py-2 text-sm leading-relaxed text-content/80">
                  {p.mensaje}
                </p>
              )}
              <div className="mt-3 text-right">
                <button
                  type="button"
                  className="text-sm font-medium text-red-600 hover:underline"
                  onClick={() => void eliminar(p)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
