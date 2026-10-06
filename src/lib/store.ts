// Central localStorage store — single source of truth for all app data

export interface UserProfile {
  name: string;
  username: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  stats: {
    reviews: number;
    friends: number;
    favorites: number;
  };
}

export interface Friend {
  id: number;
  name: string;
  username: string;
  image: string;
}

export interface FavoriteMovie {
  id: number;
  title: string;
  year: string;
  image: string;
}

export interface StoredUser {
  id: string;
  username: string;
  password: string;
  profile: UserProfile;
  friends: Friend[];
  favoriteMovies: FavoriteMovie[];
  createdAt: string;
}

export interface Review {
  id: string;
  title: string;
  subtitle: string;
  rating: number;
  date: string;
  excerpt: string;
  fullContent: string;
  category: string;
  image: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorImage: string;
  likes: string[]; // user IDs
}

export interface Comment {
  id: string;
  reviewId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorImage: string;
  date: string;
  likes: string[]; // user IDs
  parentId?: string; // for nested replies
}

const K = {
  USERS: "tf_users",
  REVIEWS: "tf_reviews",
  COMMENTS: "tf_comments",
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, val: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // storage quota or private mode
  }
}

let _seq = 0;
export function genId(): string {
  return `${Date.now().toString(36)}-${(++_seq).toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

// ─── Seed reviews ─────────────────────────────────────────────────────────────

const SEED_REVIEWS: Review[] = [
  {
    id: "seed-1",
    title: "A Viagem de Chihiro",
    subtitle: "Uma obra-prima atemporal de Hayao Miyazaki",
    rating: 5,
    date: "2026-01-10T12:00:00Z",
    excerpt:
      "Um dos maiores filmes de animação já criados — uma jornada espiritual que transcende gerações e culturas.",
    fullContent: `A Viagem de Chihiro é, sem dúvida, uma das obras mais importantes da animação mundial. Lançado em 2001, o filme de Hayao Miyazaki acompanha a jovem Chihiro em uma aventura no mundo dos espíritos após seus pais serem transformados em porcos.

O que impressiona desde o primeiro frame é a riqueza visual: cada detalhe do mundo espiritual é cuidadosamente elaborado, criando um universo com sua própria lógica e beleza inigualável.

A protagonista Chihiro é um dos arcos de crescimento mais bem executados da história do cinema — ela vai de uma criança assustada e dependente para uma jovem corajosa e autossuficiente, sem que essa transformação jamais pareça forçada.

A trilha sonora de Joe Hisaishi complementa perfeitamente as imagens, criando momentos de pura magia audiovisual. O filme venceu o Oscar de Melhor Animação em 2003 e continua sendo uma referência absoluta do gênero.`,
    category: "Longa-Metragem",
    image:
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80",
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
  },
  {
    id: "seed-2",
    title: "Attack on Titan: The Final Season",
    subtitle: "Um desfecho épico que redefiniu o anime moderno",
    rating: 4.5,
    date: "2026-01-25T12:00:00Z",
    excerpt:
      "A temporada final de AoT eleva o bar narrativo do anime com conflitos morais complexos e animação impecável.",
    fullContent: `Attack on Titan: The Final Season é o encerramento de uma das séries de anime mais impactantes já produzidas. O que começou como um thriller de sobrevivência evoluiu para uma exploração complexa de guerra, liberdade e o ciclo de ódio entre civilizações.

A animação do estúdio MAPPA representa uma mudança significativa em relação ao WIT Studio, mas elevou ainda mais a qualidade visual da série. As sequências de ação são simplesmente espetaculares.

Narrativamente, esta temporada é onde a série realmente se torna literatura. Eren Yaeger, outrora o herói idealista, se transforma em algo muito mais complexo — uma figura cujas motivações são compreensíveis mesmo quando suas ações são indefensáveis.

A forma como a série lida com temas de geopolítica e trauma geracional a coloca em um patamar diferente de praticamente toda a mídia de animação atual.`,
    category: "Anime",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
  },
  {
    id: "seed-3",
    title: "Spider-Man: Across the Spider-Verse",
    subtitle: "Uma revolução visual que redefine a animação ocidental",
    rating: 5,
    date: "2026-02-08T12:00:00Z",
    excerpt:
      "Across the Spider-Verse não é apenas um grande filme de animação — é um dos maiores filmes já feitos, ponto.",
    fullContent: `Spider-Man: Across the Spider-Verse é, em todos os aspectos, uma obra revolucionária. A Sony Pictures Animation tomou tudo que tornou o primeiro filme extraordinário e multiplicou por dez.

A linguagem visual do filme é absolutamente sem precedentes no cinema. Cada universo tem seu próprio estilo artístico — do pontilhismo do mundo de Spot ao estilo de mangá japonês do Spider-Man de Mumbai.

Miles Morales continua sendo um dos heróis mais bem escritos do cinema de super-heróis. Sua jornada de autodescoberta e o conflito com a ideia de "destino" toca em algo profundamente humano.

A decisão narrativa de terminar em cliffhanger foi corajosa e funcionou perfeitamente. Across the Spider-Verse elevou o padrão para toda a indústria de animação.`,
    category: "Longa-Metragem",
    image:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&q=80",
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
  },
  {
    id: "seed-4",
    title: "Arcane — Season 1",
    subtitle: "Uma adaptação que superou todas as expectativas",
    rating: 5,
    date: "2026-02-15T12:00:00Z",
    excerpt:
      "Arcane redefiniu o que uma série de animação baseada em videogame pode ser — emocionante, bela e profundamente humana.",
    fullContent: `Arcane, a série da Netflix baseada no universo de League of Legends, chegou em 2021 e imediatamente se tornou um marco na animação ocidental.

A primeira temporada acompanha a história das irmãs Vi e Jinx em Piltover e Zaun — duas cidades divididas por política e classe social. O que poderia ser uma simples aventura de fantasia se transforma numa exploração devastante de trauma familiar, lealdade e as consequências do progresso sem ética.

A animação do estúdio Fortiche é simplesmente extraordinária. A série mistura técnicas 2D e 3D de forma orgânica, criando uma estética única que parece uma pintura em movimento.

A trilha sonora, com participações de Imagine Dragons e outras artistas, serve como cola emocional perfeita para a narrativa. Arcane provou que adaptações de jogos podem — e devem — ser arte.`,
    category: "Série",
    image:
      "https://images.unsplash.com/photo-1615812214207-34e3be6812df?w=800&q=80",
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
  },
];

// ─── User store ───────────────────────────────────────────────────────────────

export const userStore = {
  getAll(): StoredUser[] {
    return load<StoredUser[]>(K.USERS, []);
  },

  findByUsername(username: string): StoredUser | null {
    return (
      this.getAll().find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      ) ?? null
    );
  },

  findById(id: string): StoredUser | null {
    return this.getAll().find((u) => u.id === id) ?? null;
  },

  create(username: string, password: string, extra?: Partial<UserProfile>): StoredUser {
    const users = this.getAll();
    const user: StoredUser = {
      id: genId(),
      username,
      password,
      profile: {
        name: extra?.name || username,
        username,
        bio: extra?.bio || "",
        profileImage: extra?.profileImage || "",
        coverImage: extra?.coverImage || "",
        stats: { reviews: 0, friends: 0, favorites: 0 },
      },
      friends: [],
      favoriteMovies: [],
      createdAt: new Date().toISOString(),
    };
    save(K.USERS, [...users, user]);
    return user;
  },

  update(id: string, partial: Partial<StoredUser>): StoredUser | null {
    const users = this.getAll();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...partial };
    save(K.USERS, users);
    return users[idx];
  },
};

// ─── Review store ─────────────────────────────────────────────────────────────

export const reviewStore = {
  getAll(): Review[] {
    const raw = localStorage.getItem(K.REVIEWS);
    if (!raw) {
      save(K.REVIEWS, SEED_REVIEWS);
      return SEED_REVIEWS;
    }
    try {
      return JSON.parse(raw) as Review[];
    } catch {
      return SEED_REVIEWS;
    }
  },

  getByUser(authorId: string): Review[] {
    return this.getAll().filter((r) => r.authorId === authorId);
  },

  getById(id: string): Review | null {
    return this.getAll().find((r) => r.id === id) ?? null;
  },

  create(review: Omit<Review, "id" | "date" | "likes">): Review {
    const all = this.getAll();
    const created: Review = {
      ...review,
      id: genId(),
      date: new Date().toISOString(),
      likes: [],
    };
    save(K.REVIEWS, [...all, created]);
    return created;
  },

  toggleLike(reviewId: string, userId: string): Review | null {
    const all = this.getAll();
    const idx = all.findIndex((r) => r.id === reviewId);
    if (idx === -1) return null;
    const r = all[idx];
    all[idx] = {
      ...r,
      likes: r.likes.includes(userId)
        ? r.likes.filter((id) => id !== userId)
        : [...r.likes, userId],
    };
    save(K.REVIEWS, all);
    return all[idx];
  },
};

// ─── Comment store ────────────────────────────────────────────────────────────

export const commentStore = {
  getAll(): Comment[] {
    return load<Comment[]>(K.COMMENTS, []);
  },

  getByReview(reviewId: string): Comment[] {
    return this.getAll().filter((c) => c.reviewId === reviewId);
  },

  create(comment: Omit<Comment, "id" | "date" | "likes">): Comment {
    const all = this.getAll();
    const created: Comment = {
      ...comment,
      id: genId(),
      date: new Date().toISOString(),
      likes: [],
    };
    save(K.COMMENTS, [...all, created]);
    return created;
  },

  toggleLike(commentId: string, userId: string): Comment | null {
    const all = this.getAll();
    const idx = all.findIndex((c) => c.id === commentId);
    if (idx === -1) return null;
    const c = all[idx];
    all[idx] = {
      ...c,
      likes: c.likes.includes(userId)
        ? c.likes.filter((id) => id !== userId)
        : [...c.likes, userId],
    };
    save(K.COMMENTS, all);
    return all[idx];
  },
};
