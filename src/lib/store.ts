// Central localStorage store — single source of truth for all app data
// Imagens das publicações de exemplo (src/assets/reviews e src/assets/discussions).
// Para trocar uma capa, substitua o arquivo mantendo o mesmo nome.
import imgChihiro from "../assets/reviews/chihiro.jpg";
import imgAot from "../assets/reviews/attack-on-titan.jpg";
import imgSpiderVerse from "../assets/reviews/spider-verse.jpg";
import imgArcane from "../assets/reviews/arcane.jpg";
import imgYourName from "../assets/reviews/your-name.jpg";
import imgToyStory from "../assets/reviews/toy-story.jpg";
import imgAvatar from "../assets/reviews/avatar-aang.jpg";
import imgBebop from "../assets/reviews/cowboy-bebop.jpg";
import imgPaperman from "../assets/reviews/paperman.jpg";
import imgFlcl from "../assets/reviews/flcl.jpg";
import imgAbertura from "../assets/discussions/abertura-anime.jpg";
import imgLoveDeathRobots from "../assets/discussions/love-death-robots.jpg";
import imgIndicacao from "../assets/discussions/indicacao-anime.jpg";
import imgDesenho from "../assets/discussions/desenho-infancia.jpg";
import imgGhibli from "../assets/discussions/studio-ghibli.jpg";

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
  /** "review" (padrão, também para posts antigos sem este campo) ou "discussion" (sem nota) */
  type?: "review" | "discussion";
}

export type PostType = "review" | "discussion";

export const REVIEW_CATEGORIES = [
  "Longa-Metragem",
  "Série",
  "Curta-Metragem",
  "OVA",
  "Filme",
  "Anime",
  "Cartoon",
];

export const DISCUSSION_CATEGORIES = [
  "Debate",
  "Teoria",
  "Recomendação",
  "Dúvida",
  "Nostalgia",
  "Curiosidade",
];

export const isDiscussion = (post: { type?: PostType }) => post.type === "discussion";

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
  } catch (err) {
    // limite do localStorage (~5 MB) atingido ou modo privado
    console.warn(`[Toonframe] Não foi possível salvar "${key}" no localStorage.`, err);
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
    image: imgChihiro,
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
    image: imgAot,
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
    image: imgSpiderVerse,
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
    image: imgArcane,
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
  },
  {
    id: "seed-5",
    title: "Your Name",
    subtitle: "Um romance sobrenatural de tirar o fôlego",
    rating: 4.5,
    date: "2026-02-22T12:00:00Z",
    excerpt: "Entre trocas de corpo, cometas e um céu pintado à mão, o filme de Makoto Shinkai transforma uma comédia romântica em algo muito maior.",
    fullContent: "Lançado em 2016, Your Name, de Makoto Shinkai, conta a história de Mitsuha, uma jovem de uma pequena cidade do interior do Japão, e Taki, um estudante de Tóquio, que passam a trocar de corpo de forma misteriosa. O que começa como uma comédia romântica leve se transforma, aos poucos, em uma história sobre destino, memória e perda.\n\nVisualmente, o filme é um espetáculo: os céus, a luz e os detalhes das cidades ganham um acabamento quase fotográfico, marca registrada do diretor. As cenas do cometa cruzando o céu estão entre as imagens mais bonitas da animação recente.\n\nA trilha sonora da banda RADWIMPS merece destaque. As músicas entram em momentos-chave e dão ao filme um ritmo próprio, quase de videoclipe, sem perder a emoção.\n\nO segundo ato traz uma virada que muda por completo a forma como enxergamos a história, e é ali que o filme se firma. Nem tudo é perfeito: o roteiro toma alguns atalhos convenientes. Ainda assim, é uma experiência emocionante e uma ótima porta de entrada para o cinema de animação japonês.",
    category: "Longa-Metragem",
    image: imgYourName,
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
  },
  {
    id: "seed-6",
    title: "Toy Story",
    subtitle: "O filme que mudou a animação para sempre",
    rating: 4.5,
    date: "2026-03-01T12:00:00Z",
    excerpt: "Primeiro longa totalmente feito em computação gráfica, o clássico da Pixar continua sendo uma aventura divertida e cheia de coração.",
    fullContent: "Lançado em 1995, Toy Story foi o primeiro longa-metragem totalmente feito em computação gráfica e marcou o início de uma nova era para a animação. Dirigido por John Lasseter e produzido pela Pixar, o filme acompanha o caubói Woody, brinquedo favorito de Andy, que vê sua posição ameaçada com a chegada do astronauta Buzz Lightyear.\n\nMais do que a inovação técnica, o que faz o filme envelhecer bem é o roteiro: uma história de amizade, ciúme e aceitação, contada com humor e carinho. A dinâmica entre Woody e Buzz é o grande trunfo da aventura.\n\nAs canções de Randy Newman, em especial \"You've Got a Friend in Me\", ajudam a dar ao filme sua identidade afetiva.\n\nOs gráficos mostram a idade, principalmente nos humanos, mas isso quase não atrapalha: o filme sabe usar bem as limitações da tecnologia da época, e brinquedos de plástico ficam muito convincentes. Mais de trinta anos depois, continua sendo diversão para todas as idades.",
    category: "Longa-Metragem",
    image: imgToyStory,
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
  },
  {
    id: "seed-7",
    title: "Avatar: A Lenda de Aang",
    subtitle: "Fantasia, humor e amadurecimento em três livros",
    rating: 5,
    date: "2026-03-08T12:00:00Z",
    excerpt: "Uma das melhores séries de animação já feitas: aventura, personagens inesquecíveis e uma história planejada do início ao fim.",
    fullContent: "Exibida pela Nickelodeon entre 2005 e 2008, Avatar: A Lenda de Aang acompanha Aang, um jovem monge que é o último dos Nômades do Ar e o Avatar, o único capaz de dominar os quatro elementos. Ao lado de Katara, Sokka e, mais tarde, Toph, ele precisa aprender a dominar a água, a terra e o fogo antes que a Nação do Fogo vença a guerra.\n\nA série é dividida em três livros — Água, Terra e Fogo — e tem a rara qualidade de ter uma história planejada do começo ao fim. Os personagens evoluem de verdade, e nenhum arco parece enrolação.\n\nO Príncipe Zuko e seu tio Iroh formam uma das melhores histórias de redenção da televisão, animada ou não. Os temas — guerra, luto e responsabilidade — são tratados com sensibilidade, sem que a série perca o humor.\n\nAs lutas, inspiradas em artes marciais reais, são bem coreografadas e fazem cada elemento ter um estilo próprio. É uma série que agrada crianças e adultos, e que merece ser revista de tempos em tempos.",
    category: "Cartoon",
    image: imgAvatar,
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
  },
  {
    id: "seed-8",
    title: "Cowboy Bebop",
    subtitle: "Estilo, jazz e solidão no espaço",
    rating: 4.5,
    date: "2026-03-15T12:00:00Z",
    excerpt: "Faroeste espacial com trilha de jazz inesquecível: 26 episódios que continuam sendo referência de estilo no anime.",
    fullContent: "Lançado em 1998 pelo estúdio Sunrise, com direção de Shinichirō Watanabe, Cowboy Bebop acompanha uma tripulação de caçadores de recompensas que viaja pelo sistema solar de 2071. Spike Spiegel, Jet Black, Faye Valentine, o hacker Ed e o cachorro Ein formam uma família improvisada, cada um fugindo de um passado que insiste em voltar.\n\nA série mistura faroeste, ficção científica, filme noir e comédia, e cada episódio parece uma pequena obra à parte, com tom e estilo próprios. Em poucos minutos ela passa do humor absurdo para o drama mais sombrio.\n\nA trilha sonora de Yoko Kanno, com jazz, blues e rock, é uma das mais icônicas da história da animação, e as aberturas e cenas de ação ficam ainda melhores por causa dela.\n\nSão apenas 26 episódios, mas o suficiente para criar personagens marcantes e um final que ninguém esquece. Mesmo com o passar dos anos, Cowboy Bebop continua sendo uma das melhores portas de entrada para quem quer começar a assistir anime.",
    category: "Anime",
    image: imgBebop,
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
  },
  {
    id: "seed-9",
    title: "Paperman",
    subtitle: "Poesia em preto e branco, sem uma palavra",
    rating: 4,
    date: "2026-03-22T12:00:00Z",
    excerpt: "Um curta da Disney que conta uma história de amor só com imagem e música, misturando desenho à mão e computação gráfica.",
    fullContent: "Paperman, curta de 2012 da Disney dirigido por John Kahrs, conta a história de um jovem que, depois de um encontro rápido numa estação de trem, tenta reencontrar uma moça usando aviões de papel. Sem uma única fala, a história se sustenta apenas na imagem e na música.\n\nO grande destaque é a técnica: o curta mistura desenho feito à mão com computação gráfica, preservando o traço de lápis e dando aos personagens uma expressividade rara. O preto e branco, com o vermelho do batom como único toque de cor, reforça o tom romântico e nostálgico.\n\nO filme venceu o Oscar de Melhor Curta de Animação em 2013 e mostrou que a Disney ainda podia surpreender com a própria tradição.\n\nO romance é bastante idealizado, e quem procura algo mais complexo pode sentir falta de profundidade. Mas, como experiência curta e delicada, funciona muito bem.",
    category: "Curta-Metragem",
    image: imgPaperman,
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
  },
  {
    id: "seed-10",
    title: "FLCL",
    subtitle: "Caos, guitarras e puberdade em seis episódios",
    rating: 3.5,
    date: "2026-03-29T12:00:00Z",
    excerpt: "Uma OVA de ritmo frenético que usa robôs gigantes e muita bagunça para falar sobre crescer. Genial para uns, confusa para outros.",
    fullContent: "FLCL (Fooly Cooly), lançada em 2000 pelo estúdio Gainax com direção de Kazuya Tsurumaki, é uma OVA de apenas seis episódios. Ela acompanha Naota, um garoto de 12 anos cuja vida pacata muda quando Haruko, uma mulher misteriosa que chega de Vespa, o acerta com um baixo. A partir daí, robôs gigantes começam a sair da cabeça dele.\n\nPor trás da bagunça, a história é uma grande metáfora da puberdade: a confusão de crescer, de querer ser adulto sem saber como e de lidar com sentimentos que não se entende. A animação é criativa, cheia de mudanças de estilo e referências, e a trilha do grupo The Pillows combina perfeitamente com o clima.\n\nO problema é que o ritmo é tão acelerado e o humor tão peculiar que nem sempre dá para acompanhar o que está acontecendo. Quem gosta de experimentação vai se divertir; quem prefere uma narrativa mais clara pode se sentir perdido.\n\nÉ curta, estilosa e diferente de quase tudo, mas definitivamente não é para todo mundo.",
    category: "OVA",
    image: imgFlcl,
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
  },
  {
    id: "seed-11",
    title: "Qual a melhor abertura de anime de todos os tempos?",
    subtitle: "Vale qualquer época, estúdio ou gênero",
    rating: 0,
    date: "2026-04-02T12:00:00Z",
    excerpt: "Uma boa abertura define o clima da série inteira. Qual é a sua favorita e por quê?",
    fullContent: "Toda temporada surge uma abertura que gruda na cabeça por semanas. Algumas apostam na música, outras na animação, e outras na combinação perfeita entre as duas.\n\nPara abrir o debate: o que faz uma abertura ser inesquecível para você? É a música, o ritmo da edição, o momento em que ela aparece ou a nostalgia de assistir toda semana?\n\nConte nos comentários qual é a sua favorita, de qual anime ela é e por que ela merece o primeiro lugar. Vale citar aberturas antigas e novas, e quem quiser pode defender uma opinião impopular!",
    category: "Debate",
    image: imgAbertura,
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
    type: "discussion",
  },
  {
    id: "seed-12",
    title: "Estão empolgados para a nova temporada de Love, Death & Robots?",
    subtitle: "Curtas para todos os gostos: o que você espera dos novos episódios?",
    rating: 0,
    date: "2026-04-09T12:00:00Z",
    excerpt: "A antologia de curtas animados da Netflix vai ganhar uma nova temporada. O que você espera e quais são seus episódios favoritos?",
    fullContent: "Love, Death & Robots é a antologia de curtas animados da Netflix em que cada episódio conta uma história diferente, com estilos de animação, tons e gêneros completamente distintos: ficção científica, fantasia, terror, comédia e muito mais. É uma série voltada para o público adulto.\n\nCom uma nova temporada a caminho, a pergunta é: você está empolgado? O que espera ver desta vez: mais episódios sombrios, mais humor ou experimentos visuais ousados?\n\nConte nos comentários quais são os seus curtas favoritos das temporadas anteriores e que tipo de história você gostaria de ver nos próximos. Dica: se for falar de um episódio específico, evite spoilers!",
    category: "Debate",
    image: imgLoveDeathRobots,
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
    type: "discussion",
  },
  {
    id: "seed-13",
    title: "Qual animação você indicaria para quem nunca assistiu anime?",
    subtitle: "Ajude quem está começando a escolher bem",
    rating: 0,
    date: "2026-04-16T12:00:00Z",
    excerpt: "Um amigo quer começar a ver anime e pediu uma dica. Qual título você indicaria primeiro?",
    fullContent: "Começar no anime pode ser intimidante: são milhares de títulos, gêneros e estilos. Uma boa primeira indicação faz toda a diferença.\n\nSe você pudesse indicar apenas uma animação para alguém que nunca assistiu, qual seria? Pode ser filme, série ou OVA, e vale adaptar a dica ao gosto da pessoa: aventura, romance, comédia ou ficção científica.\n\nConte qual é a sua indicação e explique o motivo. Dica: sem spoilers!",
    category: "Recomendação",
    image: imgIndicacao,
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
    type: "discussion",
  },
  {
    id: "seed-14",
    title: "Qual desenho da infância você mais sente falta?",
    subtitle: "Uma viagem de volta às tardes na frente da TV",
    rating: 0,
    date: "2026-04-23T12:00:00Z",
    excerpt: "Aquele desenho que passava depois da escola e que a gente nunca esquece. Qual era o seu?",
    fullContent: "Todo mundo tem aquele desenho que marcou a infância: o horário que a gente respeitava, a abertura que sabia de cor, os personagens que pareciam amigos de verdade.\n\nQual era o seu? Conte o nome do desenho, em que época você assistia e qual episódio ou cena ficou na memória.\n\nE uma pergunta extra: você já reassistiu como adulto? A experiência foi igual ou mudou alguma coisa?",
    category: "Nostalgia",
    image: imgDesenho,
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
    type: "discussion",
  },
  {
    id: "seed-15",
    title: "Por onde começar a assistir os filmes do Studio Ghibli?",
    subtitle: "Dúvida de quem quer entrar no mundo do estúdio",
    rating: 0,
    date: "2026-04-30T12:00:00Z",
    excerpt: "São muitos filmes e todos têm fama de clássicos. Qual é a melhor ordem para começar?",
    fullContent: "O Studio Ghibli tem um catálogo grande, com aventuras, fantasias e histórias mais calmas e emocionantes. Para quem está começando, a quantidade de opções pode confundir.\n\nVocê assistiria em ordem de lançamento ou começaria pelos mais famosos? Quais filmes funcionam bem como porta de entrada e quais ficam melhores depois?\n\nCompartilhe a sua sugestão de ordem e diga o que cada filme tem de especial. Quem já assistiu a todos pode ajudar muito quem está só começando.",
    category: "Dúvida",
    image: imgGhibli,
    authorId: "system",
    authorName: "Equipe Toonframe",
    authorUsername: "toonframe",
    authorImage: "",
    likes: [],
    type: "discussion",
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
    // As críticas de exemplo vêm sempre do código (assim, textos e imagens novos
    // aparecem mesmo para quem já tinha dados salvos). Do que está salvo no
    // localStorage mantemos as curtidas e as críticas criadas pelos usuários.
    const stored = load<Review[]>(K.REVIEWS, []);
    const saved = Array.isArray(stored) ? stored : [];
    const seedIds = new Set(SEED_REVIEWS.map((r) => r.id));
    const seeds = SEED_REVIEWS.map((seed) => {
      const prev = saved.find((r) => r.id === seed.id);
      return prev ? { ...seed, likes: prev.likes ?? [] } : seed;
    });
    const userReviews = saved.filter((r) => !seedIds.has(r.id));
    return [...seeds, ...userReviews];
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
