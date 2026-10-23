import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, TrendingUp, Award, MessageSquare } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ARTICLES, ACCENT_BAR, formatNewsDate } from "../../lib/news";
import { getFeaturedPosts, getRecentPosts } from "../../lib/featured";
import { FeaturedCarousel } from "./FeaturedCarousel";

export function Home() {
  // Publicações em destaque: 3 críticas/discussões sorteadas a cada abertura do app
  const [featuredPosts] = useState(() => getFeaturedPosts());

  // Últimas notícias: os mesmos artigos de "Em alta agora" da página de notícias
  const latestNews = ARTICLES.filter((a) => a.trending);

  // Publicações recentes: as 3 mais novas (críticas ou discussões), sem repetir as do carrossel
  const recentPosts = getRecentPosts(3, featuredPosts.map((p) => p.id));

  return (
    <div className="bg-white dark:bg-neutral-900">
      {/* Publicações em destaque (carrossel) */}
      <FeaturedCarousel posts={featuredPosts} />

      {/* Latest News */}
      <section className="py-16 bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              <h3 className="text-3xl font-black">ÚLTIMAS NOTÍCIAS</h3>
            </div>
            <Link to="/news" className="flex items-center gap-2 font-black hover:text-orange-500 transition-colors">
              VER TUDO
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((news) => (
              <Link
                key={news.id}
                to={`/news/${news.id}`}
                className="block group bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.25)] transition-all"
              >
                <div className={`h-2 ${ACCENT_BAR[news.accent]}`}></div>
                <div className="h-40 overflow-hidden bg-gray-100 dark:bg-neutral-800">
                  {news.image && (
                    <ImageWithFallback
                      src={news.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="inline-block px-3 py-1 bg-black text-white text-xs font-black">{news.category}</span>
                    <span className="text-xs font-black text-gray-500 dark:text-gray-400">{formatNewsDate(news.date)}</span>
                  </div>
                  <h4 className="font-black text-lg mb-2 leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {news.title}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">{news.subtitle}</p>
                  <span className="text-sm font-black group-hover:underline">LEIA MAIS →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8" />
              <h3 className="text-3xl font-black">PUBLICAÇÕES RECENTES</h3>
            </div>
            <Link to="/reviews" className="flex items-center gap-2 font-black hover:text-blue-500 transition-colors">
              VER TUDO
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                to={`/reviews/${post.id}`}
                className="group bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.25)] transition-shadow"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-neutral-800">
                  {post.image ? (
                    <ImageWithFallback
                      src={post.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-yellow-400 text-black">
                      <MessageSquare className="w-14 h-14" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="font-black text-lg">{post.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-black mb-4">JUNTE-SE À COMUNIDADE DE ANIMAÇÃO</h3>
          <p className="text-xl text-gray-300 mb-8">
            Fique atualizado com as últimas críticas, notícias e insights do mundo da animação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/reviews"
              className="bg-blue-500 dark:bg-blue-600 text-white px-8 py-4 font-black hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            >
              EXPLORAR CRÍTICAS
            </Link>
            <Link
              to="/news"
              className="bg-orange-500 dark:bg-orange-700 text-white px-8 py-4 font-black hover:bg-orange-600 dark:hover:bg-orange-800 transition-colors"
            >
              LER NOTÍCIAS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}