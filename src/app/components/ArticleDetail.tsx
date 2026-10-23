import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  User,
  MessageCircle,
  Send,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  Tag,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";
import { useUser, Comment } from "../contexts/UserContext";
import { getArticle, formatNewsDate, articleCommentKey, ArticleBlock } from "../../lib/news";

// Texto do artigo, bloco a bloco
function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={i} className="text-lg leading-relaxed text-gray-800 dark:text-gray-100 mb-6">
                {block.text}
              </p>
            );
          case "heading":
            return (
              <h2 key={i} className="text-2xl sm:text-3xl font-black mt-10 mb-5">
                {block.text}
              </h2>
            );
          case "list":
            return (
              <ul key={i} className="space-y-5 mb-8">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="border-l-4 border-yellow-400 pl-4 text-lg leading-relaxed text-gray-800 dark:text-gray-100"
                  >
                    {item.lead && <strong className="font-black text-black dark:text-white">{item.lead} </strong>}
                    {item.text}
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className={`my-8 border-l-8 border-black dark:border-neutral-400 pl-5 sm:pl-6 italic ${
                  block.large
                    ? "text-2xl sm:text-3xl font-black leading-snug"
                    : "text-lg leading-relaxed text-gray-700 dark:text-gray-200"
                }`}
              >
                “{block.text}”
              </blockquote>
            );
        }
      })}
    </div>
  );
}

export function ArticleDetail() {
  const { articleId = "" } = useParams();
  const article = getArticle(articleId);
  const { addComment, getAllComments } = useAuth();
  const { userProfile } = useUser();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [collapsedReplies, setCollapsedReplies] = useState<Set<string>>(new Set());

  const commentKey = articleCommentKey(articleId);

  // abre sempre no topo da página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  const reloadComments = async () => {
    setComments(await getAllComments(commentKey));
  };

  useEffect(() => {
    if (article) reloadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">ARTIGO NÃO ENCONTRADO</h1>
          <Link
            to="/news"
            className="inline-block bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 font-black hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors border-4 border-black dark:border-neutral-400"
          >
            VOLTAR PARA NOTÍCIAS
          </Link>
        </div>
      </div>
    );
  }

  const rootComments = comments.filter((c) => !c.parentId);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await addComment(commentKey, commentText);
    setCommentText("");
    await reloadComments();
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    await addComment(commentKey, replyText, parentId);
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

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero */}
      <div className="relative bg-black text-white overflow-hidden">
        {article.image ? (
          <ImageWithFallback src={article.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-purple-800 to-orange-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 min-h-[22rem] sm:min-h-[28rem] flex flex-col justify-between gap-10">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 self-start bg-white/90 text-black px-4 py-2 font-black border-2 border-black hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            VOLTAR
          </Link>
          <div>
            <span className="inline-block bg-yellow-400 text-black px-4 py-2 font-black text-sm border-2 border-white mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-5">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-bold text-gray-100">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {formatNewsDate(article.date)}
              </span>
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" aria-hidden="true" />
                {article.author}
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                {rootComments.length} {rootComments.length === 1 ? "comentário" : "comentários"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8 min-w-0">
            {/* Artigo */}
            <article className="bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 p-6 sm:p-8">
              <p className="text-xl font-bold leading-relaxed border-l-8 border-yellow-400 pl-4 mb-8">
                {article.subtitle}
              </p>
              <ArticleBody blocks={article.blocks} />
            </article>

            {/* Comentários (sem curtidas) */}
            <section
              aria-labelledby="comentarios-titulo"
              className="bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 p-6 sm:p-8"
            >
              <h2 id="comentarios-titulo" className="text-2xl font-black mb-6 flex items-center gap-3">
                <MessageCircle className="w-6 h-6" aria-hidden="true" />
                COMENTÁRIOS ({rootComments.length})
              </h2>

              <form onSubmit={handleSubmitComment} className="mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-black dark:border-neutral-400 bg-gray-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={userProfile.profileImage}
                      alt={userProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Adicione um comentário..."
                      aria-label="Adicione um comentário"
                      rows={3}
                      className="w-full border-4 border-black dark:border-neutral-400 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500 resize-none"
                      required
                    />
                    <button
                      type="submit"
                      className="mt-3 inline-flex items-center gap-2 bg-blue-500 dark:bg-blue-600 text-white px-6 py-2 font-black hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors border-2 border-black dark:border-neutral-400"
                    >
                      <Send className="w-4 h-4" aria-hidden="true" />
                      PUBLICAR
                    </button>
                  </div>
                </div>
              </form>

              {rootComments.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8 border-2 border-dashed border-gray-300 dark:border-neutral-600">
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </p>
              ) : (
                <div className="space-y-8">
                  {rootComments.map((comment) => {
                    const replies = comments.filter((c) => c.parentId === comment.id);
                    const repliesHidden = collapsedReplies.has(comment.id);
                    return (
                      <div
                        key={comment.id}
                        className="pb-8 border-b-2 border-gray-100 dark:border-neutral-800 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-12 h-12 border-2 border-black dark:border-neutral-400 bg-gray-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={comment.authorImage}
                              alt={comment.authorName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                              <h3 className="font-black">{comment.authorName}</h3>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                @{comment.authorUsername} · {new Date(comment.date).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            <p className="text-gray-800 dark:text-gray-100 leading-relaxed mb-3 break-words">
                              {comment.content}
                            </p>
                            <div className="flex items-center gap-4 flex-wrap">
                              <button
                                type="button"
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${
                                  replyingTo === comment.id
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                }`}
                              >
                                <CornerDownRight className="w-4 h-4" aria-hidden="true" />
                                Responder
                              </button>
                              {replies.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => toggleRepliesCollapsed(comment.id)}
                                  aria-expanded={!repliesHidden}
                                  className="flex items-center gap-1 text-xs font-black text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors ml-auto"
                                >
                                  {repliesHidden ? (
                                    <>
                                      <ChevronDown className="w-3 h-3" aria-hidden="true" />
                                      {replies.length} {replies.length === 1 ? "resposta" : "respostas"}
                                    </>
                                  ) : (
                                    <>
                                      <ChevronUp className="w-3 h-3" aria-hidden="true" />
                                      ocultar respostas
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {replyingTo === comment.id && (
                          <form
                            onSubmit={(e) => handleSubmitReply(e, comment.id)}
                            className="mt-4 ml-8 sm:ml-16 border-l-4 border-blue-500 pl-4"
                          >
                            <p className="text-xs font-black text-blue-600 dark:text-blue-400 mb-2 uppercase">
                              Respondendo para {comment.authorName}
                            </p>
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Sua resposta para ${comment.authorName}...`}
                              aria-label={`Sua resposta para ${comment.authorName}`}
                              rows={2}
                              autoFocus
                              className="w-full border-2 border-black dark:border-neutral-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                type="submit"
                                className="inline-flex items-center gap-2 bg-blue-500 dark:bg-blue-600 text-white px-4 py-1.5 font-black text-sm border-2 border-black dark:border-neutral-400 hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                              >
                                <Send className="w-3 h-3" aria-hidden="true" />
                                ENVIAR
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                                className="bg-white dark:bg-neutral-900 text-black dark:text-neutral-100 px-4 py-1.5 font-black text-sm border-2 border-black dark:border-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                              >
                                CANCELAR
                              </button>
                            </div>
                          </form>
                        )}

                        {replies.length > 0 && !repliesHidden && (
                          <div className="mt-5 ml-8 sm:ml-16 space-y-5 border-l-2 border-gray-200 dark:border-neutral-700 pl-4">
                            {replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <div className="w-9 h-9 border-2 border-black dark:border-neutral-400 bg-gray-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                                  <ImageWithFallback
                                    src={reply.authorImage}
                                    alt={reply.authorName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                                    <h4 className="font-black text-sm">{reply.authorName}</h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      @{reply.authorUsername} · {new Date(reply.date).toLocaleDateString("pt-BR")}
                                    </span>
                                  </div>
                                  <p className="text-gray-800 dark:text-gray-100 text-sm leading-relaxed break-words">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Barra lateral */}
          <aside className="min-w-0">
            <div className="bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 p-6 lg:sticky lg:top-28">
              <h2 className="text-xl font-black mb-5 pb-3 border-b-4 border-black dark:border-neutral-400">DETALHES</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-2">
                    <Tag className="w-4 h-4" aria-hidden="true" />
                    CATEGORIA
                  </dt>
                  <dd className="font-black">{article.category}</dd>
                </div>
                <div className="border-t-2 border-gray-200 dark:border-neutral-700 pt-4">
                  <dt className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">ESCRITO POR</dt>
                  <dd className="font-black">{article.author}</dd>
                </div>
                <div className="border-t-2 border-gray-200 dark:border-neutral-700 pt-4">
                  <dt className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">PUBLICADO EM</dt>
                  <dd className="font-black">{formatNewsDate(article.date)}</dd>
                </div>
                <div className="border-t-2 border-gray-200 dark:border-neutral-700 pt-4">
                  <dt className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">COMENTÁRIOS</dt>
                  <dd className="font-black">{rootComments.length}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
