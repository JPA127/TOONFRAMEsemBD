import { useState, useEffect } from "react";
import { Star, Filter, Plus, MessageCircle, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";
import { CreateReviewModal } from "./CreateReviewModal";
import { Link } from "react-router";
import { Review } from "../contexts/UserContext";

export function Reviews() {
  const { getAllReviews, toggleReviewLike, currentProfile } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState("todos");
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

  const categories = [
    "todos",
    "Longa-Metragem",
    "Série",
    "Curta-Metragem",
    "OVA",
    "Filme",
    "Anime",
    "Cartoon",
  ];

  const filteredReviews =
    selectedFilter === "todos"
      ? allReviews
      : allReviews.filter((review) => review.category === selectedFilter);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-blue-500";
    if (rating >= 3.5) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-4">
            <div className="flex items-center gap-3">
              <Star className="w-12 h-12" />
              <h1 className="text-5xl font-black">CRÍTICAS</h1>
            </div>
            <button
              onClick={() => setCreateReviewOpen(true)}
              className="bg-gradient-to-r from-yellow-300 to-orange-500 text-white px-8 py-4 font-black hover:opacity-90 transition-all border-4 border-white hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              CRIAR CRÍTICA
            </button>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Análises aprofundadas e críticas das últimas e melhores animações em todos os gêneros e
            formatos.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b-4 border-black sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-black">
              <Filter className="w-5 h-5" />
              FILTRAR:
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedFilter(category)}
                  className={`px-4 py-2 font-black text-sm transition-colors ${
                    selectedFilter === category
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
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
                <div key={i} className="bg-white border-4 border-black animate-pulse">
                  <div className="h-64 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 w-1/4 rounded" />
                    <div className="h-6 bg-gray-200 w-3/4 rounded" />
                    <div className="h-4 bg-gray-200 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-20">
              <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-2xl font-black text-gray-400">NENHUMA CRÍTICA ENCONTRADA</p>
              <p className="text-gray-500 mt-2">
                {selectedFilter !== "todos"
                  ? "Tente outro filtro ou crie a primeira crítica desta categoria."
                  : "Seja o primeiro a publicar uma crítica!"}
              </p>
              <button
                onClick={() => setCreateReviewOpen(true)}
                className="mt-6 bg-blue-500 text-white px-8 py-3 font-black hover:bg-blue-600 transition-colors border-4 border-black"
              >
                CRIAR PRIMEIRA CRÍTICA
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
                    className="bg-white border-4 border-black hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group block"
                  >
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={review.image}
                        alt={review.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className={`absolute top-4 right-4 ${getRatingColor(review.rating)} text-white px-4 py-2 flex items-center gap-2 border-2 border-white`}
                      >
                        <Star className="w-5 h-5 fill-white" />
                        <span className="text-2xl font-black">{review.rating}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-block px-3 py-1 bg-black text-white text-xs font-black">
                          {review.category}
                        </span>
                        <span className="text-xs text-gray-500 font-black">
                          {new Date(review.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black mb-2 group-hover:text-blue-500 transition-colors">
                        {review.title}
                      </h2>
                      <p className="text-sm text-gray-600 font-bold mb-3">{review.subtitle}</p>
                      <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                        {review.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                        <div className="flex items-center gap-4 text-sm">
                          <button
                            onClick={(e) => handleToggleLike(e, review.id)}
                            className={`flex items-center gap-1.5 font-bold transition-colors px-3 py-1.5 border-2 ${
                              userLiked
                                ? "text-red-500 border-red-300 bg-red-50"
                                : "text-gray-500 border-gray-200 hover:text-red-400 hover:border-red-200 hover:bg-red-50"
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
                        <span className="text-xs font-black text-gray-500">
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
