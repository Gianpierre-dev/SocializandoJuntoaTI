import { useRef, useState } from "react";
import { subirImagen } from "./api";

interface Props {
  carpeta: string;
  valor: string;
  onCambio: (url: string) => void;
  /** Sugerencia de dimensiones que se muestra en el control. */
  sugerencia?: string;
  /** Relación de aspecto de la vista previa. */
  forma?: "panoramica" | "cuadrada";
}

/**
 * Control de subida de imágenes del panel: zona punteada clickeable con
 * arrastrar y soltar, estado de carga y vista previa con Cambiar/Quitar.
 */
export default function SelectorImagen({
  carpeta,
  valor,
  onCambio,
  sugerencia,
  forma = "panoramica",
}: Props) {
  const [subiendo, setSubiendo] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const procesar = async (archivo: File | undefined) => {
    if (!archivo) return;
    setError("");
    setSubiendo(true);
    try {
      onCambio(await subirImagen(carpeta, archivo));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir la imagen");
    } finally {
      setSubiendo(false);
    }
  };

  const clasePreview =
    forma === "cuadrada"
      ? "h-32 w-32 object-contain"
      : "h-24 w-full max-w-xs object-cover";

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(e) => {
          void procesar(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {valor ? (
        <div className="flex flex-wrap items-center gap-4">
          <img
            src={valor}
            alt="Vista previa de la imagen cargada"
            className={`rounded-xl border border-line bg-subtle ${clasePreview}`}
          />
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="rounded-lg bg-subtle px-3 py-1.5 text-sm font-semibold text-accent transition-colors hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              disabled={subiendo}
              onClick={() => inputRef.current?.click()}
            >
              {subiendo ? "Subiendo…" : "Cambiar imagen"}
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              onClick={() => onCambio("")}
            >
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={subiendo}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setArrastrando(true);
          }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={(e) => {
            e.preventDefault();
            setArrastrando(false);
            void procesar(e.dataTransfer.files?.[0]);
          }}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
            arrastrando
              ? "border-brand bg-brand/5"
              : "border-line bg-subtle/50 hover:border-brand/50 hover:bg-subtle"
          }`}
        >
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-accent"
            aria-hidden="true"
          >
            {subiendo ? (
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M21 12a9 9 0 1 1-6.2-8.56" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 8h.01M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6z" />
                <path d="m3 16 5-5c.9-.87 2.1-.87 3 0l5 5" />
                <path d="m14 14 1-1c.9-.87 2.1-.87 3 0l3 3" />
              </svg>
            )}
          </span>
          <span className="text-sm font-semibold text-content">
            {subiendo
              ? "Subiendo imagen…"
              : "Haz clic o arrastra una imagen aquí"}
          </span>
          <span className="text-xs text-content/50">
            PNG, JPG o WebP · máximo 5 MB
            {sugerencia ? ` · ${sugerencia}` : ""}
          </span>
        </button>
      )}

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
