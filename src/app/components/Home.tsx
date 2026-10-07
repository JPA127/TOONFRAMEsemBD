import { Link } from "react-router";
import { Star, ArrowRight, TrendingUp, Award } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
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

  const latestNews = [
    {
      id: 1,
      title: "Nova Tecnologia de Animação Revoluciona Taxa de Quadros",
      date: "24 Fev, 2026",
      category: "Tecnologia",
      accent: "blue",
    },
    {
      id: 2,
      title: "Temporada de Prêmios: Animações Dominam Indicações",
      date: "23 Fev, 2026",
      category: "Prêmios",
      accent: "yellow",
    },
    {
      id: 3,
      title: "Animadores Independentes em Ascensão na Era do Streaming",
      date: "22 Fev, 2026",
      category: "Indústria",
      accent: "orange",
    },
  ];

  const quickReviews = [
    {
      id: 2,
      title: "Expectativas para Super Mario Galaxy?",
      rating: 8.7,
      image: animatedCharacter,
    },
    {
      id: 3,
      title: "Por que 'Guerreiras do K-pop' fez tanto sucesso?",
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
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10"></div>
        <ImageWithFallback
          src={featuredReview.image}
          alt="Featured review"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <div className="inline-block bg-yellow-400 text-black px-4 py-1 mb-4"><span className="font-black text-sm">CRÍTICA EM DESTAQUE</span></div>
            <h2 className="text-5xl font-black mb-4 leading-tight">{featuredReview.title}</h2>
            <p className="text-xl text-gray-300 mb-6">{featuredReview.excerpt}</p>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-blue-500 px-4 py-2">
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
      <section className="py-16 bg-gray-50">
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
              <div key={news.id} className="bg-white border-4 border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                <div className={`h-2 bg-${news.accent}-500`}></div>
                <div className="p-6">
                  <div className="text-xs font-black mb-2 text-gray-500">{news.date}</div>
                  <div className={`inline-block px-3 py-1 bg-${news.accent}-500 text-white text-xs font-black mb-3`}>
                    {news.category}
                  </div>
                  <h4 className="font-black text-lg mb-2">{news.title}</h4>
                  <Link to="/news" className="text-sm font-black hover:underline">
                    LEIA MAIS →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="py-16 bg-white">
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
                className="group bg-white border-4 border-black overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
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
              className="bg-blue-500 text-white px-8 py-4 font-black hover:bg-blue-600 transition-colors"
            >
              EXPLORAR CRÍTICAS
            </Link>
            <Link
              to="/news"
              className="bg-orange-500 text-white px-8 py-4 font-black hover:bg-orange-600 transition-colors"
            >
              LER NOTÍCIAS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}