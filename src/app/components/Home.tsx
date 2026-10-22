import { Link } from "react-router";
import { Star, ArrowRight, TrendingUp, Award } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ARTICLES, ACCENT_BAR, formatNewsDate } from "../../lib/news";
import animatedCharacter from "figma:asset/a4051cd5efe114cbe473392269e1b4e34058117e.png";
import animatedCharacters3D from "figma:asset/5f08b9a8a1be70cdd9b7ff9365aa9c2376dc8ee8.png";

export function Home() {
  const featuredReview = {
    id: 1,
    title: "A Arte da Mais Recente Obra-Prima do Studio Ghibli",
    excerpt: "Um mergulho profundo na deslumbrante narrativa visual e profundidade temática do cinema de animação moderno.",
    rating: 9.5,
    category: "Longa-Metragem",
    image: "https://i0.wp.com/studioghibli.com.br/wp-content/uploads/2023/08/O-Menino-e-a-Garca-Studio-Ghibli-Brasil.jpg?resize=1080%2C608&ssl=1",
  };

  // Últimas notícias: os mesmos artigos de "Em alta agora" da página de notícias
  const latestNews = ARTICLES.filter((a) => a.trending);

  const quickReviews = [
    {
      id: 2,
      title: "Expectativas para Super Mario Galaxy?",
      rating: 8.7,
      image: animatedCharacter,
    },
    {
      id: 3,
      title: "Por que 'Guerreiras do K-Pop' fez tanto sucesso?",
      rating: 9.2,
      image: animatedCharacters3D,
    },
    {
      id: 4,
      title: "Em uma luta, qual vilão das animações venceria?",
      rating: 9.0,
      image: "https://pbs.twimg.com/media/FzoKByyWYAEyTX8.jpg",
    },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900">
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10"></div>
        <ImageWithFallback
          src={featuredReview.image}
          alt="Imagem da crítica em destaque"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <div className="inline-block bg-yellow-400 text-black px-4 py-1 mb-4"><span className="font-black text-sm">CRÍTICA EM DESTAQUE</span></div>
            <h2 className="text-5xl font-black mb-4 leading-tight">{featuredReview.title}</h2>
            <p className="text-xl text-gray-300 mb-6">{featuredReview.excerpt}</p>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-blue-500 dark:bg-blue-600 px-4 py-2">
                <Star className="w-6 h-6 fill-white" />
                <span className="text-2xl font-black">{featuredReview.rating}</span>
              </div>
              <span className="text-gray-300">{featuredReview.category}</span>
            </div>
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-black hover:bg-yellow-400 transition-colors"
            >
              LER CRÍTICA COMPLETA
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

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
              <h3 className="text-3xl font-black">CRÍTICAS RECENTES</h3>
            </div>
            <Link to="/reviews" className="flex items-center gap-2 font-black hover:text-blue-500 transition-colors">
              VER TUDO
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickReviews.map((review) => (
              <Link
                key={review.id}
                to="/reviews"
                className="group bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.25)] transition-shadow"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-neutral-800">
                  <ImageWithFallback
                    src={review.image}
                    alt={review.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                </div>
                <div className="p-6">
                  <h4 className="font-black text-lg">{review.title}</h4>
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