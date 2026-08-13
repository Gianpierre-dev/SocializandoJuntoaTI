import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "./api";
import SelectorImagen from "./selector-imagen";
import {
  AreaTextoAuto,
  ModalConfirmacion,
  SkeletonTabla,
  mostrarToast,
} from "./ui";
import type { CampoRecurso, RecursoConfig } from "./recursos";

type Registro = Record<string, unknown> & { id: string };

const claseInput =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-content focus:outline-none focus:ring-2 focus:ring-brand";

const claseBotonPrimario =
  "rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-50";

const claseBotonSecundario =
  "rounded-lg border border-line px-4 py-2 text-sm font-medium text-content hover:bg-subtle";

// Colores reales de cada variante para las muestras en la tabla.
const COLORES_VARIANTE: Record<string, string> = {
  BRAND: "#4a3f88",
  GOLD: "#c39a2b",
  ROSE: "#d488b1",
  GREEN: "#5e8a74",
  DEEP: "#2c2a5e",
  SUBTLE: "#e6e2f0",
};

const BADGES_ESTADO: Record<string, string> = {
  ACTIVA: "bg-green/15 text-green",
  EN_DESARROLLO: "bg-gold/15 text-gold",
  PRESENCIAL: "bg-brand/10 text-accent",
  ONLINE: "bg-green/15 text-green",
  MIXTO: "bg-rose/20 text-brand-deep",
};

/** Celda con vida: badges, muestras de color y estados en vez de texto plano. */
function CeldaValor({
  campo,
  registro,
}: {
  campo: CampoRecurso;
  registro: Record<string, unknown>;
}) {
  const valor = registro[campo.nombre];

  if (campo.tipo === "booleano") {
    return valor ? (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green/15 px-2.5 py-1 text-xs font-semibold text-green">
        <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden="true" />
        Visible
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-content/10 px-2.5 py-1 text-xs font-semibold text-content/50">
        <span
          className="h-1.5 w-1.5 rounded-full bg-content/40"
          aria-hidden="true"
        />
        Oculto
      </span>
    );
  }

  if (campo.tipo === "select") {
    const etiqueta =
      campo.opciones?.find((o) => o.valor === valor)?.etiqueta ??
      String(valor ?? "");
    const colorVariante = COLORES_VARIANTE[String(valor)];
    if (campo.nombre === "variante" && colorVariante) {
      return (
        <span className="inline-flex items-center gap-2 text-content/80">
          <span
            className="h-4 w-4 rounded-full border border-line"
            style={{ backgroundColor: colorVariante }}
            aria-hidden="true"
          />
          {etiqueta}
        </span>
      );
    }
    const clases = BADGES_ESTADO[String(valor)];
    if (clases) {
      return (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${clases}`}
        >
          {etiqueta}
        </span>
      );
    }
    return <>{etiqueta}</>;
  }

  return <>{String(valor ?? "")}</>;
}

function CampoImagen({
  campo,
  valor,
  onCambio,
}: {
  campo: CampoRecurso;
  valor: string;
  onCambio: (url: string) => void;
}) {
  if (!campo.carpeta) return null;
  return (
    <SelectorImagen
      carpeta={campo.carpeta}
      valor={valor}
      onCambio={onCambio}
      sugerencia={campo.etiqueta.match(/\d+×\d+/)?.[0]}
    />
  );
}

function Formulario({
  recurso,
  registro,
  onGuardado,
  onCancelar,
}: {
  recurso: RecursoConfig;
  registro: Registro | null;
  onGuardado: () => void;
  onCancelar: () => void;
}) {
  const [valores, setValores] = useState<Record<string, unknown>>(() => {
    const iniciales: Record<string, unknown> = {};
    for (const campo of recurso.campos) {
      const actual = registro?.[campo.nombre];
      if (campo.tipo === "booleano") iniciales[campo.nombre] = actual ?? true;
      else if (campo.tipo === "numero") iniciales[campo.nombre] = actual ?? 1;
      else if (campo.tipo === "select")
        iniciales[campo.nombre] = actual ?? campo.opciones?.[0]?.valor ?? "";
      else iniciales[campo.nombre] = actual ?? "";
    }
    return iniciales;
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [erroresCampos, setErroresCampos] = useState<Record<string, string>>(
    {},
  );
  const cuerpoRef = useRef<HTMLDivElement>(null);

  // Foco al primer campo al abrir; Escape cierra.
  useEffect(() => {
    cuerpoRef.current
      ?.querySelector<HTMLElement>("input, select, textarea")
      ?.focus();
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") onCancelar();
    };
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [onCancelar]);

  const fijar = (nombre: string, valor: unknown) =>
    setValores((prev) => ({ ...prev, [nombre]: valor }));

  const validar = (): boolean => {
    const errores: Record<string, string> = {};
    for (const campo of recurso.campos) {
      const valor = String(valores[campo.nombre] ?? "").trim();
      const esTexto =
        campo.tipo === "texto" ||
        campo.tipo === "textarea" ||
        campo.tipo === "select";

      if (esTexto && !campo.opcional && !valor) {
        errores[campo.nombre] = "Este campo es obligatorio.";
      } else if (esTexto && valor && campo.maximo && valor.length > campo.maximo) {
        errores[campo.nombre] = `Máximo ${campo.maximo} caracteres (llevas ${valor.length}).`;
      } else if (esTexto && valor && campo.patron && !campo.patron.test(valor)) {
        errores[campo.nombre] = campo.mensajePatron ?? "Formato no válido.";
      } else if (campo.tipo === "numero") {
        const numero = Number(valores[campo.nombre]);
        if (!Number.isInteger(numero) || numero < 0) {
          errores[campo.nombre] = "Debe ser un número entero positivo.";
        }
      }
    }
    setErroresCampos(errores);

    const primerError = Object.keys(errores)[0];
    if (primerError) {
      cuerpoRef.current
        ?.querySelector<HTMLElement>(`#campo-${primerError}`)
        ?.focus();
      return false;
    }
    return true;
  };

  const guardar = async () => {
    setError("");
    if (!validar()) return;
    setGuardando(true);
    try {
      const cuerpo: Record<string, unknown> = {};
      for (const campo of recurso.campos) {
        const valor = valores[campo.nombre];
        if (campo.tipo === "numero") cuerpo[campo.nombre] = Number(valor);
        else if (campo.opcional && valor === "")
          cuerpo[campo.nombre] = undefined;
        else cuerpo[campo.nombre] = valor;
      }
      if (registro) {
        await api(`${recurso.endpoint}/${registro.id}`, {
          method: "PATCH",
          body: JSON.stringify(cuerpo),
        });
      } else {
        await api(recurso.endpoint, {
          method: "POST",
          body: JSON.stringify(cuerpo),
        });
      }
      mostrarToast(registro ? "Cambios guardados" : "Registro creado");
      onGuardado();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={registro ? "Editar registro" : "Nuevo registro"}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onCancelar();
      }}
    >
      <div className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl">
        {/* Header fijo del modal */}
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-content">
            {registro ? "Editar" : "Nuevo"} · {recurso.etiqueta}
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-content/60 hover:bg-subtle hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            onClick={onCancelar}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </header>

        {/* Cuerpo scrolleable */}
        <div
          ref={cuerpoRef}
          className="flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6"
        >
          {recurso.campos.map((campo) => (
            <div key={campo.nombre}>
              <label className="mb-1 block text-sm font-medium text-content">
                {campo.etiqueta}
                {campo.opcional && (
                  <span className="text-content/50"> (opcional)</span>
                )}
              </label>

              {campo.tipo === "texto" && (
                <input
                  id={`campo-${campo.nombre}`}
                  className={claseInput}
                  aria-invalid={erroresCampos[campo.nombre] ? true : undefined}
                  value={String(valores[campo.nombre] ?? "")}
                  onChange={(e) => fijar(campo.nombre, e.target.value)}
                />
              )}
              {campo.tipo === "textarea" && (
                <AreaTextoAuto
                  id={`campo-${campo.nombre}`}
                  className={claseInput}
                  rows={3}
                  aria-invalid={erroresCampos[campo.nombre] ? true : undefined}
                  value={String(valores[campo.nombre] ?? "")}
                  onChange={(e) => fijar(campo.nombre, e.target.value)}
                />
              )}
              {campo.tipo === "numero" && (
                <input
                  id={`campo-${campo.nombre}`}
                  type="number"
                  className={claseInput}
                  aria-invalid={erroresCampos[campo.nombre] ? true : undefined}
                  value={Number(valores[campo.nombre] ?? 0)}
                  onChange={(e) => fijar(campo.nombre, e.target.value)}
                />
              )}
              {campo.tipo === "select" && (
                <select
                  id={`campo-${campo.nombre}`}
                  className={claseInput}
                  aria-invalid={erroresCampos[campo.nombre] ? true : undefined}
                  value={String(valores[campo.nombre] ?? "")}
                  onChange={(e) => fijar(campo.nombre, e.target.value)}
                >
                  {campo.opciones?.map((opcion) => (
                    <option key={opcion.valor} value={opcion.valor}>
                      {opcion.etiqueta}
                    </option>
                  ))}
                </select>
              )}
              {campo.tipo === "booleano" && (
                <label className="flex items-center gap-2 text-sm text-content">
                  <input
                    type="checkbox"
                    checked={Boolean(valores[campo.nombre])}
                    onChange={(e) => fijar(campo.nombre, e.target.checked)}
                  />
                  Visible en el sitio
                </label>
              )}
              {campo.tipo === "imagen" && (
                <CampoImagen
                  campo={campo}
                  valor={String(valores[campo.nombre] ?? "")}
                  onCambio={(url) => fijar(campo.nombre, url)}
                />
              )}
              {erroresCampos[campo.nombre] && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {erroresCampos[campo.nombre]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer fijo del modal con las acciones */}
        <footer className="shrink-0 border-t border-line px-5 py-4 sm:px-6">
          {error && (
            <p role="alert" className="mb-3 text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className={claseBotonSecundario}
              onClick={onCancelar}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={claseBotonPrimario}
              onClick={() => void guardar()}
              disabled={guardando}
            >
              {guardando ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function CrudRecurso({ recurso }: { recurso: RecursoConfig }) {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState<Registro | null>(null);
  const [creando, setCreando] = useState(false);
  const [eliminando, setEliminando] = useState<Registro | null>(null);

  const columnas = recurso.campos.filter((campo) => campo.enTabla);
  const campoImagen = recurso.campos.find((campo) => campo.tipo === "imagen");
  const campoTitulo = columnas[0]?.nombre ?? "id";
  const miniaturaRedonda = recurso.clave === "equipo";

  const cargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setRegistros(await api<Registro[]>(recurso.endpoint));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar");
    } finally {
      setCargando(false);
    }
  }, [recurso.endpoint]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const eliminar = async (registro: Registro) => {
    try {
      await api(`${recurso.endpoint}/${registro.id}`, { method: "DELETE" });
      mostrarToast("Registro eliminado");
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar");
    }
  };

  const tieneOrden = recurso.campos.some((campo) => campo.nombre === "orden");

  /** Intercambia el orden con el registro vecino (flechas de la tabla). */
  const mover = async (indice: number, direccion: -1 | 1) => {
    const actual = registros[indice];
    const vecino = registros[indice + direccion];
    if (!actual || !vecino) return;
    try {
      await Promise.all([
        api(`${recurso.endpoint}/${actual.id}`, {
          method: "PATCH",
          body: JSON.stringify({ orden: Number(vecino.orden) }),
        }),
        api(`${recurso.endpoint}/${vecino.id}`, {
          method: "PATCH",
          body: JSON.stringify({ orden: Number(actual.orden) }),
        }),
      ]);
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al reordenar");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-content">
            {recurso.etiqueta}
          </h1>
          {!cargando && (
            <p className="mt-0.5 text-sm text-content/50">
              {registros.length}{" "}
              {registros.length === 1 ? "registro" : "registros"}
            </p>
          )}
        </div>
        <button
          type="button"
          className={claseBotonPrimario}
          onClick={() => setCreando(true)}
        >
          + Agregar
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {cargando ? (
        <SkeletonTabla />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-subtle/60">
              <tr>
                {campoImagen && (
                  <th className="w-20 px-4 py-3" aria-label="Imagen" />
                )}
                {columnas.map((campo) => (
                  <th
                    key={campo.nombre}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-content/50"
                  >
                    {campo.etiqueta}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {registros.map((registro, indiceFila) => {
                const urlImagen = campoImagen
                  ? String(registro[campoImagen.nombre] ?? "")
                  : "";
                const inicial = String(registro[campoTitulo] ?? "?")
                  .trim()
                  .charAt(0)
                  .toUpperCase();
                return (
                  <tr
                    key={registro.id}
                    className="border-b border-line transition-colors last:border-0 hover:bg-subtle/50"
                  >
                    {campoImagen && (
                      <td className="px-4 py-2.5">
                        {urlImagen ? (
                          <img
                            src={urlImagen}
                            alt=""
                            loading="lazy"
                            className={`h-11 w-14 border border-line object-cover ${
                              miniaturaRedonda
                                ? "h-11 w-11 rounded-full"
                                : "rounded-lg"
                            }`}
                          />
                        ) : (
                          <span
                            className={`flex h-11 w-14 items-center justify-center bg-brand/10 text-base font-bold text-accent ${
                              miniaturaRedonda
                                ? "h-11 w-11 rounded-full"
                                : "rounded-lg"
                            }`}
                            aria-hidden="true"
                          >
                            {inicial}
                          </span>
                        )}
                      </td>
                    )}
                    {columnas.map((campo, indice) => (
                      <td
                        key={campo.nombre}
                        className={`px-4 py-2.5 ${
                          indice === 0
                            ? "font-semibold text-content"
                            : "text-content/70"
                        }`}
                      >
                        <CeldaValor campo={campo} registro={registro} />
                      </td>
                    ))}
                    <td className="px-4 py-2.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        {tieneOrden && (
                          <span className="mr-1 inline-flex flex-col">
                            <button
                              type="button"
                              aria-label="Subir en el orden"
                              disabled={indiceFila === 0}
                              className="rounded px-1.5 text-content/40 hover:bg-subtle hover:text-accent disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                              onClick={() => void mover(indiceFila, -1)}
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              aria-label="Bajar en el orden"
                              disabled={indiceFila === registros.length - 1}
                              className="rounded px-1.5 text-content/40 hover:bg-subtle hover:text-accent disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                              onClick={() => void mover(indiceFila, 1)}
                            >
                              ▼
                            </button>
                          </span>
                        )}
                        <button
                          type="button"
                          className="rounded-lg bg-subtle px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          onClick={() => setEditando(registro)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                          onClick={() => setEliminando(registro)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {registros.length === 0 && (
                <tr>
                  <td
                    colSpan={columnas.length + (campoImagen ? 2 : 1)}
                    className="px-4 py-12 text-center"
                  >
                    <p className="text-3xl" aria-hidden="true">
                      🗂️
                    </p>
                    <p className="mt-2 font-medium text-content/60">
                      Sin registros todavía
                    </p>
                    <p className="mt-1 text-sm text-content/40">
                      Usa el botón «+ Agregar» para crear el primero.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {(creando || editando) && (
        <Formulario
          recurso={recurso}
          registro={editando}
          onGuardado={() => {
            setCreando(false);
            setEditando(null);
            void cargar();
          }}
          onCancelar={() => {
            setCreando(false);
            setEditando(null);
          }}
        />
      )}

      {eliminando && (
        <ModalConfirmacion
          titulo="Eliminar registro"
          mensaje={`Se eliminará "${String(
            eliminando[campoTitulo] ?? eliminando.id,
          )}" de forma permanente. Esta acción no se puede deshacer.`}
          onConfirmar={() => {
            const registro = eliminando;
            setEliminando(null);
            void eliminar(registro);
          }}
          onCancelar={() => setEliminando(null)}
        />
      )}
    </div>
  );
}
