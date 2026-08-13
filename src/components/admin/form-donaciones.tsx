import { useEffect, useState } from "react";
import { api } from "./api";
import SelectorImagen from "./selector-imagen";
import { AreaTextoAuto, mostrarToast } from "./ui";

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
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-content">
        {etiqueta}
      </label>
      <SelectorImagen
        carpeta="donaciones"
        valor={valor}
        onCambio={onCambio}
        forma="cuadrada"
        sugerencia="imagen cuadrada del QR"
      />
    </div>
  );
}

/** Celular peruano: 9 dígitos empezando con 9. */
const esCelularValido = (numero: string) => /^9\d{8}$/.test(numero.trim());

function CampoCelular({
  etiqueta,
  valor,
  onCambio,
}: {
  etiqueta: string;
  valor: string;
  onCambio: (numero: string) => void;
}) {
  const mostrarError = valor.length > 0 && !esCelularValido(valor);
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-content">
        {etiqueta}
      </label>
      <input
        className={claseInput}
        type="tel"
        inputMode="numeric"
        maxLength={9}
        placeholder="9XXXXXXXX"
        aria-invalid={mostrarError || undefined}
        value={valor}
        onChange={(e) => onCambio(e.target.value.replace(/\D/g, "").slice(0, 9))}
      />
      {mostrarError && (
        <p role="alert" className="mt-1 text-sm text-red-600">
          Debe tener 9 dígitos y empezar con 9.
        </p>
      )}
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

    const errores: string[] = [];
    if (!datos.intro.trim()) {
      errores.push("El texto de introducción es obligatorio.");
    }
    if (datos.yapeNumero && !esCelularValido(datos.yapeNumero)) {
      errores.push("El número de Yape debe tener 9 dígitos y empezar con 9.");
    }
    if (datos.plinNumero && !esCelularValido(datos.plinNumero)) {
      errores.push("El número de Plin debe tener 9 dígitos y empezar con 9.");
    }
    if (datos.paypalUrl && !/^https:\/\//.test(datos.paypalUrl.trim())) {
      errores.push("El enlace de PayPal debe empezar con https://");
    }
    if (errores.length > 0) {
      setError(errores.join(" "));
      return;
    }

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
      mostrarToast("Donaciones actualizadas");
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
          <AreaTextoAuto
            className={claseInput}
            rows={3}
            value={datos.intro}
            onChange={(e) => fijar({ intro: e.target.value })}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4 rounded-xl border border-line bg-white p-4">
            <p className="font-semibold text-content">Yape</p>
            <CampoCelular
              etiqueta="Número de Yape"
              valor={datos.yapeNumero ?? ""}
              onCambio={(numero) => fijar({ yapeNumero: numero })}
            />
            <CampoQr
              etiqueta="QR de Yape"
              valor={datos.yapeQrUrl ?? ""}
              onCambio={(url) => fijar({ yapeQrUrl: url })}
            />
          </div>
          <div className="space-y-4 rounded-xl border border-line bg-white p-4">
            <p className="font-semibold text-content">Plin</p>
            <CampoCelular
              etiqueta="Número de Plin"
              valor={datos.plinNumero ?? ""}
              onCambio={(numero) => fijar({ plinNumero: numero })}
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
            aria-invalid={
              datos.paypalUrl && !/^https:\/\//.test(datos.paypalUrl)
                ? true
                : undefined
            }
            value={datos.paypalUrl ?? ""}
            onChange={(e) => fijar({ paypalUrl: e.target.value })}
          />
          {datos.paypalUrl && !/^https:\/\//.test(datos.paypalUrl) && (
            <p role="alert" className="mt-1 text-sm text-red-600">
              El enlace debe empezar con https://
            </p>
          )}
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
