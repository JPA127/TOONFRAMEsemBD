import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Star, ArrowRight, ChevronLeft, ChevronRight, Pause, Play, MessageSquare } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Review, isDiscussion } from "../../lib/store";

const AUTOPLAY_MS = 6000;

// Carrossel de publicações em destaque (estilo carrossel do Instagram):
// desliza com o dedo/mouse, tem pontinhos, contador, setas e avança sozinho.
export function FeaturedCarousel({ posts }: { posts: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const reduceMotion =
    typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [userPaused, setUserPaused] = useState(reduceMotion); // quem pede menos animação começa pausado
  const [hovering, setHovering] = useState(false);
  const [focusing, setFocusing] = useState(false);

  const total = posts.length;
  const playing = !userPaused && !hovering && !focusing && total > 1;

  const currentIndex = () => {
    const el = trackRef.current;
    return el && el.clientWidth ? Math.round(el.scrollLeft / el.clientWidth) : 0;
  };

  const goTo = useCallback(
    (i: number, smooth = true) => {
      const el = trackRef.current;
      if (!el || total === 0) return;
      const target = ((i % total) + total) % total;
      el.scrollTo({ left: target * el.clientWidth, behavior: smooth && !reduceMotion ? "smooth" : "auto" });
      setIndex(target);
    },
    [total, reduceMotion]
  );

  // avanço automático
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => goTo(currentIndex() + 1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [playing, goTo]);

  // mantém o slide atual alinhado se a janela mudar de tamanho
  useEffect(() => {
    const onResize = () => goTo(currentIndex(), false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [goTo]);

  const handleScroll = () => {
    const i = currentIndex();
    if (i !== index) setIndex(i);
  };

  if (total === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Publicações em destaque"
      className="relative bg-black text-white overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocusing(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusing(false);
      }}
      onTouchStart={() => setHovering(true)}
      onTouchEnd={() => window.setTimeout(() => setHovering(false), 4000)}
    >
      {/* Slides */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        aria-live={playing ? "off" : "polite"}
        className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post, i) => {
          const discussion = isDiscussion(post);
          const active = i === index;
          return (
            <div
              key={post.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${total}`}
              aria-hidden={!active}
              className="relative min-w-full flex-shrink-0 snap-center"
            >
              {post.image ? (
                <ImageWithFallback
                  src={post.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10"></div>

              <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 sm:py-24 min-h-[28rem] sm:min-h-[32rem] flex items-center">
                <div className="max-w-2xl">
                  <div className="inline-block bg-yellow-400 text-black px-4 py-1 mb-4">
                    <span className="font-black text-sm">PUBLICAÇÕES EM DESTAQUE</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black mb-4 leading-tight">{post.title}</h2>
                  <p className="text-base sm:text-xl text-gray-300 mb-6 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center gap-4 sm:gap-6 mb-8 flex-wrap">
                    {discussion ? (
                      <div className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 font-black">
                        <MessageSquare className="w-5 h-5" aria-hidden="true" />
                        DISCUSSÃO
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-blue-500 dark:bg-blue-600 px-4 py-2">
                        <Star className="w-6 h-6 fill-white" aria-hidden="true" />
                        <span className="text-2xl font-black">{post.rating}</span>
                      </div>
                    )}
                    <span className="text-gray-300">{post.category}</span>
                  </div>
                  <Link
                    to={`/reviews/${post.id}`}
                    tabIndex={active ? 0 : -1}
                    className="inline-flex items-center gap-2 bg-white text-black px-6 sm:px-8 py-4 font-black hover:bg-yellow-400 transition-colors"
                  >
                    {discussion ? "LER DISCUSSÃO COMPLETA" : "LER CRÍTICA COMPLETA"}
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <>
          {/* contador, como no Instagram */}
          <div
            aria-hidden="true"
            className="absolute top-4 right-4 z-30 bg-black/70 text-white text-xs font-black px-3 py-1 rounded-full border border-white/40"
          >
            {index + 1}/{total}
          </div>

          {/* setas (telas grandes; no celular, desliza-se com o dedo) */}
          <button
            type="button"
            onClick={() => goTo(currentIndex() - 1)}
            aria-label="Publicação anterior"
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-4 z-30 w-12 h-12 items-center justify-center bg-black/60 hover:bg-black text-white border-2 border-white/70 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(currentIndex() + 1)}
            aria-label="Próxima publicação"
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-4 z-30 w-12 h-12 items-center justify-center bg-black/60 hover:bg-black text-white border-2 border-white/70 transition-colors"
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* pontinhos */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center">
            {posts.map((post, i) => (
              <button
                key={post.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir para a publicação ${i + 1} de ${total}`}
                aria-current={i === index}
                className="p-2"
              >
                <span
                  className={`block rounded-full transition-all ${
                    i === index ? "w-6 h-2.5 bg-yellow-400" : "w-2.5 h-2.5 bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* pausar / retomar a troca automática */}
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Retomar a troca automática" : "Pausar a troca automática"}
            className="absolute bottom-2 right-4 z-30 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-black text-white border-2 border-white/70 transition-colors"
          >
            {userPaused ? <Play className="w-4 h-4" aria-hidden="true" /> : <Pause className="w-4 h-4" aria-hidden="true" />}
          </button>
        </>
      )}
    </section>
  );
}
