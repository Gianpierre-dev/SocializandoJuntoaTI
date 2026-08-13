import { useState } from "react";
import { cerrarSesion, iniciarSesion, obtenerToken } from "./api";
import { RECURSOS } from "./recursos";
import CrudRecurso from "./crud-recurso";
import FormDonaciones from "./form-donaciones";
import ListaPostulaciones from "./lista-postulaciones";
import FormSitio from "./form-sitio";

function IconoOjo({ tachado }: { tachado: boolean }) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
      {tachado && <path d="M3 3l18 18" />}
    </svg>
  );
}

function PantallaLogin({ onIngreso }: { onIngreso: () => void }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-deep px-4 py-10">
      {/* Fondo decorativo */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand opacity-40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold opacity-20 blur-3xl"
        aria-hidden="true"
      />

      <main className="relative w-full max-w-sm">
        <form
          onSubmit={(e) => void ingresar(e)}
          className="rounded-3xl bg-white p-8 shadow-2xl"
          aria-describedby={error ? "error-login" : undefined}
        >
          <div className="flex flex-col items-center text-center">
            <img
              src="/favicon.png?v=3"
              alt=""
              width="88"
              height="88"
              className="h-22 w-22 drop-shadow-md"
            />
            <h1 className="mt-4 text-xl font-bold text-content">
              Panel administrativo
            </h1>
            <p className="mt-1 text-sm text-content/60">
              Socializando Junto A Ti
            </p>
          </div>

          <label
            htmlFor="campo-correo"
            className="mt-8 block text-sm font-medium text-content"
          >
            Correo electrónico
          </label>
          <input
            id="campo-correo"
            type="email"
            required
            autoComplete="username"
            autoFocus
            aria-invalid={error ? true : undefined}
            className="mt-1 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-content transition-shadow focus:outline-none focus:ring-2 focus:ring-brand"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <label
            htmlFor="campo-contrasena"
            className="mt-4 block text-sm font-medium text-content"
          >
            Contraseña
          </label>
          <div className="relative mt-1">
            <input
              id="campo-contrasena"
              type={verContrasena ? "text" : "password"}
              required
              autoComplete="current-password"
              aria-invalid={error ? true : undefined}
              className="w-full rounded-xl border border-line px-3.5 py-2.5 pr-11 text-sm text-content transition-shadow focus:outline-none focus:ring-2 focus:ring-brand"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setVerContrasena((v) => !v)}
              aria-label={
                verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              aria-pressed={verContrasena}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-content/50 hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <IconoOjo tachado={verContrasena} />
            </button>
          </div>

          {error && (
            <p
              id="error-login"
              role="alert"
              className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="mt-6 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {cargando ? "Ingresando…" : "Ingresar"}
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              aria-expanded={mostrarAyuda}
              aria-controls="ayuda-contrasena"
              onClick={() => setMostrarAyuda((v) => !v)}
            >
              ¿Olvidaste tu contraseña?
            </button>
            {mostrarAyuda && (
              <p
                id="ayuda-contrasena"
                className="mt-3 rounded-lg bg-subtle px-3 py-2 text-left text-xs leading-relaxed text-content/70"
              >
                Escríbenos a{" "}
                <a
                  className="font-medium text-accent underline"
                  href="mailto:admin@socializandojuntoati.org?subject=Recuperar%20acceso%20al%20panel"
                >
                  admin@socializandojuntoati.org
                </a>{" "}
                desde tu correo institucional y la administración restablecerá
                tu contraseña de forma segura.
              </p>
            )}
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-white/60">
          Acceso restringido al equipo de Socializando Junto A Ti.
        </p>
      </main>
    </div>
  );
}

const SECCIONES = [
  { clave: "postulaciones", etiqueta: "Postulaciones" },
  ...RECURSOS.map((recurso) => ({
    clave: recurso.clave,
    etiqueta: recurso.etiqueta,
  })),
  { clave: "donaciones", etiqueta: "Donaciones" },
  { clave: "sitio", etiqueta: "Datos generales" },
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
        <div className="flex items-center gap-3 px-5 py-6">
          <img
            src="/favicon.png?v=3"
            alt=""
            width="40"
            height="40"
            className="h-10 w-10 shrink-0"
          />
          <div>
            <p className="text-sm font-bold text-white">
              Socializando Junto A Ti
            </p>
            <p className="text-xs text-white/60">Panel administrativo</p>
          </div>
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
        ) : seccion === "postulaciones" ? (
          <ListaPostulaciones />
        ) : seccion === "sitio" ? (
          <FormSitio />
        ) : (
          <FormDonaciones />
        )}
      </main>
    </div>
  );
}
