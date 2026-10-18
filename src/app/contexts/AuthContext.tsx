import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  userStore,
  reviewStore,
  commentStore,
  StoredUser,
  UserProfile,
  Friend,
  FavoriteMovie,
  Review,
  Comment,
} from "../../lib/store";

export interface StoredProfile {
  id: string;
  username: string;
  profile: UserProfile;
  friends: Friend[];
  favoriteMovies: FavoriteMovie[];
  createdAt?: string;
}

interface AuthContextType {
  currentProfile: StoredProfile | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string, extra?: Partial<UserProfile>) => Promise<boolean>;
  updateCurrentProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addFriend: (friend: Friend) => Promise<void>;
  removeFriend: (friendId: number) => Promise<void>;
  addFavoriteMovie: (movie: FavoriteMovie) => Promise<void>;
  removeFavoriteMovie: (movieId: number) => Promise<void>;
  addReview: (
    review: Omit<Review, "id" | "authorName" | "authorUsername" | "authorImage" | "date" | "likes">
  ) => Promise<void>;
  addComment: (reviewId: string, content: string, parentId?: string) => Promise<void>;
  getAllReviews: () => Promise<Review[]>;
  getAllComments: (reviewId: string) => Promise<Comment[]>;
  getUserReviews: () => Promise<Review[]>;
  toggleReviewLike: (reviewId: string) => Review | null;
  toggleCommentLike: (commentId: string) => Comment | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "toonframe_session";

function toStoredProfile(user: StoredUser): StoredProfile {
  return {
    id: user.id,
    username: user.username,
    profile: user.profile,
    friends: user.friends,
    favoriteMovies: user.favoriteMovies,
    createdAt: user.createdAt,
  };
}

function readSession(): StoredProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as { id: string };
    const user = userStore.findById(session.id);
    return user ? toStoredProfile(user) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // A sessão é lida do localStorage já na primeira renderização,
  // assim a página não redireciona para o login ao recarregar (F5).
  const [currentProfile, setCurrentProfile] = useState<StoredProfile | null>(readSession);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => currentProfile !== null);
  const loading = false;

  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ id: currentProfile.id }));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [currentProfile]);

  const refreshProfile = (id: string) => {
    const user = userStore.findById(id);
    if (user) setCurrentProfile(toStoredProfile(user));
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    const user = userStore.findByUsername(username);
    if (!user || user.password !== password) {
      throw new Error("Nome de usuário ou senha incorretos");
    }
    setCurrentProfile(toStoredProfile(user));
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => {
    setCurrentProfile(null);
    setIsLoggedIn(false);
  };

  const register = async (
    username: string,
    password: string,
    extra?: Partial<UserProfile>
  ): Promise<boolean> => {
    const existing = userStore.findByUsername(username);
    if (existing) throw new Error("Nome de usuário já está em uso");
    const user = userStore.create(username, password, extra);
    setCurrentProfile(toStoredProfile(user));
    setIsLoggedIn(true);
    return true;
  };

  const updateCurrentProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!currentProfile) return;
    userStore.update(currentProfile.id, {
      profile: { ...currentProfile.profile, ...updates },
    });
    refreshProfile(currentProfile.id);
  };

  const addFriend = async (friend: Friend): Promise<void> => {
    if (!currentProfile) return;
    const friends = [...currentProfile.friends, friend];
    userStore.update(currentProfile.id, {
      friends,
      profile: {
        ...currentProfile.profile,
        stats: { ...currentProfile.profile.stats, friends: friends.length },
      },
    });
    refreshProfile(currentProfile.id);
  };

  const removeFriend = async (friendId: number): Promise<void> => {
    if (!currentProfile) return;
    const friends = currentProfile.friends.filter((f) => f.id !== friendId);
    userStore.update(currentProfile.id, {
      friends,
      profile: {
        ...currentProfile.profile,
        stats: { ...currentProfile.profile.stats, friends: friends.length },
      },
    });
    refreshProfile(currentProfile.id);
  };

  const addFavoriteMovie = async (movie: FavoriteMovie): Promise<void> => {
    if (!currentProfile) return;
    const favoriteMovies = [...currentProfile.favoriteMovies, movie];
    userStore.update(currentProfile.id, {
      favoriteMovies,
      profile: {
        ...currentProfile.profile,
        stats: { ...currentProfile.profile.stats, favorites: favoriteMovies.length },
      },
    });
    refreshProfile(currentProfile.id);
  };

  const removeFavoriteMovie = async (movieId: number): Promise<void> => {
    if (!currentProfile) return;
    const favoriteMovies = currentProfile.favoriteMovies.filter((m) => m.id !== movieId);
    userStore.update(currentProfile.id, {
      favoriteMovies,
      profile: {
        ...currentProfile.profile,
        stats: { ...currentProfile.profile.stats, favorites: favoriteMovies.length },
      },
    });
    refreshProfile(currentProfile.id);
  };

  const addReview = async (
    review: Omit<Review, "id" | "authorName" | "authorUsername" | "authorImage" | "date" | "likes">
  ): Promise<void> => {
    if (!currentProfile) return;
    reviewStore.create({
      ...review,
      authorId: currentProfile.id,
      authorName: currentProfile.profile.name,
      authorUsername: currentProfile.username,
      authorImage: currentProfile.profile.profileImage,
    });
    const newCount = currentProfile.profile.stats.reviews + 1;
    userStore.update(currentProfile.id, {
      profile: {
        ...currentProfile.profile,
        stats: { ...currentProfile.profile.stats, reviews: newCount },
      },
    });
    refreshProfile(currentProfile.id);
  };

  const addComment = async (
    reviewId: string,
    content: string,
    parentId?: string
  ): Promise<void> => {
    if (!currentProfile) return;
    commentStore.create({
      reviewId,
      content,
      authorId: currentProfile.id,
      authorName: currentProfile.profile.name,
      authorUsername: currentProfile.username,
      authorImage: currentProfile.profile.profileImage,
      parentId,
    });
  };

  const getAllReviews = async (): Promise<Review[]> => reviewStore.getAll();

  const getAllComments = async (reviewId: string): Promise<Comment[]> =>
    commentStore.getByReview(reviewId);

  const getUserReviews = async (): Promise<Review[]> => {
    if (!currentProfile) return [];
    return reviewStore.getByUser(currentProfile.id);
  };

  const toggleReviewLike = (reviewId: string): Review | null => {
    if (!currentProfile) return null;
    return reviewStore.toggleLike(reviewId, currentProfile.id);
  };

  const toggleCommentLike = (commentId: string): Comment | null => {
    if (!currentProfile) return null;
    return commentStore.toggleLike(commentId, currentProfile.id);
  };

  return (
    <AuthContext.Provider
      value={{
        currentProfile,
        isLoggedIn,
        loading,
        login,
        logout,
        register,
        updateCurrentProfile,
        addFriend,
        removeFriend,
        addFavoriteMovie,
        removeFavoriteMovie,
        addReview,
        addComment,
        getAllReviews,
        getAllComments,
        getUserReviews,
        toggleReviewLike,
        toggleCommentLike,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
