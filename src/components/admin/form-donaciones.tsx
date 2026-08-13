import { useEffect, useState } from "react";
import { api, subirImagen } from "./api";

interface Cuenta {
  banco: string;
  titular: string;
  numero: string;
  cci: string;
}

interface Impacto {
  monto: string;
  descripcion: string;
}

interface Donaciones {
  intro: string;
  yapeNumero: string | null;
  yapeQrUrl: string | null;
  plinNumero: string | null;
  plinQrUrl: string | null;
  paypalUrl: string | null;
  cuentas: Cuenta[];
  impactos: Impacto[];
}

const claseInput =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-content focus:outline-none focus:ring-2 focus:ring-brand";

function CampoQr({
  etiqueta,
  valor,
  onCambio,
}: {
  etiqueta: string;
  valor: string;
  onCambio: (url: string) => void;
}) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-content">
        {etiqueta}
      </label>
      {valor && (
        <div className="mb-2 flex items-center gap-3">
          <img
            src={valor}
            alt=""
            className="h-24 w-24 rounded-lg border border-line object-contain"
          />
          <button
            type="button"
            className="text-sm font-medium text-red-600 hover:underline"
            onClick={() => onCambio("")}
          >
            Quitar
          </button>
        </div>
      )}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="block text-sm text-content/70"
        disabled={subiendo}
        onChange={(e) => {
          const archivo = e.target.files?.[0];
          if (!archivo) return;
          setError("");
          setSubiendo(true);
          subirImagen("donaciones", archivo)
            .then(onCambio)
            .catch((err: unknown) =>
              setError(err instanceof Error ? err.message : "Error al subir"),
            )
            .finally(() => setSubiendo(false));
        }}
      />
      {subiendo && (
        <p className="mt-1 text-xs text-content/60">Subiendo imagen…</p>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function FormDonaciones() {
  const [datos, setDatos] = useState<Donaciones | null>(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    api<Donaciones | null>("/donaciones")
      .then((respuesta) =>
        setDatos(
          respuesta ?? {
            intro: "",
            yapeNumero: "",
            yapeQrUrl: "",
            plinNumero: "",
            plinQrUrl: "",
            paypalUrl: "",
            cuentas: [],
            impactos: [],
          },
        ),
      )
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Error al cargar"),
      );
  }, []);

  if (!datos) {
    return (
      <p className="text-sm text-content/60">{error || "Cargando…"}</p>
    );
  }

  const fijar = (parcial: Partial<Donaciones>) =>
    setDatos((prev) => (prev ? { ...prev, ...parcial } : prev));

  const guardar = async () => {
    setError("");
    setMensaje("");
    setGuardando(true);
    try {
      await api("/donaciones", {
        method: "PUT",
        body: JSON.stringify({
          intro: datos.intro,
          yapeNumero: datos.yapeNumero || undefined,
          yapeQrUrl: datos.yapeQrUrl || undefined,
          plinNumero: datos.plinNumero || undefined,
          plinQrUrl: datos.plinQrUrl || undefined,
          paypalUrl: datos.paypalUrl || undefined,
          cuentas: datos.cuentas.map((cuenta, indice) => ({
            ...cuenta,
            orden: indice + 1,
          })),
          impactos: datos.impactos.map((impacto, indice) => ({
            monto: impacto.monto,
            descripcion: impacto.descripcion,
            orden: indice + 1,
          })),
        }),
      });
      setMensaje("Cambios guardados correctamente.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-content">Donaciones</h1>

      <div className="mt-6 space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-content">
            Texto de introducción
          </label>
          <textarea
            className={claseInput}
            rows={3}
            value={datos.intro}
            onChange={(e) => fijar({ intro: e.target.value })}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4 rounded-xl border border-line bg-white p-4">
            <p className="font-semibold text-content">Yape</p>
            <input
              className={claseInput}
              placeholder="Número de Yape"
              value={datos.yapeNumero ?? ""}
              onChange={(e) => fijar({ yapeNumero: e.target.value })}
            />
            <CampoQr
              etiqueta="QR de Yape"
              valor={datos.yapeQrUrl ?? ""}
              onCambio={(url) => fijar({ yapeQrUrl: url })}
            />
          </div>
          <div className="space-y-4 rounded-xl border border-line bg-white p-4">
            <p className="font-semibold text-content">Plin</p>
            <input
              className={claseInput}
              placeholder="Número de Plin"
              value={datos.plinNumero ?? ""}
              onChange={(e) => fijar({ plinNumero: e.target.value })}
            />
            <CampoQr
              etiqueta="QR de Plin"
              valor={datos.plinQrUrl ?? ""}
              onCambio={(url) => fijar({ plinQrUrl: url })}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-content">
            Enlace de PayPal (opcional)
          </label>
          <input
            className={claseInput}
            placeholder="https://paypal.me/…"
            value={datos.paypalUrl ?? ""}
            onChange={(e) => fijar({ paypalUrl: e.target.value })}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold text-content">Cuentas bancarias</p>
            <button
              type="button"
              className="text-sm font-medium text-accent hover:underline"
              onClick={() =>
                fijar({
                  cuentas: [
                    ...datos.cuentas,
                    { banco: "", titular: "", numero: "", cci: "" },
                  ],
                })
              }
            >
              + Agregar cuenta
            </button>
          </div>
          <div className="space-y-3">
            {datos.cuentas.map((cuenta, indice) => (
              <div
                key={indice}
                className="grid gap-2 rounded-xl border border-line bg-white p-4 sm:grid-cols-2"
              >
                {(
                  [
                    ["banco", "Banco"],
                    ["titular", "Titular"],
                    ["numero", "Número de cuenta"],
                    ["cci", "CCI"],
                  ] as const
                ).map(([clave, etiqueta]) => (
                  <input
                    key={clave}
                    className={claseInput}
                    placeholder={etiqueta}
                    value={cuenta[clave]}
                    onChange={(e) =>
                      fijar({
                        cuentas: datos.cuentas.map((c, i) =>
                          i === indice
                            ? { ...c, [clave]: e.target.value }
                            : c,
                        ),
                      })
                    }
                  />
                ))}
                <button
                  type="button"
                  className="text-left text-sm font-medium text-red-600 hover:underline"
                  onClick={() =>
                    fijar({
                      cuentas: datos.cuentas.filter((_, i) => i !== indice),
                    })
                  }
                >
                  Eliminar cuenta
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold text-content">Ejemplos de impacto</p>
            <button
              type="button"
              className="text-sm font-medium text-accent hover:underline"
              onClick={() =>
                fijar({
                  impactos: [
                    ...datos.impactos,
                    { monto: "", descripcion: "" },
                  ],
                })
              }
            >
              + Agregar ejemplo
            </button>
          </div>
          <div className="space-y-3">
            {datos.impactos.map((impacto, indice) => (
              <div
                key={indice}
                className="grid gap-2 rounded-xl border border-line bg-white p-4 sm:grid-cols-[8rem_1fr_auto]"
              >
                <input
                  className={claseInput}
                  placeholder="S/ 50"
                  value={impacto.monto}
                  onChange={(e) =>
                    fijar({
                      impactos: datos.impactos.map((imp, i) =>
                        i === indice
                          ? { ...imp, monto: e.target.value }
                          : imp,
                      ),
                    })
                  }
                />
                <input
                  className={claseInput}
                  placeholder="Qué se logra con ese monto"
                  value={impacto.descripcion}
                  onChange={(e) =>
                    fijar({
                      impactos: datos.impactos.map((imp, i) =>
                        i === indice
                          ? { ...imp, descripcion: e.target.value }
                          : imp,
                      ),
                    })
                  }
                />
                <button
                  type="button"
                  className="text-sm font-medium text-red-600 hover:underline"
                  onClick={() =>
                    fijar({
                      impactos: datos.impactos.filter((_, i) => i !== indice),
                    })
                  }
                >
                  Eliminar
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
