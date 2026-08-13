import { useState } from "react";
import { cerrarSesion, iniciarSesion, obtenerToken } from "./api";
import { RECURSOS } from "./recursos";
import CrudRecurso from "./crud-recurso";
import FormDonaciones from "./form-donaciones";

function PantallaLogin({ onIngreso }: { onIngreso: () => void }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const ingresar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setError("");
    setCargando(true);
    try {
      await iniciarSesion(correo, contrasena);
      onIngreso();
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-subtle px-4">
      <form
        onSubmit={(e) => void ingresar(e)}
        className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-bold text-content">
          Panel administrativo
        </h1>
        <p className="mt-1 text-sm text-content/60">Socializando Junto A Ti</p>

        <label className="mt-6 block text-sm font-medium text-content">
          Correo
          <input
            type="email"
            required
            autoComplete="username"
            className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-content">
          Contraseña
          <input
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="mt-6 w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-50"
        >
          {cargando ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}

const SECCIONES = [
  ...RECURSOS.map((recurso) => ({
    clave: recurso.clave,
    etiqueta: recurso.etiqueta,
  })),
  { clave: "donaciones", etiqueta: "Donaciones" },
];

export default function PanelAdmin() {
  const [autenticado, setAutenticado] = useState(() =>
    Boolean(obtenerToken()),
  );
  const [seccion, setSeccion] = useState(SECCIONES[0].clave);

  if (!autenticado) {
    return <PantallaLogin onIngreso={() => setAutenticado(true)} />;
  }

  const recursoActivo = RECURSOS.find((recurso) => recurso.clave === seccion);

  return (
    <div className="flex min-h-screen bg-subtle">
      <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-brand-deep">
        <div className="px-5 py-6">
          <p className="text-sm font-bold text-white">Socializando Junto A Ti</p>
          <p className="text-xs text-white/60">Panel administrativo</p>
        </div>
        <nav className="flex-1 px-2" aria-label="Secciones del panel">
          {SECCIONES.map((s) => (
            <button
              key={s.clave}
              type="button"
              onClick={() => setSeccion(s.clave)}
              className={`mb-1 block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                seccion === s.clave
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {s.etiqueta}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            className="text-sm font-medium text-white/70 hover:text-white"
            onClick={() => {
              cerrarSesion();
              setAutenticado(false);
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto p-6 sm:p-10">
        {recursoActivo ? (
          <CrudRecurso key={recursoActivo.clave} recurso={recursoActivo} />
        ) : (
          <FormDonaciones />
        )}
      </main>
    </div>
  );
}
