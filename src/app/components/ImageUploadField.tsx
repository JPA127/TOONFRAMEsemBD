import { useRef, useState } from "react";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { fileToCompressedDataUrl } from "../../lib/imageUtils";

interface ImageUploadFieldProps {
  value: string;
  onChange: (dataUrl: string) => void;
  /** avatar = quadrado pequeno · cover = faixa larga · wide = imagem grande de obra */
  variant?: "avatar" | "cover" | "wide";
  /** maior lado da imagem salva, em pixels */
  maxDimension?: number;
  /** mensagem de erro externa (ex.: campo obrigatório) */
  error?: string;
}

const PREVIEW_HEIGHT = { cover: "h-40", wide: "h-64" } as const;

export function ImageUploadField({
  value,
  onChange,
  variant = "wide",
  maxDimension = 1200,
  error,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite escolher o mesmo arquivo de novo
    if (!file) return;

    setLocalError("");
    setProcessing(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file, maxDimension);
      onChange(dataUrl);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Erro ao carregar a imagem.");
    } finally {
      setProcessing(false);
    }
  };

  const shownError = localError || error;

  const controls = (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2.5 font-black border-4 border-black hover:bg-yellow-300 transition-colors disabled:opacity-60"
        >
          <Upload className="w-5 h-5" />
          {processing ? "CARREGANDO..." : value ? "TROCAR IMAGEM" : "ESCOLHER IMAGEM"}
        </button>
        {value && !processing && (
          <button
            type="button"
            onClick={() => {
              setLocalError("");
              onChange("");
            }}
            className="inline-flex items-center gap-2 bg-white text-black px-4 py-2.5 font-black border-4 border-black hover:bg-gray-100 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            REMOVER
          </button>
        )}
      </div>
      <p className="text-xs text-gray-600 font-bold">
        Escolha uma imagem do seu dispositivo (JPG, PNG ou WEBP).
      </p>
      {shownError && <p className="text-sm text-red-600 font-black">{shownError}</p>}
    </div>
  );

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      onChange={handleFile}
      className="hidden"
    />
  );

  if (variant === "avatar") {
    return (
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 border-4 border-black bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
          {value ? (
            <img src={value} alt="Pré-visualização" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div className="flex-1">{controls}</div>
        {fileInput}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={`relative ${PREVIEW_HEIGHT[variant]} border-4 border-black bg-gray-100 overflow-hidden flex items-center justify-center`}
      >
        {value ? (
          <img src={value} alt="Pré-visualização" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-12 h-12 text-gray-400" />
        )}
      </div>
      {controls}
      {fileInput}
    </div>
  );
}
