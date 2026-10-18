import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Star, MessageSquare } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ImageUploadField } from "./ImageUploadField";
import { REVIEW_CATEGORIES, DISCUSSION_CATEGORIES, PostType } from "../../lib/store";

interface CreateReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TYPE_OPTIONS: { value: PostType; label: string; icon: typeof Star }[] = [
  { value: "review", label: "CRÍTICA", icon: Star },
  { value: "discussion", label: "DISCUSSÃO", icon: MessageSquare },
];

// Textos que mudam conforme o tipo de publicação
const COPY = {
  review: {
    description: "Crie uma nova crítica de animação compartilhando suas opiniões",
    imageLabel: "IMAGEM DA OBRA",
    titleLabel: "TÍTULO DA OBRA",
    titlePlaceholder: "Ex: A Viagem de Chihiro",
    subtitlePlaceholder: "Ex: Uma jornada mágica e emocionante",
    excerptPlaceholder: "Um breve resumo da sua opinião (máx. 150 caracteres)",
    contentLabel: "CRÍTICA COMPLETA",
    contentPlaceholder:
      "Escreva sua crítica completa aqui... Compartilhe suas impressões, análises e opiniões sobre a obra.",
    submit: "PUBLICAR CRÍTICA",
  },
  discussion: {
    description: "Crie uma nova discussão para conversar com a comunidade",
    imageLabel: "IMAGEM (OPCIONAL)",
    titleLabel: "TÍTULO DA DISCUSSÃO",
    titlePlaceholder: "Ex: Qual a melhor abertura de anime de todos os tempos?",
    subtitlePlaceholder: "Ex: Quero saber a opinião de vocês",
    excerptPlaceholder: "Um breve resumo do tema (máx. 150 caracteres)",
    contentLabel: "SUA DISCUSSÃO",
    contentPlaceholder:
      "Explique o tema, dê o seu ponto de vista e convide a comunidade a participar da conversa...",
    submit: "PUBLICAR DISCUSSÃO",
  },
} as const;

const emptyForm = (type: PostType) => ({
  title: "",
  subtitle: "",
  rating: 5,
  excerpt: "",
  fullContent: "",
  category: type === "review" ? REVIEW_CATEGORIES[0] : DISCUSSION_CATEGORIES[0],
  image: "",
});

export function CreateReviewModal({ open, onOpenChange }: CreateReviewModalProps) {
  const { addReview } = useAuth();
  const [postType, setPostType] = useState<PostType>("review");
  const [formData, setFormData] = useState(emptyForm("review"));
  const [imageError, setImageError] = useState("");

  const copy = COPY[postType];
  const categoryOptions = postType === "review" ? REVIEW_CATEGORIES : DISCUSSION_CATEGORIES;

  const handleTypeChange = (type: PostType) => {
    if (type === postType) return;
    setPostType(type);
    setImageError("");
    // cada tipo tem suas próprias categorias
    setFormData((prev) => ({ ...prev, category: emptyForm(type).category }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Críticas exigem imagem; em discussões a imagem é opcional
    if (postType === "review" && !formData.image) {
      setImageError("Escolha uma imagem para a obra.");
      return;
    }
    await addReview({
      ...formData,
      rating: postType === "review" ? formData.rating : 0,
      type: postType,
    });
    onOpenChange(false);
    // Reset form
    setPostType("review");
    setFormData(emptyForm("review"));
    // Reload page to show new post
    window.location.reload();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 max-w-3xl w-full max-h-[90vh] overflow-y-auto z-50 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.25)]">
          <div className="bg-gradient-to-r from-yellow-300 to-orange-500 border-b-4 border-black dark:border-neutral-400 p-6 sticky top-0 z-10 dark:text-black">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-2xl font-black text-white dark:text-black">
                NOVA PUBLICAÇÃO
              </Dialog.Title>
              <Dialog.Close className="hover:bg-black/10 p-2 transition-colors">
                <X className="w-6 h-6 text-white dark:text-black" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              {copy.description}
            </Dialog.Description>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Tipo de publicação */}
            <div>
              <p id="post-type-label" className="block font-black mb-3">
                TIPO DE PUBLICAÇÃO
              </p>
              <div role="group" aria-labelledby="post-type-label" className="grid grid-cols-2 gap-3">
                {TYPE_OPTIONS.map(({ value, label, icon: Icon }) => {
                  const selected = postType === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => handleTypeChange(value)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 font-black border-4 border-black dark:border-neutral-400 transition-colors ${
                        selected
                          ? "bg-yellow-400 text-black"
                          : "bg-white dark:bg-neutral-900 text-black dark:text-neutral-100 hover:bg-gray-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Imagem */}
            <div>
              <label className="block font-black mb-3">{copy.imageLabel}</label>
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
              <label className="block font-black mb-3">{copy.titleLabel}</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder={copy.titlePlaceholder}
                className="w-full border-4 border-black dark:border-neutral-400 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500"
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
                placeholder={copy.subtitlePlaceholder}
                className="w-full border-4 border-black dark:border-neutral-400 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500"
                required
              />
            </div>

            {/* Category & Rating (nota só existe em críticas) */}
            <div className={`grid grid-cols-1 gap-4 ${postType === "review" ? "sm:grid-cols-2" : ""}`}>
              <div>
                <label className="block font-black mb-3">CATEGORIA</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border-4 border-black dark:border-neutral-400 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500 bg-white dark:bg-neutral-900"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {postType === "review" && (
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
                    className="flex-1 border-4 border-black dark:border-neutral-400 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500"
                    required
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(formData.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              )}
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
                placeholder={copy.excerptPlaceholder}
                className="w-full border-4 border-black dark:border-neutral-400 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500 resize-none"
                required
              />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {formData.excerpt.length}/150 caracteres
              </p>
            </div>

            {/* Full Content */}
            <div>
              <label className="block font-black mb-3">{copy.contentLabel}</label>
              <textarea
                value={formData.fullContent}
                onChange={(e) =>
                  setFormData({ ...formData, fullContent: e.target.value })
                }
                rows={8}
                placeholder={copy.contentPlaceholder}
                className="w-full border-4 border-black dark:border-neutral-400 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500 resize-none"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t-4 border-black dark:border-neutral-400">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 via-yellow-400 to-orange-500 text-white px-6 py-4 font-black hover:opacity-90 transition-all border-4 border-black dark:border-neutral-400 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.25)] dark:text-black"
              >
                {copy.submit}
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 bg-white dark:bg-neutral-900 text-black dark:text-neutral-100 px-6 py-4 font-black hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors border-4 border-black dark:border-neutral-400 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.25)]"
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
