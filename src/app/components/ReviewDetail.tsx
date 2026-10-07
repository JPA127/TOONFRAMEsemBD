import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  Star,
  Calendar,
  Heart,
  MessageCircle,
  ArrowLeft,
  Send,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Review, Comment } from "../contexts/UserContext";

export function ReviewDetail() {
  const { id } = useParams();
  const {
    addComment,
    getAllReviews,
    getAllComments,
    toggleReviewLike,
    toggleCommentLike,
    currentProfile,
  } = useAuth();
  const { userProfile } = useUser();

  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [collapsedReplies, setCollapsedReplies] = useState<Set<string>>(new Set());
  const [review, setReview] = useState<Review | null>(null);
  const [reviewComments, setReviewComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const allReviews = await getAllReviews();
      const found = allReviews.find((r) => r.id === id) ?? null;
      setReview(found);
      if (found) {
        const comments = await getAllComments(found.id);
        setReviewComments(comments);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const reloadComments = async () => {
    if (!review) return;
    const comments = await getAllComments(review.id);
    setReviewComments(comments);
  };

  const handleToggleReviewLike = () => {
    if (!review) return;
    const updated = toggleReviewLike(review.id);
    if (updated) setReview(updated);
  };

  const handleToggleCommentLike = (commentId: string) => {
    const updated = toggleCommentLike(commentId);
    if (updated) {
      setReviewComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !review) return;
    await addComment(review.id, commentText);
    setCommentText("");
    await reloadComments();
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim() || !review) return;
    await addComment(review.id, replyText, parentId);
    setReplyText("");
    setReplyingTo(null);
    await reloadComments();
  };

  const toggleRepliesCollapsed = (commentId: string) => {
    setCollapsedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-96 bg-gray-200 animate-pulse" />
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
          <div className="h-48 bg-gray-100 animate-pulse border-4 border-black" />
          <div className="h-64 bg-gray-100 animate-pulse border-4 border-black" />
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">CRÍTICA NÃO ENCONTRADA</h1>
          <Link
            to="/reviews"
            className="inline-block bg-blue-500 text-white px-6 py-3 font-black hover:bg-blue-600 transition-colors border-4 border-black"
          >
            VOLTAR PARA CRÍTICAS
          </Link>
        </div>
      </div>
    );
  }

  const userLikedReview = review.likes.includes(currentProfile?.id ?? "");
  const rootComments = reviewComments.filter((c) => !c.parentId);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-96 bg-gradient-to-br from-blue-500 via-purple-600 to-orange-500 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={review.image}
            alt={review.title}
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 font-black hover:bg-white/30 transition-colors border-2 border-white mb-6 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            VOLTAR
          </Link>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="bg-yellow-400 text-black px-4 py-2 font-black text-xl border-2 border-white">
              {review.category}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(review.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-white/50"
                  }`}
                />
              ))}
              <span className="text-white font-black text-xl ml-2">{review.rating}/5</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">{review.title}</h1>
          <p className="text-xl text-gray-200 font-bold mb-6">{review.subtitle}</p>

          <div className="flex items-center gap-6 text-white flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-bold">
                {new Date(review.date).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="font-bold">{review.likes.length} curtidas</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-bold">{rootComments.length} comentários</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Author */}
            <div className="bg-white border-4 border-black p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-black bg-gray-100 overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={review.authorImage}
                    alt={review.authorName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-bold">ESCRITO POR</p>
                  <h3 className="text-xl font-black">{review.authorName}</h3>
                  <p className="text-sm text-gray-600">@{review.authorUsername}</p>
                </div>
              </div>
            </div>

            {/* Review text */}
            <div className="bg-white border-4 border-black p-8">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                <Star className="w-6 h-6" />
                A CRÍTICA
              </h2>
              <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
                {review.fullContent}
              </p>
            </div>

            {/* Comments section */}
            <div className="bg-white border-4 border-black p-8">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                COMENTÁRIOS ({rootComments.length})
              </h2>

              {/* New comment form */}
              <form onSubmit={handleSubmitComment} className="mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-black bg-gray-100 overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={userProfile.profileImage}
                      alt={userProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Adicione um comentário..."
                      rows={3}
                      className="w-full border-4 border-black px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500 resize-none"
                      required
                    />
                    <button
                      type="submit"
                      className="mt-3 bg-blue-500 text-white px-6 py-2 font-black hover:bg-blue-600 transition-colors border-2 border-black flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      PUBLICAR
                    </button>
                  </div>
                </div>
              </form>

              {/* Comment list */}
              {rootComments.length === 0 ? (
                <p className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300">
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </p>
              ) : (
                <div className="space-y-8">
                  {rootComments.map((comment) => {
                    const replies = reviewComments.filter((c) => c.parentId === comment.id);
                    const userLikedComment = comment.likes.includes(currentProfile?.id ?? "");
                    const repliesHidden = collapsedReplies.has(comment.id);

                    return (
                      <div
                        key={comment.id}
                        className="pb-8 border-b-2 border-gray-100 last:border-0 last:pb-0"
                      >
                        {/* Root comment row */}
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 border-2 border-black bg-gray-100 overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={comment.authorImage}
                              alt={comment.authorName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                              <h4 className="font-black">{comment.authorName}</h4>
                              <span className="text-xs text-gray-500">
                                @{comment.authorUsername} ·{" "}
                                {new Date(comment.date).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            <p className="text-gray-800 leading-relaxed mb-3">
                              {comment.content}
                            </p>

                            {/* Actions row */}
                            <div className="flex items-center gap-4 flex-wrap">
                              {/* Like comment */}
                              <button
                                onClick={() => handleToggleCommentLike(comment.id)}
                                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${
                                  userLikedComment
                                    ? "text-red-500"
                                    : "text-gray-400 hover:text-red-400"
                                }`}
                              >
                                <Heart
                                  className={`w-4 h-4 ${userLikedComment ? "fill-red-500" : ""}`}
                                />
                                {comment.likes.length > 0 && (
                                  <span>{comment.likes.length}</span>
                                )}
                              </button>

                              {/* Reply button */}
                              <button
                                onClick={() =>
                                  setReplyingTo(
                                    replyingTo === comment.id ? null : comment.id
                                  )
                                }
                                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${
                                  replyingTo === comment.id
                                    ? "text-blue-500"
                                    : "text-gray-400 hover:text-blue-500"
                                }`}
                              >
                                <CornerDownRight className="w-4 h-4" />
                                Responder
                              </button>

                              {/* Toggle replies visibility */}
                              {replies.length > 0 && (
                                <button
                                  onClick={() => toggleRepliesCollapsed(comment.id)}
                                  className="flex items-center gap-1 text-xs font-black text-gray-500 hover:text-black transition-colors ml-auto"
                                >
                                  {repliesHidden ? (
                                    <>
                                      <ChevronDown className="w-3 h-3" />
                                      {replies.length}{" "}
                                      {replies.length === 1 ? "resposta" : "respostas"}
                                    </>
                                  ) : (
                                    <>
                                      <ChevronUp className="w-3 h-3" />
                                      ocultar respostas
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Inline reply form */}
                        {replyingTo === comment.id && (
                          <form
                            onSubmit={(e) => handleSubmitReply(e, comment.id)}
                            className="mt-4 ml-16 border-l-4 border-blue-500 pl-4"
                          >
                            <p className="text-xs font-black text-blue-600 mb-2 uppercase">
                              Respondendo para {comment.authorName}
                            </p>
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Sua resposta para ${comment.authorName}...`}
                              rows={2}
                              autoFocus
                              className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-1.5 font-black text-sm border-2 border-black hover:bg-blue-600 transition-colors flex items-center gap-1"
                              >
                                <Send className="w-3 h-3" />
                                ENVIAR
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                                className="bg-white text-black px-4 py-1.5 font-black text-sm border-2 border-black hover:bg-gray-100 transition-colors"
                              >
                                CANCELAR
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Nested replies */}
                        {replies.length > 0 && !repliesHidden && (
                          <div className="mt-5 ml-16 space-y-5 border-l-2 border-gray-200 pl-4">
                            {replies.map((reply) => {
                              const userLikedReply = reply.likes.includes(
                                currentProfile?.id ?? ""
                              );
                              return (
                                <div key={reply.id} className="flex items-start gap-3">
                                  <div className="w-9 h-9 border-2 border-black bg-gray-100 overflow-hidden flex-shrink-0">
                                    <ImageWithFallback
                                      src={reply.authorImage}
                                      alt={reply.authorName}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                                      <h5 className="font-black text-sm">{reply.authorName}</h5>
                                      <span className="text-xs text-gray-500">
                                        @{reply.authorUsername} ·{" "}
                                        {new Date(reply.date).toLocaleDateString("pt-BR")}
                                      </span>
                                    </div>
                                    <p className="text-gray-800 text-sm leading-relaxed mb-2">
                                      {reply.content}
                                    </p>
                                    <button
                                      onClick={() => handleToggleCommentLike(reply.id)}
                                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                                        userLikedReply
                                          ? "text-red-500"
                                          : "text-gray-400 hover:text-red-400"
                                      }`}
                                    >
                                      <Heart
                                        className={`w-3.5 h-3.5 ${
                                          userLikedReply ? "fill-red-500" : ""
                                        }`}
                                      />
                                      {reply.likes.length > 0 && (
                                        <span>{reply.likes.length}</span>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white border-4 border-black p-6 sticky top-24 space-y-6">
              {/* Like review button */}
              <div>
                <p className="text-sm font-bold text-gray-600 mb-3">CURTIR ESTA CRÍTICA</p>
                <button
                  onClick={handleToggleReviewLike}
                  className={`w-full px-6 py-4 font-black border-4 border-black flex items-center justify-center gap-2 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    userLikedReview
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-white text-black hover:bg-red-50"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${userLikedReview ? "fill-white" : ""}`} />
                  {userLikedReview ? "CURTIDO" : "CURTIR"}
                  <span className="ml-1 tabular-nums">({review.likes.length})</span>
                </button>
              </div>

              <hr className="border-black border-2" />

              {/* Details */}
              <div>
                <h3 className="text-xl font-black mb-4">DETALHES</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">CATEGORIA</p>
                    <p className="font-black">{review.category}</p>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4">
                    <p className="text-sm font-bold text-gray-600 mb-2">AVALIAÇÃO</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(review.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="font-black text-lg ml-1">{review.rating}</span>
                    </div>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4">
                    <p className="text-sm font-bold text-gray-600 mb-1">PUBLICADO EM</p>
                    <p className="font-black">
                      {new Date(review.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4">
                    <p className="text-sm font-bold text-gray-600 mb-1">COMENTÁRIOS</p>
                    <p className="font-black text-2xl text-blue-500">{rootComments.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
