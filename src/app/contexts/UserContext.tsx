import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import type { UserProfile, Friend, FavoriteMovie, Review, Comment } from "../../lib/store";

// Re-export so existing component imports continue working
export type { UserProfile, Friend, FavoriteMovie, Review, Comment };

interface UserContextType {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  friends: Friend[];
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: number) => void;
  favoriteMovies: FavoriteMovie[];
  addFavoriteMovie: (movie: FavoriteMovie) => void;
  removeFavoriteMovie: (movieId: number) => void;
  reviews: Review[];
  addReview: (
    review: Omit<Review, "id" | "authorName" | "authorUsername" | "authorImage" | "date" | "likes">
  ) => void;
  comments: Comment[];
  addComment: (reviewId: string, content: string, parentId?: string) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments] = useState<Comment[]>([]);

  const userProfile: UserProfile = auth.currentProfile?.profile ?? {
    name: "Usuário",
    username: "usuario",
    bio: "",
    profileImage: "",
    coverImage: "",
    stats: { reviews: 0, friends: 0, favorites: 0 },
  };

  const friends = auth.currentProfile?.friends ?? [];
  const favoriteMovies = auth.currentProfile?.favoriteMovies ?? [];

  useEffect(() => {
    if (auth.isLoggedIn && auth.currentProfile) {
      auth.getUserReviews().then(setReviews);
    } else {
      setReviews([]);
    }
  }, [auth.isLoggedIn, auth.currentProfile?.id]);

  return (
    <UserContext.Provider
      value={{
        userProfile,
        updateProfile: auth.updateCurrentProfile,
        friends,
        addFriend: auth.addFriend,
        removeFriend: auth.removeFriend,
        favoriteMovies,
        addFavoriteMovie: auth.addFavoriteMovie,
        removeFavoriteMovie: auth.removeFavoriteMovie,
        reviews,
        addReview: auth.addReview,
        comments,
        addComment: auth.addComment,
        isLoggedIn: auth.isLoggedIn,
        login: () => {},
        logout: auth.logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
