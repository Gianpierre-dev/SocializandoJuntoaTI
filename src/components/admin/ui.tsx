import { useEffect, useRef, useState } from "react";

/* ---------- Cambios sin guardar (estado global simple) ---------- */

let formularioSucio = false;

/** Los formularios marcan aquí si tienen cambios sin guardar. */
export const marcarSucio = (sucio: boolean): void => {
  formularioSucio = sucio;
};

export const hayCambiosSinGuardar = (): boolean => formularioSucio;

/* ---------- Bloqueo del scroll de fondo mientras hay un diálogo ---------- */

export function useBloqueoScroll(activo: boolean): void {
  useEffect(() => {
    if (!activo) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [activo]);
}

/* ---------- Trampa de foco para diálogos ---------- */

export function useTrampaFoco(
  ref: React.RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const disparador = document.activeElement as HTMLElement | null;

    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key !== "Tab" || !ref.current) return;
      const focusables = ref.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", alTeclear);
    return () => {
      document.removeEventListener("keydown", alTeclear);
      disparador?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ---------- Textarea que crece con el contenido (sin scroll interno) ---------- */

interface PropsAreaTexto
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
}

export function AreaTextoAuto({ value, ...props }: PropsAreaTexto) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    elemento.style.height = "auto";
    elemento.style.height = `${elemento.scrollHeight + 2}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      {...props}
      className={`${props.className ?? ""} resize-none overflow-hidden`}
    />
  );
}

/* ---------- Toasts ---------- */

interface Toast {
  id: number;
  mensaje: string;
  tipo: "exito" | "error";
}

const EVENTO_TOAST = "sojat:toast";

/** Muestra una notificación breve en la esquina del panel. */
export function mostrarToast(
  mensaje: string,
  tipo: "exito" | "error" = "exito",
): void {
  window.dispatchEvent(
    new CustomEvent(EVENTO_TOAST, { detail: { mensaje, tipo } }),
  );
}

export function Toasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let contador = 0;
    const alRecibir = (evento: Event) => {
      const { mensaje, tipo } = (
        evento as CustomEvent<{ mensaje: string; tipo: Toast["tipo"] }>
      ).detail;
      const id = ++contador;
      setToasts((prev) => [...prev, { id, mensaje, tipo }]);
      window.setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        3500,
      );
    };
    window.addEventListener(EVENTO_TOAST, alRecibir);
    return () => window.removeEventListener(EVENTO_TOAST, alRecibir);
  }, []);

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
            toast.tipo === "exito" ? "bg-brand-deep" : "bg-red-600"
          }`}
        >
          <span aria-hidden="true">
            {toast.tipo === "exito" ? "✓" : "✕"}
          </span>
          {toast.mensaje}
        </div>
      ))}
    </div>
  );
}

/* ---------- Modal de confirmación ---------- */

interface PropsConfirmacion {
  titulo: string;
  mensaje: string;
  etiquetaConfirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ModalConfirmacion({
  titulo,
  mensaje,
  etiquetaConfirmar = "Eliminar",
  onConfirmar,
  onCancelar,
}: PropsConfirmacion) {
  const dialogoRef = useRef<HTMLDivElement>(null);
  useBloqueoScroll(true);
  useTrampaFoco(dialogoRef);

  useEffect(() => {
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") onCancelar();
    };
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [onCancelar]);

  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-label={titulo}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onCancelar();
      }}
    >
      <div
        ref={dialogoRef}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600"
            aria-hidden="true"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
            </svg>
          </span>
          <div>
            <h2 className="font-bold text-content">{titulo}</h2>
            <p className="mt-1 text-sm leading-relaxed text-content/70">
              {mensaje}
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            autoFocus
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-content hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            onClick={onConfirmar}
          >
            {etiquetaConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Skeleton de tabla ---------- */

export function SkeletonTabla({ filas = 5 }: { filas?: number }) {
  return (
    <div
      className="mt-6 space-y-3 rounded-2xl border border-line bg-white p-4"
      aria-hidden="true"
    >
      {Array.from({ length: filas }, (_, indice) => (
        <div key={indice} className="flex animate-pulse items-center gap-4">
          <div className="h-10 w-14 rounded-lg bg-subtle" />
          <div className="h-4 flex-1 rounded bg-subtle" />
          <div className="h-4 w-16 rounded bg-subtle" />
          <div className="h-7 w-24 rounded-lg bg-subtle" />
        </div>
      ))}
    </div>
  );
}
