import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Star } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ImageUploadField } from "./ImageUploadField";

interface CreateReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  "Longa-Metragem",
  "Série",
  "Curta-Metragem",
  "OVA",
  "Filme",
  "Anime",
  "Cartoon",
];

export function CreateReviewModal({ open, onOpenChange }: CreateReviewModalProps) {
  const { addReview } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    rating: 5,
    excerpt: "",
    fullContent: "",
    category: "Longa-Metragem",
    image: "",
  });
  const [imageError, setImageError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      setImageError("Escolha uma imagem para a obra.");
      return;
    }
    await addReview(formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      title: "",
      subtitle: "",
      rating: 5,
      excerpt: "",
      fullContent: "",
      category: "Longa-Metragem",
      image: "",
    });
    // Reload page to show new review
    window.location.reload();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-4 border-black max-w-3xl w-full max-h-[90vh] overflow-y-auto z-50 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-gradient-to-r from-yellow-300 to-orange-500 border-b-4 border-black p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-2xl font-black text-white">
                CRIAR NOVA CRÍTICA
              </Dialog.Title>
              <Dialog.Close className="hover:bg-black/10 p-2 transition-colors">
                <X className="w-6 h-6 text-white" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Crie uma nova crítica de animação compartilhando suas opiniões
            </Dialog.Description>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Imagem da obra */}
            <div>
              <label className="block font-black mb-3">IMAGEM DA OBRA</label>
              <ImageUploadField
                variant="wide"
                maxDimension={1200}
                value={formData.image}
                onChange={(v) => {
                  setImageError("");
                  setFormData({ ...formData, image: v });
                }}
                error={imageError}
              />
            </div>

            {/* Title */}
            <div>
              <label className="block font-black mb-3">TÍTULO DA OBRA</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ex: A Viagem de Chihiro"
                className="w-full border-4 border-black px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500"
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block font-black mb-3">SUBTÍTULO</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                placeholder="Ex: Uma jornada mágica e emocionante"
                className="w-full border-4 border-black px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500"
                required
              />
            </div>

            {/* Category & Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-black mb-3">CATEGORIA</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border-4 border-black px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-black mb-3">
                  NOTA (1-5 estrelas)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: parseFloat(e.target.value),
                      })
                    }
                    className="flex-1 border-4 border-black px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500"
                    required
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(formData.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block font-black mb-3">
                RESUMO (Para aparecer nos cards)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows={3}
                maxLength={150}
                placeholder="Um breve resumo da sua opinião (máx. 150 caracteres)"
                className="w-full border-4 border-black px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500 resize-none"
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                {formData.excerpt.length}/150 caracteres
              </p>
            </div>

            {/* Full Content */}
            <div>
              <label className="block font-black mb-3">CRÍTICA COMPLETA</label>
              <textarea
                value={formData.fullContent}
                onChange={(e) =>
                  setFormData({ ...formData, fullContent: e.target.value })
                }
                rows={8}
                placeholder="Escreva sua crítica completa aqui... Compartilhe suas impressões, análises e opiniões sobre a obra."
                className="w-full border-4 border-black px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500 resize-none"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t-4 border-black">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 via-yellow-400 to-orange-500 text-white px-6 py-4 font-black hover:opacity-90 transition-all border-4 border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                PUBLICAR CRÍTICA
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 bg-white text-black px-6 py-4 font-black hover:bg-gray-100 transition-colors border-4 border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                CANCELAR
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
