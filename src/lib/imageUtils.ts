// Utilitários para trabalhar com imagens escolhidas pelo usuário.
// Como tudo é salvo no localStorage (limite de ~5 MB), a imagem é redimensionada
// e comprimida antes de ser guardada como "data URL".

export const MAX_FILE_SIZE_MB = 15;

export function fileToCompressedDataUrl(
  file: File,
  maxDimension = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Escolha um arquivo de imagem (JPG, PNG, WEBP...)."));
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      reject(new Error(`A imagem é muito grande (máximo de ${MAX_FILE_SIZE_MB} MB).`));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth, img.naturalHeight));
      const width = Math.max(1, Math.round(img.naturalWidth * scale));
      const height = Math.max(1, Math.round(img.naturalHeight * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Não foi possível processar a imagem neste navegador."));
        return;
      }
      // fundo branco: evita fundo preto em PNGs com transparência
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Não foi possível ler essa imagem. Tente outro arquivo (JPG ou PNG)."));
    };

    img.src = objectUrl;
  });
}
