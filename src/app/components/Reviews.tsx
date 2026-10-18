import { useState, useEffect } from "react";
import { Star, Filter, Plus, MessageCircle, MessageSquare, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";
import { CreateReviewModal } from "./CreateReviewModal";
import { Link } from "react-router";
import { Review } from "../contexts/UserContext";
import { REVIEW_CATEGORIES, DISCUSSION_CATEGORIES, isDiscussion } from "../../lib/store";

type TypeFilter = "todos" | "review" | "discussion";

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "todos", label: "TUDO" },
  { value: "review", label: "CRÍTICAS" },
  { value: "discussion", label: "DISCUSSÕES" },
];

// Cor do cartão de uma discussão que não tem imagem
const getDiscussionColor = (category: string) =>
  ({
    Debate: "bg-orange-500",
    Teoria: "bg-blue-500",
    Recomendação: "bg-yellow-400",
    Dúvida: "bg-orange-500",
    Nostalgia: "bg-yellow-400",
    Curiosidade: "bg-blue-500",
  } as Record<string, string>)[category] ?? "bg-yellow-400";

export function Reviews() {
  const { getAllReviews, toggleReviewLike, currentProfile } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [selectedType, setSelectedType] = useState<TypeFilter>("todos");
  const [createReviewOpen, setCreateReviewOpen] = useState(false);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const reviews = await getAllReviews();
      setAllReviews(reviews);
      setLoading(false);
    };
    load();
  }, []);

  const handleToggleLike = (e: React.MouseEvent, reviewId: string) => {
    e.preventDefault();
    const updated = toggleReviewLike(reviewId);
    if (updated) {
      setAllReviews((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
    }
  };

  // Categorias mostradas dependem do tipo escolhido (críticas, discussões ou tudo)
  const categories = [
    "todos",
    ...(selectedType === "discussion" ? [] : REVIEW_CATEGORIES),
    ...(selectedType === "review" ? [] : DISCUSSION_CATEGORIES),
  ];

  const handleTypeChange = (type: TypeFilter) => {
    setSelectedType(type);
    setSelectedFilter("todos");
  };

  const filteredReviews = allReviews.filter((review) => {
    const typeOk =
      selectedType === "todos" ||
      (selectedType === "discussion" ? isDiscussion(review) : !isDiscussion(review));
    const categoryOk = selectedFilter === "todos" || review.category === selectedFilter;
    return typeOk && categoryOk;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-blue-500 dark:text-black";
    if (rating >= 3.5) return "bg-yellow-500 dark:text-black";
    return "bg-orange-500 dark:text-black";
  };

  return (
    <div className="bg-gray-50 dark:bg-neutral-950 min-h-screen">
      {/* Header */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-4">
            <div className="flex items-center gap-3">
              <Star className="w-12 h-12" />
              <h1 className="text-4xl sm:text-5xl font-black">CRÍTICAS E DISCUSSÕES</h1>
            </div>
            <button
              onClick={() => setCreateReviewOpen(true)}
              className="bg-gradient-to-r from-yellow-300 to-orange-500 text-white px-8 py-4 font-black hover:opacity-90 transition-all border-4 border-white hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] flex items-center gap-2 dark:text-black"
            >
              <Plus className="w-5 h-5" />
              NOVA PUBLICAÇÃO
            </button>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Críticas aprofundadas e discussões da comunidade sobre as últimas e melhores animações, em
            todos os gêneros e formatos.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white dark:bg-neutral-900 border-b-4 border-black dark:border-neutral-400 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-black">
              <Filter className="w-5 h-5" />
              FILTRAR:
            </div>
            <div role="group" aria-label="Tipo de publicação" className="flex flex-wrap gap-2">
              {TYPE_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleTypeChange(value)}
                  aria-pressed={selectedType === value}
                  className={`px-4 py-2 font-black text-sm border-2 border-black dark:border-neutral-400 transition-colors ${
                    selectedType === value
                      ? "bg-yellow-400 text-black"
                      : "bg-white dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div role="group" aria-label="Categoria" className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedFilter(category)}
                  aria-pressed={selectedFilter === category}
                  className={`px-4 py-2 font-black text-sm transition-colors ${
                    selectedFilter === category
                      ? "bg-blue-500 dark:bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 animate-pulse">
                  <div className="h-64 bg-gray-200 dark:bg-neutral-700" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-neutral-700 w-1/4 rounded" />
                    <div className="h-6 bg-gray-200 dark:bg-neutral-700 w-3/4 rounded" />
                    <div className="h-4 bg-gray-200 dark:bg-neutral-700 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-20">
              <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-2xl font-black text-gray-400">NENHUMA PUBLICAÇÃO ENCONTRADA</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {selectedFilter !== "todos" || selectedType !== "todos"
                  ? "Tente outro filtro ou crie a primeira publicação desta categoria."
                  : "Seja o primeiro a publicar uma crítica ou discussão!"}
              </p>
              <button
                onClick={() => setCreateReviewOpen(true)}
                className="mt-6 bg-blue-500 dark:bg-blue-600 text-white px-8 py-3 font-black hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors border-4 border-black dark:border-neutral-400"
              >
                CRIAR PRIMEIRA PUBLICAÇÃO
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredReviews.map((review) => {
                const userLiked = review.likes.includes(currentProfile?.id ?? "");
                return (
                  <Link
                    key={review.id}
                    to={`/reviews/${review.id}`}
                    className="bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.25)] transition-all group block"
                  >
                    <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-neutral-800">
                      {review.image ? (
                        <ImageWithFallback
                          src={review.image}
                          alt={review.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex flex-col items-center justify-center gap-3 text-black ${getDiscussionColor(review.category)}`}
                        >
                          <MessageSquare className="w-20 h-20" aria-hidden="true" />
                          <span className="text-xl font-black tracking-wide">
                            {review.category.toUpperCase()}
                          </span>
                        </div>
                      )}
                      {isDiscussion(review) ? (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 flex items-center gap-2 border-2 border-white font-black">
                          <MessageSquare className="w-5 h-5" aria-hidden="true" />
                          DISCUSSÃO
                        </div>
                      ) : (
                        <div
                          className={`absolute top-4 right-4 ${getRatingColor(review.rating)} text-white px-4 py-2 flex items-center gap-2 border-2 border-white`}
                        >
                          <Star className="w-5 h-5 fill-white" />
                          <span className="text-2xl font-black">{review.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-block px-3 py-1 bg-black text-white text-xs font-black">
                          {review.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-black">
                          {new Date(review.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black mb-2 group-hover:text-blue-500 transition-colors">
                        {review.title}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-bold mb-3">{review.subtitle}</p>
                      <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed line-clamp-3">
                        {review.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200 dark:border-neutral-700">
                        <div className="flex items-center gap-4 text-sm">
                          <button
                            onClick={(e) => handleToggleLike(e, review.id)}
                            className={`flex items-center gap-1.5 font-bold transition-colors px-3 py-1.5 border-2 ${
                              userLiked
                                ? "text-red-500 dark:text-red-400 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950"
                                : "text-gray-500 dark:text-gray-400 border-gray-200 dark:border-neutral-700 hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 transition-all ${userLiked ? "fill-red-500" : ""}`}
                            />
                            <span>{review.likes.length}</span>
                          </button>
                          <div className="flex items-center gap-1 text-gray-400">
                            <MessageCircle className="w-4 h-4" />
                            <span className="font-bold text-xs">COMENTÁRIOS</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-gray-500 dark:text-gray-400">
                          POR {review.authorName.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CreateReviewModal open={createReviewOpen} onOpenChange={setCreateReviewOpen} />
    </div>
  );
}
