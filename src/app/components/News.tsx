import { useState } from "react";
import { Link } from "react-router";
import { Newspaper, Calendar, User, TrendingUp, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ARTICLES, QUICK_NEWS, ACCENT_BAR, QuickNews, formatNewsDate } from "../../lib/news";

// Notícia rápida: só texto. "LEIA MAIS" aumenta o próprio cartão (sem pop-up).
function QuickNewsCard({ item }: { item: QuickNews }) {
  const [open, setOpen] = useState(false);
  const textId = `noticia-rapida-${item.id}`;

  return (
    <article
      className="bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.25)] transition-all group"
    >
      <div className={`h-2 ${ACCENT_BAR[item.accent]}`}></div>
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="inline-block px-3 py-1 bg-black text-white text-xs font-black">{item.category}</span>
          <div className="flex items-center gap-2 text-xs font-black text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            {formatNewsDate(item.date)}
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-black mb-3 leading-snug">{item.title}</h3>
        <p id={textId} className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
          {open ? item.content : item.summary}
        </p>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-black text-gray-500 dark:text-gray-400">
            <User className="w-4 h-4" aria-hidden="true" />
            {item.author}
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={textId}
            className="min-h-[44px] px-2 font-black text-sm hover:text-orange-700 dark:hover:text-orange-400 transition-colors"
          >
            {open ? "LER MENOS ↑" : "LEIA MAIS →"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function News() {
  const featured = ARTICLES.find((a) => a.featured)!;
  const trending = ARTICLES.filter((a) => a.trending);

  return (
    <div className="bg-gray-50 dark:bg-neutral-950 min-h-screen">
      {/* Header */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="w-12 h-12" />
            <h1 className="text-5xl font-black">NOTÍCIAS</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Fique por dentro dos últimos desenvolvimentos, anúncios e tendências na indústria de animação.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 overflow-hidden hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[16px_16px_0px_0px_rgba(255,255,255,0.25)] transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-96 lg:h-auto bg-gray-100 dark:bg-neutral-800">
                <ImageWithFallback
                  src={featured.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 bg-orange-500 dark:bg-orange-700 text-white px-4 py-2 font-black flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  DESTAQUE
                </div>
              </div>
              <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-block px-3 py-1 bg-black text-white text-xs font-black mb-4 self-start">
                  {featured.category}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">{featured.title}</h2>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">{featured.subtitle}</p>
                <div className="flex items-center gap-4 text-sm font-black text-gray-500 dark:text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatNewsDate(featured.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {featured.author}
                  </div>
                </div>
                <Link
                  to={`/news/${featured.id}`}
                  className="bg-orange-500 dark:bg-orange-700 text-white px-8 py-4 font-black hover:bg-orange-600 dark:hover:bg-orange-800 transition-colors self-start"
                >
                  LER ARTIGO COMPLETO
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-8 h-8" />
            <h3 className="text-3xl font-black">EM ALTA AGORA</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trending.map((article) => (
              <Link
                key={article.id}
                to={`/news/${article.id}`}
                className="block bg-gray-50 dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.25)] transition-all group"
              >
                <div className={`h-2 ${ACCENT_BAR[article.accent]}`}></div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-black text-white text-xs font-black">
                      {article.category}
                    </span>
                    <TrendingUp className="w-4 h-4 text-red-500 dark:text-red-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-black mb-3 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">{article.subtitle}</p>
                  <div className="flex items-center justify-between text-xs font-black text-gray-500 dark:text-gray-400">
                    <span>{formatNewsDate(article.date)}</span>
                    <span>{article.author.toUpperCase()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All News */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-8 h-8" aria-hidden="true" />
            <h3 className="text-3xl font-black">NOTÍCIAS RÁPIDAS</h3>
          </div>
          <div className="space-y-6">
            {QUICK_NEWS.map((item) => (
              <QuickNewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Newspaper className="w-16 h-16 mx-auto mb-6" />
          <h3 className="text-4xl font-black mb-4">NUNCA PERCA UMA ATUALIZAÇÃO</h3>
          <p className="text-xl text-gray-300 mb-8">
            Inscreva-se em nossa newsletter para receber notícias diárias de animação em seu e-mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="flex-1 px-6 py-4 bg-white text-black font-bold placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-yellow-400"
            />
            <button className="bg-yellow-400 text-black px-8 py-4 font-black hover:bg-yellow-500 transition-colors whitespace-nowrap">
              INSCREVER-SE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
