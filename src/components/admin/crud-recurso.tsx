import { useCallback, useEffect, useState } from "react";
import { api, subirImagen } from "./api";
import type { CampoRecurso, RecursoConfig } from "./recursos";

type Registro = Record<string, unknown> & { id: string };

const claseInput =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-content focus:outline-none focus:ring-2 focus:ring-brand";

const claseBotonPrimario =
  "rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-50";

const claseBotonSecundario =
  "rounded-lg border border-line px-4 py-2 text-sm font-medium text-content hover:bg-subtle";

function CampoImagen({
  campo,
  valor,
  onCambio,
}: {
  campo: CampoRecurso;
  valor: string;
  onCambio: (url: string) => void;
}) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  const manejarArchivo = async (archivo: File | undefined) => {
    if (!archivo || !campo.carpeta) return;
    setError("");
    setSubiendo(true);
    try {
      onCambio(await subirImagen(campo.carpeta, archivo));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div>
      {valor ? (
        <div className="mb-2 flex items-center gap-3">
          <img
            src={valor}
            alt=""
            className="h-16 w-24 rounded-lg border border-line object-cover"
          />
          <button
            type="button"
            className="text-sm font-medium text-red-600 hover:underline"
            onClick={() => onCambio("")}
          >
            Quitar imagen
          </button>
        </div>
      ) : null}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="block text-sm text-content/70"
        onChange={(e) => void manejarArchivo(e.target.files?.[0])}
        disabled={subiendo}
      />
      {subiendo && (
        <p className="mt-1 text-xs text-content/60">Subiendo imagen…</p>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
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

  const fijar = (nombre: string, valor: unknown) =>
    setValores((prev) => ({ ...prev, [nombre]: valor }));

  const guardar = async () => {
    setError("");
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
      onGuardado();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={registro ? "Editar registro" : "Nuevo registro"}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-content">
          {registro ? "Editar" : "Nuevo"} · {recurso.etiqueta}
        </h2>

        <div className="mt-4 space-y-4">
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
                  className={claseInput}
                  value={String(valores[campo.nombre] ?? "")}
                  onChange={(e) => fijar(campo.nombre, e.target.value)}
                />
              )}
              {campo.tipo === "textarea" && (
                <textarea
                  className={claseInput}
                  rows={3}
                  value={String(valores[campo.nombre] ?? "")}
                  onChange={(e) => fijar(campo.nombre, e.target.value)}
                />
              )}
              {campo.tipo === "numero" && (
                <input
                  type="number"
                  className={claseInput}
                  value={Number(valores[campo.nombre] ?? 0)}
                  onChange={(e) => fijar(campo.nombre, e.target.value)}
                />
              )}
              {campo.tipo === "select" && (
                <select
                  className={claseInput}
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
            </div>
          ))}
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
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

  const columnas = recurso.campos.filter((campo) => campo.enTabla);

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
    const etiqueta = String(
      registro[columnas[0]?.nombre ?? "id"] ?? registro.id,
    );
    if (!window.confirm(`¿Eliminar "${etiqueta}"? Esta acción no se deshace.`))
      return;
    try {
      await api(`${recurso.endpoint}/${registro.id}`, { method: "DELETE" });
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-content">{recurso.etiqueta}</h1>
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
        <p className="mt-6 text-sm text-content/60">Cargando…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-subtle text-content/70">
              <tr>
                {columnas.map((campo) => (
                  <th key={campo.nombre} className="px-4 py-3 font-semibold">
                    {campo.etiqueta}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => (
                <tr
                  key={registro.id}
                  className="border-b border-line last:border-0"
                >
                  {columnas.map((campo) => (
                    <td key={campo.nombre} className="px-4 py-3 text-content">
                      {campo.tipo === "booleano" ? (
                        registro[campo.nombre] ? (
                          "Sí"
                        ) : (
                          <span className="text-content/50">No</span>
                        )
                      ) : (
                        String(registro[campo.nombre] ?? "")
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="mr-3 font-medium text-accent hover:underline"
                      onClick={() => setEditando(registro)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="font-medium text-red-600 hover:underline"
                      onClick={() => void eliminar(registro)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {registros.length === 0 && (
                <tr>
                  <td
                    colSpan={columnas.length + 1}
                    className="px-4 py-8 text-center text-content/50"
                  >
                    Sin registros todavía.
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
    </div>
  );
}
