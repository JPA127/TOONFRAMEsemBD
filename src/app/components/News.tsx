import { Newspaper, Calendar, User, TrendingUp, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function News() {
  const featuredNews = {
    id: 1,
    title: "One Piece divulga trailer do Arco de Elbaf e anuncia estreia para abril de 2026",
    date: "24 Fev, 2026",
    author: "Jessica Park",
    category: "Anime Shounen",
    excerpt: "One Piece divulgou o primeiro trailer do aguardado Arco de Elbaf, revelando cenas inéditas, novos desafios e a tão esperada chegada à terra dos gigantes. A prévia já movimenta os fãs com promessas de batalhas épicas e grandes revelações, e a estreia está marcada para abril de 2026.",
    image: "https://onpoplife.com.br/wp-content/uploads/2025/12/one-piece-capa.jpg",
    accentColor: "orange",
  };

  const newsArticles = [
    {
      id: 2,
      title: "Nova Tecnologia de IA Transforma Pipeline de Animação",
      date: "23 Fev, 2026",
      author: "Tom Richardson",
      category: "Tecnologia",
      excerpt: "Ferramentas revolucionárias de IA estão mudando a forma como animadores trabalham, reduzindo o tempo de produção mantendo a integridade artística.",
      accentColor: "blue",
      trending: true,
    },
    {
      id: 3,
      title: "Temporada de Prêmios: Animação Domina",
      date: "22 Fev, 2026",
      author: "Maria Lopez",
      category: "Prêmios",
      excerpt: "Longas e séries de animação dominam categorias principais, marcando um ano histórico para o meio.",
      accentColor: "yellow",
      trending: true,
    },
    {
      id: 4,
      title: "Studio Ghibli Anuncia Novo Longa-Metragem",
      date: "21 Fev, 2026",
      author: "Kenji Yamamoto",
      category: "Produção",
      excerpt: "O lendário estúdio revela detalhes sobre seu próximo projeto, com lançamento previsto para o final de 2027.",
      accentColor: "orange",
      trending: false,
    },
    {
      id: 5,
      title: "Guerra do Streaming: Animação se Torna Campo de Batalha",
      date: "20 Fev, 2026",
      author: "Alex Turner",
      category: "Negócios",
      excerpt: "Principais plataformas de streaming investem bilhões em conteúdo animado original para atrair assinantes.",
      accentColor: "blue",
      trending: true,
    },
    {
      id: 6,
      title: "Animadores Independentes Encontram Sucesso nas Redes Sociais",
      date: "19 Fev, 2026",
      author: "Sophie Chen",
      category: "Cultura",
      excerpt: "Uma nova geração de criadores contorna estúdios tradicionais, construindo audiências diretamente online.",
      accentColor: "yellow",
      trending: false,
    },
    {
      id: 7,
      title: "Técnicas Clássicas de Animação Fazem Retorno",
      date: "18 Fev, 2026",
      author: "Robert Blake",
      category: "Tendências",
      excerpt: "Animação desenhada à mão e stop-motion veem ressurgimento conforme o público anseia por artesanato tradicional.",
      accentColor: "orange",
      trending: false,
    },
    {
      id: 8,
      title: "Coproduções Internacionais Atingem Novos Patamares",
      date: "17 Fev, 2026",
      author: "Nina Patel",
      category: "Indústria",
      excerpt: "Colaborações transfronteiriças estão criando projetos animados únicos que combinam perspectivas culturais.",
      accentColor: "blue",
      trending: false,
    },
    {
      id: 9,
      title: "Programas de Educação em Animação Expandem Globalmente",
      date: "16 Fev, 2026",
      author: "David Wong",
      category: "Educação",
      excerpt: "Novas escolas e programas estão treinando a próxima geração de talentos de animação em todo o mundo.",
      accentColor: "yellow",
      trending: false,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
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
          <div className="bg-white border-4 border-black overflow-hidden hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-96 lg:h-auto bg-gray-100">
                <ImageWithFallback
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 bg-orange-500 text-white px-4 py-2 font-black flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  DESTAQUE
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-block px-3 py-1 bg-black text-white text-xs font-black mb-4 self-start">
                  {featuredNews.category}
                </div>
                <h2 className="text-4xl font-black mb-4 leading-tight">{featuredNews.title}</h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">{featuredNews.excerpt}</p>
                <div className="flex items-center gap-4 text-sm font-black text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {featuredNews.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {featuredNews.author}
                  </div>
                </div>
                <button className="bg-orange-500 text-white px-8 py-4 font-black hover:bg-orange-600 transition-colors self-start">
                  LER ARTIGO COMPLETO
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-8 h-8" />
            <h3 className="text-3xl font-black">EM ALTA AGORA</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsArticles.filter(article => article.trending).map((article) => (
              <article
                key={article.id}
                className="bg-gray-50 border-4 border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group"
              >
                <div className={`h-2 bg-${article.accentColor}-500`}></div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-black text-white text-xs font-black">
                      {article.category}
                    </span>
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  </div>
                  <h3 className="text-xl font-black mb-3 group-hover:text-blue-500 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs font-black text-gray-500">
                    <span>{article.date}</span>
                    <span>{article.author.toUpperCase()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* All News */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-black mb-8">TODAS AS NOTÍCIAS</h3>
          <div className="space-y-6">
            {newsArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white border-4 border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group"
              >
                <div className={`h-2 bg-${article.accentColor}-500`}></div>
                <div className="p-6 flex items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block px-3 py-1 bg-black text-white text-xs font-black">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-black text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {article.date}
                      </div>
                    </div>
                    <h3 className="text-2xl font-black mb-3 group-hover:text-orange-500 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-700 mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-black text-gray-500">
                        <User className="w-4 h-4" />
                        {article.author}
                      </div>
                      <button className="font-black text-sm hover:text-orange-500 transition-colors">
                        LEIA MAIS →
                      </button>
                    </div>
                  </div>
                </div>
              </article>
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
