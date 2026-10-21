import { Star, Users, Heart, ArrowLeft, MessageSquare } from "lucide-react";
import { Link, Navigate, useParams } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";
import { userStore, reviewStore, isDiscussion } from "../../lib/store";

// Página pública (somente leitura) do perfil de outra pessoa: /user/<usuário>
export function PublicProfile() {
  const { username = "" } = useParams();
  const { currentProfile } = useAuth();
  const user = userStore.findByUsername(username);

  // o próprio perfil abre na página "Perfil" (com edição)
  if (user && currentProfile && currentProfile.username.toLowerCase() === user.username.toLowerCase()) {
    return <Navigate to="/profile" replace />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">PERFIL NÃO ENCONTRADO</h1>
          <Link
            to="/reviews"
            className="inline-block bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 font-black hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors border-4 border-black dark:border-neutral-400"
          >
            VOLTAR PARA CRÍTICAS
          </Link>
        </div>
      </div>
    );
  }

  const { profile, friends, favoriteMovies } = user;
  const posts = reviewStore.getByUser(user.id);

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen">
      {/* Cover & Profile Section */}
      <div className="relative">
        <div className="h-48 sm:h-64 bg-gray-200 dark:bg-neutral-800 relative overflow-hidden">
          <ImageWithFallback
            src={profile.coverImage}
            alt="Capa do perfil"
            className="w-full h-full object-cover"
          />
          <Link
            to="/reviews"
            className="absolute top-4 left-4 inline-flex items-center gap-2 bg-white/90 text-black px-4 py-2 font-black border-2 border-black hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            VOLTAR
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 border-8 border-white dark:border-neutral-950 bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                  <ImageWithFallback
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 w-12 h-12 border-4 border-white dark:border-neutral-950 flex items-center justify-center dark:text-black">
                  <Star className="w-6 h-6 fill-black text-black" aria-hidden="true" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0 bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 p-6 mt-4 sm:mt-12">
                <h1 className="text-3xl font-black mb-1 break-words">{profile.name}</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-3 break-all">@{profile.username}</p>
                {profile.bio && (
                  <p className="text-gray-700 dark:text-gray-200 max-w-xl whitespace-pre-line">{profile.bio}</p>
                )}

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-black dark:border-neutral-400">
                  <div className="text-center">
                    <div className="text-3xl font-black text-blue-500 dark:text-blue-400">{profile.stats.reviews}</div>
                    <div className="text-sm font-bold text-gray-600 dark:text-gray-300">PUBLICAÇÕES</div>
                  </div>
                  <div className="text-center border-x-2 border-black dark:border-neutral-400">
                    <div className="text-3xl font-black text-yellow-500">{profile.stats.friends}</div>
                    <div className="text-sm font-bold text-gray-600 dark:text-gray-300">AMIGOS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-orange-500">{profile.stats.favorites}</div>
                    <div className="text-sm font-bold text-gray-600 dark:text-gray-300">FAVORITOS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Publicações */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-8 h-8" aria-hidden="true" />
                <h2 className="text-3xl font-black">PUBLICAÇÕES</h2>
              </div>
              {posts.length === 0 ? (
                <p className="border-4 border-dashed border-gray-300 dark:border-neutral-600 p-6 font-bold text-gray-600 dark:text-gray-300">
                  Ainda não publicou nada.
                </p>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/reviews/${post.id}`}
                      className="block bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.25)] transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-black">{post.title}</h3>
                        {isDiscussion(post) ? (
                          <div className="bg-yellow-400 text-black px-3 py-1 font-black text-sm flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" aria-hidden="true" />
                            DISCUSSÃO
                          </div>
                        ) : (
                          <div className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 font-black text-sm">
                            {post.rating}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <span>{new Date(post.date).toLocaleDateString("pt-BR")}</span>
                        <span aria-hidden="true">•</span>
                        <span className="font-bold">{post.category}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-200">{post.excerpt}</p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-7 h-7" aria-hidden="true" />
                <h2 className="text-2xl font-black">OBRAS FAVORITAS</h2>
              </div>
              {favoriteMovies.length === 0 ? (
                <p className="border-4 border-dashed border-gray-300 dark:border-neutral-600 p-6 font-bold text-gray-600 dark:text-gray-300">
                  Nenhuma obra favorita ainda.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {favoriteMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 overflow-hidden"
                    >
                      <div className="relative h-40 bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                        <ImageWithFallback
                          src={movie.image}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-yellow-400 w-8 h-8 border-2 border-black dark:border-neutral-400 flex items-center justify-center dark:text-black">
                          <Heart className="w-4 h-4 fill-black text-black" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-black text-sm mb-1 line-clamp-1">{movie.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{movie.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-7 h-7" aria-hidden="true" />
                <h2 className="text-2xl font-black">AMIGOS</h2>
              </div>
              {friends.length === 0 ? (
                <p className="border-4 border-dashed border-gray-300 dark:border-neutral-600 p-6 font-bold text-gray-600 dark:text-gray-300">
                  Ainda não adicionou amigos.
                </p>
              ) : (
                <div className="space-y-3">
                  {friends.map((friend) => {
                    const friendUser = userStore.findByUsername(friend.username.replace(/^@/, ""));
                    const content = (
                      <>
                        <div className="w-14 h-14 border-2 border-black dark:border-neutral-400 bg-gray-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                          <ImageWithFallback src={friend.image} alt={friend.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-sm truncate">{friend.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{friend.username}</p>
                        </div>
                      </>
                    );
                    const cardClass =
                      "flex items-center gap-4 bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 p-4";
                    return friendUser ? (
                      <Link key={friend.id} to={`/user/${friendUser.username}`} className={`${cardClass} hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors`}>
                        {content}
                      </Link>
                    ) : (
                      <div key={friend.id} className={cardClass}>
                        {content}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
