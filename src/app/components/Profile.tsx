import { Star, Users, Film, Edit2, Heart, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useUser } from "../contexts/UserContext";
import { EditProfileModal } from "./EditProfileModal";
import { SelectMoviesModal } from "./SelectMoviesModal";
import { SelectFriendsModal } from "./SelectFriendsModal";
import { CreateReviewModal } from "./CreateReviewModal";
import { useState } from "react";
import { Link } from "react-router";

export function Profile() {
  const { userProfile, friends, favoriteMovies, reviews } = useUser();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [selectMoviesOpen, setSelectMoviesOpen] = useState(false);
  const [selectFriendsOpen, setSelectFriendsOpen] = useState(false);
  const [createReviewOpen, setCreateReviewOpen] = useState(false);

  // Filter reviews created by current user
  const myReviews = reviews.filter(
    (review) => review.authorUsername === userProfile.username
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Cover & Profile Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 sm:h-64 bg-gradient-to-r from-blue-500 via-yellow-400 to-orange-500 relative overflow-hidden">
          <ImageWithFallback
            src={userProfile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        {/* Profile Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 border-8 border-white bg-gray-100 overflow-hidden">
                  <ImageWithFallback
                    src={userProfile.profileImage}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 w-12 h-12 border-4 border-white flex items-center justify-center">
                  <Star className="w-6 h-6 fill-black text-black" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 bg-white border-4 border-black p-6 mt-4 sm:mt-12">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black mb-1">{userProfile.name}</h1>
                    <p className="text-gray-600 mb-3">{userProfile.username}</p>
                    <p className="text-gray-700 max-w-xl">{userProfile.bio}</p>
                  </div>
                  <button
                    className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 font-black hover:bg-blue-600 transition-colors whitespace-nowrap"
                    onClick={() => setEditProfileOpen(true)}
                  >
                    <Edit2 className="w-4 h-4" />
                    EDITAR PERFIL
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-black">
                  <div className="text-center">
                    <div className="text-3xl font-black text-blue-500">{userProfile.stats.reviews}</div>
                    <div className="text-sm font-bold text-gray-600">CRÍTICAS</div>
                  </div>
                  <div className="text-center border-x-2 border-black">
                    <div className="text-3xl font-black text-yellow-500">{userProfile.stats.friends}</div>
                    <div className="text-sm font-bold text-gray-600">AMIGOS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-orange-500">{userProfile.stats.favorites}</div>
                    <div className="text-sm font-bold text-gray-600">FAVORITOS</div>
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
                <h2 className="text-3xl font-black">MINHAS CRÍTICAS</h2>
                <button
                  className="ml-2 bg-black text-white px-3 py-1 font-black hover:bg-gray-800 transition-colors"
                  onClick={() => setCreateReviewOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {myReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white border-4 border-black p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-black">{review.title}</h3>
                          <div className="bg-blue-500 text-white px-3 py-1 font-black text-sm">
                            {review.rating}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{review.date}</span>
                          <span>•</span>
                          <span className="font-bold">{review.category}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.excerpt}</p>
                  </div>
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
                  className="ml-2 bg-black text-white px-3 py-1 font-black hover:bg-gray-800 transition-colors"
                  onClick={() => setSelectMoviesOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {favoriteMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-white border-4 border-black overflow-hidden hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow group"
                  >
                    <div className="relative h-40 bg-gray-100 overflow-hidden">
                      <ImageWithFallback
                        src={movie.image}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 right-2 bg-yellow-400 w-8 h-8 border-2 border-black flex items-center justify-center">
                        <Heart className="w-4 h-4 fill-black text-black" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-black text-sm mb-1 line-clamp-1">{movie.title}</h3>
                      <p className="text-xs text-gray-600">{movie.year}</p>
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
                  className="ml-2 bg-black text-white px-3 py-1 font-black hover:bg-gray-800 transition-colors"
                  onClick={() => setSelectFriendsOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="bg-white border-4 border-black p-4 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow flex items-center gap-3"
                  >
                    <div className="w-14 h-14 border-2 border-black bg-gray-100 overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={friend.image}
                        alt={friend.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-sm truncate">{friend.name}</h3>
                      <p className="text-xs text-gray-600 truncate">{friend.username}</p>
                    </div>
                  </div>
                ))}
                <button className="w-full bg-black text-white py-3 font-black hover:bg-gray-800 transition-colors">
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