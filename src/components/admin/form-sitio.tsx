import { useEffect, useState } from "react";
import { api } from "./api";

interface AreaTrabajo {
  titulo: string;
  descripcion: string;
}

interface Configuracion {
  nombre: string;
  eslogan: string;
  fechaFundacion: string;
  publicoObjetivo: string;
  mision: string;
  vision: string;
  objetivo: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;
  linktreeUrl: string;
  whatsappUrl: string;
  sedes: string[];
  plataformas: string[];
  requisitos: string[];
  beneficios: string[];
  areas: AreaTrabajo[];
}

interface ConfiguracionApi {
  nombre: string;
  eslogan: string;
  fechaFundacion: string;
  publicoObjetivo: string;
  mision: string;
  vision: string;
  objetivo: string;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  facebookUrl: string | null;
  linktreeUrl: string | null;
  whatsappUrl: string | null;
  sedes: { nombre: string }[];
  plataformas: { nombre: string }[];
  requisitos: { texto: string }[];
  beneficios: { texto: string }[];
  areas: { titulo: string; descripcion: string }[];
}

const claseInput =
  "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-content focus:outline-none focus:ring-2 focus:ring-brand";

function Campo({
  etiqueta,
  valor,
  onCambio,
  multilinea,
}: {
  etiqueta: string;
  valor: string;
  onCambio: (v: string) => void;
  multilinea?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-content">
      {etiqueta}
      {multilinea ? (
        <textarea
          className={claseInput}
          rows={3}
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
        />
      ) : (
        <input
          className={claseInput}
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
        />
      )}
    </label>
  );
}

function ListaTextos({
  etiqueta,
  elementos,
  onCambio,
}: {
  etiqueta: string;
  elementos: string[];
  onCambio: (elementos: string[]) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-content">{etiqueta}</p>
        <button
          type="button"
          className="text-sm font-medium text-accent hover:underline"
          onClick={() => onCambio([...elementos, ""])}
        >
          + Agregar
        </button>
      </div>
      <div className="space-y-2">
        {elementos.map((elemento, indice) => (
          <div key={indice} className="flex gap-2">
            <input
              className={`${claseInput} mt-0`}
              value={elemento}
              aria-label={`${etiqueta} ${indice + 1}`}
              onChange={(e) =>
                onCambio(
                  elementos.map((el, i) => (i === indice ? e.target.value : el)),
                )
              }
            />
            <button
              type="button"
              className="shrink-0 text-sm font-medium text-red-600 hover:underline"
              aria-label={`Eliminar ${etiqueta} ${indice + 1}`}
              onClick={() => onCambio(elementos.filter((_, i) => i !== indice))}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FormSitio() {
  const [datos, setDatos] = useState<Configuracion | null>(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    api<ConfiguracionApi | null>("/configuracion")
      .then((r) => {
        if (!r) throw new Error("Sin configuración");
        setDatos({
          nombre: r.nombre,
          eslogan: r.eslogan,
          fechaFundacion: r.fechaFundacion,
          publicoObjetivo: r.publicoObjetivo,
          mision: r.mision,
          vision: r.vision,
          objetivo: r.objetivo,
          instagramUrl: r.instagramUrl ?? "",
          tiktokUrl: r.tiktokUrl ?? "",
          facebookUrl: r.facebookUrl ?? "",
          linktreeUrl: r.linktreeUrl ?? "",
          whatsappUrl: r.whatsappUrl ?? "",
          sedes: r.sedes.map((s) => s.nombre),
          plataformas: r.plataformas.map((p) => p.nombre),
          requisitos: r.requisitos.map((x) => x.texto),
          beneficios: r.beneficios.map((x) => x.texto),
          areas: r.areas.map((a) => ({
            titulo: a.titulo,
            descripcion: a.descripcion,
          })),
        });
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Error al cargar"),
      );
  }, []);

  if (!datos) {
    return <p className="text-sm text-content/60">{error || "Cargando…"}</p>;
  }

  const fijar = (parcial: Partial<Configuracion>) =>
    setDatos((prev) => (prev ? { ...prev, ...parcial } : prev));

  const guardar = async () => {
    setError("");
    setMensaje("");
    setGuardando(true);
    try {
      const conOrden = (textos: string[]) =>
        textos
          .filter((texto) => texto.trim())
          .map((texto, indice) => ({ texto: texto.trim(), orden: indice + 1 }));

      await api("/configuracion", {
        method: "PUT",
        body: JSON.stringify({
          nombre: datos.nombre,
          eslogan: datos.eslogan,
          fechaFundacion: datos.fechaFundacion,
          publicoObjetivo: datos.publicoObjetivo,
          mision: datos.mision,
          vision: datos.vision,
          objetivo: datos.objetivo,
          instagramUrl: datos.instagramUrl || undefined,
          tiktokUrl: datos.tiktokUrl || undefined,
          facebookUrl: datos.facebookUrl || undefined,
          linktreeUrl: datos.linktreeUrl || undefined,
          whatsappUrl: datos.whatsappUrl || undefined,
          sedes: conOrden(datos.sedes),
          plataformas: conOrden(datos.plataformas),
          requisitos: conOrden(datos.requisitos),
          beneficios: conOrden(datos.beneficios),
          areas: datos.areas
            .filter((a) => a.titulo.trim())
            .map((a, indice) => ({ ...a, orden: indice + 1 })),
        }),
      });
      setMensaje("Cambios guardados. El sitio ya los muestra.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-content">Datos generales</h1>
      <p className="mt-1 text-sm text-content/60">
        Identidad, misión y datos institucionales que se muestran en todo el
        sitio.
      </p>

      <div className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo
            etiqueta="Nombre de la organización"
            valor={datos.nombre}
            onCambio={(v) => fijar({ nombre: v })}
          />
          <Campo
            etiqueta="Eslogan"
            valor={datos.eslogan}
            onCambio={(v) => fijar({ eslogan: v })}
          />
          <Campo
            etiqueta="Fecha de fundación"
            valor={datos.fechaFundacion}
            onCambio={(v) => fijar({ fechaFundacion: v })}
          />
          <Campo
            etiqueta="Público objetivo"
            valor={datos.publicoObjetivo}
            onCambio={(v) => fijar({ publicoObjetivo: v })}
          />
        </div>

        <Campo
          etiqueta="Misión"
          valor={datos.mision}
          onCambio={(v) => fijar({ mision: v })}
          multilinea
        />
        <Campo
          etiqueta="Visión"
          valor={datos.vision}
          onCambio={(v) => fijar({ vision: v })}
          multilinea
        />
        <Campo
          etiqueta="Objetivo"
          valor={datos.objetivo}
          onCambio={(v) => fijar({ objetivo: v })}
          multilinea
        />

        <div className="rounded-xl border border-line bg-white p-4">
          <p className="mb-3 font-semibold text-content">Redes sociales</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo
              etiqueta="Instagram (URL)"
              valor={datos.instagramUrl}
              onCambio={(v) => fijar({ instagramUrl: v })}
            />
            <Campo
              etiqueta="TikTok (URL)"
              valor={datos.tiktokUrl}
              onCambio={(v) => fijar({ tiktokUrl: v })}
            />
            <Campo
              etiqueta="Facebook (URL)"
              valor={datos.facebookUrl}
              onCambio={(v) => fijar({ facebookUrl: v })}
            />
            <Campo
              etiqueta="Linktree (URL)"
              valor={datos.linktreeUrl}
              onCambio={(v) => fijar({ linktreeUrl: v })}
            />
            <Campo
              etiqueta="WhatsApp (URL)"
              valor={datos.whatsappUrl}
              onCambio={(v) => fijar({ whatsappUrl: v })}
            />
          </div>
        </div>

        <ListaTextos
          etiqueta="Sedes presenciales"
          elementos={datos.sedes}
          onCambio={(sedes) => fijar({ sedes })}
        />
        <ListaTextos
          etiqueta="Plataformas en línea"
          elementos={datos.plataformas}
          onCambio={(plataformas) => fijar({ plataformas })}
        />
        <ListaTextos
          etiqueta="Requisitos de voluntariado"
          elementos={datos.requisitos}
          onCambio={(requisitos) => fijar({ requisitos })}
        />
        <ListaTextos
          etiqueta="Beneficios de voluntariado"
          elementos={datos.beneficios}
          onCambio={(beneficios) => fijar({ beneficios })}
        />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-content">
              Áreas de trabajo
            </p>
            <button
              type="button"
              className="text-sm font-medium text-accent hover:underline"
              onClick={() =>
                fijar({
                  areas: [...datos.areas, { titulo: "", descripcion: "" }],
                })
              }
            >
              + Agregar área
            </button>
          </div>
          <div className="space-y-3">
            {datos.areas.map((area, indice) => (
              <div
                key={indice}
                className="space-y-2 rounded-xl border border-line bg-white p-4"
              >
                <input
                  className={`${claseInput} mt-0`}
                  placeholder="Nombre del área"
                  value={area.titulo}
                  onChange={(e) =>
                    fijar({
                      areas: datos.areas.map((a, i) =>
                        i === indice ? { ...a, titulo: e.target.value } : a,
                      ),
                    })
                  }
                />
                <textarea
                  className={`${claseInput} mt-0`}
                  rows={2}
                  placeholder="Descripción del área"
                  value={area.descripcion}
                  onChange={(e) =>
                    fijar({
                      areas: datos.areas.map((a, i) =>
                        i === indice
                          ? { ...a, descripcion: e.target.value }
                          : a,
                      ),
                    })
                  }
                />
                <button
                  type="button"
                  className="text-sm font-medium text-red-600 hover:underline"
                  onClick={() =>
                    fijar({
                      areas: datos.areas.filter((_, i) => i !== indice),
                    })
                  }
                >
                  Eliminar área
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {mensaje && <p className="mt-4 text-sm text-green-700">{mensaje}</p>}

      <button
        type="button"
        className="mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-50"
        disabled={guardando}
        onClick={() => void guardar()}
      >
        {guardando ? "Guardando…" : "Guardar cambios"}
      </button>
    </div>
  );
}
