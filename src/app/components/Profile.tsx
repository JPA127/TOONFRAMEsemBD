import { Star, Users, Film, Edit2, Heart, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useUser } from "../contexts/UserContext";
import { EditProfileModal } from "./EditProfileModal";
import { SelectMoviesModal } from "./SelectMoviesModal";
import { SelectFriendsModal } from "./SelectFriendsModal";
import { CreateReviewModal } from "./CreateReviewModal";
import { isDiscussion, userStore } from "../../lib/store";
import { useState } from "react";
import { Link } from "react-router";

export function Profile() {
  const { userProfile, friends, favoriteMovies, reviews } = useUser();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [selectMoviesOpen, setSelectMoviesOpen] = useState(false);
  const [selectFriendsOpen, setSelectFriendsOpen] = useState(false);
  const [createReviewOpen, setCreateReviewOpen] = useState(false);

  // "reviews" já traz só as publicações da conta logada (por id). Não filtramos pelo nome de
  // usuário do perfil, porque ele pode ser editado e deixaria de bater com o das publicações.
  const myReviews = reviews;

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen">
      {/* Cover & Profile Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 sm:h-64 bg-gray-200 dark:bg-neutral-800 relative overflow-hidden">
          <ImageWithFallback
            src={userProfile.coverImage}
            alt="Capa do perfil"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 border-8 border-white dark:border-neutral-950 bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                  <ImageWithFallback
                    src={userProfile.profileImage}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 w-12 h-12 border-4 border-white dark:border-neutral-950 flex items-center justify-center dark:text-black">
                  <Star className="w-6 h-6 fill-black text-black" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 p-6 mt-4 sm:mt-12">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black mb-1">{userProfile.name}</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{userProfile.username}</p>
                    <p className="text-gray-700 dark:text-gray-200 max-w-xl">{userProfile.bio}</p>
                  </div>
                  <button
                    className="flex items-center gap-2 bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 font-black hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors whitespace-nowrap"
                    onClick={() => setEditProfileOpen(true)}
                  >
                    <Edit2 className="w-4 h-4" />
                    EDITAR PERFIL
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-black dark:border-neutral-400">
                  <div className="text-center">
                    <div className="text-3xl font-black text-blue-500 dark:text-blue-400">{userProfile.stats.reviews}</div>
                    <div className="text-sm font-bold text-gray-600 dark:text-gray-300">PUBLICAÇÕES</div>
                  </div>
                  <div className="text-center border-x-2 border-black dark:border-neutral-400">
                    <div className="text-3xl font-black text-yellow-500">{userProfile.stats.friends}</div>
                    <div className="text-sm font-bold text-gray-600 dark:text-gray-300">AMIGOS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-orange-500">{userProfile.stats.favorites}</div>
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Reviews */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-8 h-8" />
                <h2 className="text-3xl font-black">MINHAS PUBLICAÇÕES</h2>
                <button
                  className="ml-2 bg-black dark:bg-neutral-100 dark:text-black text-white px-3 py-1 font-black hover:bg-gray-800 dark:hover:bg-neutral-300 transition-colors"
                  onClick={() => setCreateReviewOpen(true)}
                  aria-label="Nova publicação"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {myReviews.map((review) => (
                  <Link
                    key={review.id}
                    to={`/reviews/${review.id}`}
                    className="block bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.25)] transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-black">{review.title}</h3>
                          {isDiscussion(review) ? (
                            <div className="bg-yellow-400 text-black px-3 py-1 font-black text-sm">
                              DISCUSSÃO
                            </div>
                          ) : (
                            <div className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 font-black text-sm">
                              {review.rating}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                          <span>{new Date(review.date).toLocaleDateString("pt-BR")}</span>
                          <span>•</span>
                          <span className="font-bold">{review.category}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200">{review.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Favorite Movies */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-7 h-7" />
                <h2 className="text-2xl font-black">OBRAS FAVORITAS</h2>
                <button
                  className="ml-2 bg-black dark:bg-neutral-100 dark:text-black text-white px-3 py-1 font-black hover:bg-gray-800 dark:hover:bg-neutral-300 transition-colors"
                  onClick={() => setSelectMoviesOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {favoriteMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 overflow-hidden hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.25)] transition-shadow group"
                  >
                    <div className="relative h-40 bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                      <ImageWithFallback
                        src={movie.image}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 right-2 bg-yellow-400 w-8 h-8 border-2 border-black dark:border-neutral-400 flex items-center justify-center dark:text-black">
                        <Heart className="w-4 h-4 fill-black text-black" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-black text-sm mb-1 line-clamp-1">{movie.title}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{movie.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Friends */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-7 h-7" />
                <h2 className="text-2xl font-black">AMIGOS</h2>
                <button
                  className="ml-2 bg-black dark:bg-neutral-100 dark:text-black text-white px-3 py-1 font-black hover:bg-gray-800 dark:hover:bg-neutral-300 transition-colors"
                  onClick={() => setSelectFriendsOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {friends.map((friend) => {
                  const friendUser = userStore.findByUsername(friend.username.replace(/^@/, ""));
                  const Wrapper: any = friendUser ? Link : "div";
                  const wrapperProps = friendUser ? { to: `/user/${friendUser.username}` } : {};
                  return (
                  <Wrapper
                    key={friend.id}
                    {...wrapperProps}
                    className="bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 p-4 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.25)] transition-shadow flex items-center gap-3"
                  >
                    <div className="w-14 h-14 border-2 border-black dark:border-neutral-400 bg-gray-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={friend.image}
                        alt={friend.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-sm truncate">{friend.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{friend.username}</p>
                    </div>
                  </Wrapper>
                  );
                })}
                <button className="w-full bg-black dark:bg-neutral-100 dark:text-black text-white py-3 font-black hover:bg-gray-800 dark:hover:bg-neutral-300 transition-colors">
                  VER TODOS
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
      />
      <SelectMoviesModal
        open={selectMoviesOpen}
        onOpenChange={setSelectMoviesOpen}
      />
      <SelectFriendsModal
        open={selectFriendsOpen}
        onOpenChange={setSelectFriendsOpen}
      />
      <CreateReviewModal
        open={createReviewOpen}
        onOpenChange={setCreateReviewOpen}
      />
    </div>
  );
}