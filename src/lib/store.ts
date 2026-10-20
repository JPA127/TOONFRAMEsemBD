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
import { sha256Hex } from "./sha256";
import imgDbzKai from "../assets/reviews/dragon-ball-z-kai.jpg";
import imgJujutsu from "../assets/reviews/jujutsu-kaisen.jpg";
import imgJvAvatar from "../assets/profiles/jvcldf-avatar.jpg";
import imgJvCover from "../assets/profiles/jvcldf-cover.jpg";
import imgJvDbz from "../assets/profiles/jvcldf-dbz.jpg";
import imgLacasAvatar from "../assets/profiles/lacas-avatar.jpg";
import imgLacasCover from "../assets/profiles/lacas-cover.jpg";
import imgFrankAvatar from "../assets/profiles/frank127-avatar.jpg";
import imgFrankCover from "../assets/profiles/frank127-cover.jpg";
import imgMonsterHouse from "../assets/reviews/monster-house.jpg";
import imgMulherForte from "../assets/discussions/mulher-mais-forte.jpg";
import imgBruno from "../assets/profiles/bruno-alves.jpg";
import imgMarcos from "../assets/profiles/marcos-vinicius.jpg";
import imgRafael from "../assets/profiles/rafael-mendes.jpg";
import imgCarolina from "../assets/profiles/carolina-guedes.jpg";

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
  /** perfil de exemplo ("manequim"): existe para todos os visitantes, em qualquer dispositivo */
  mannequin?: boolean;
  /** manequins guardam só o hash (SHA-256 com sal) da senha, nunca a senha em texto puro */
  passwordSalt?: string;
  passwordHash?: string;
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
  /** data da última edição (aparece discretamente na publicação completa) */
  editedAt?: string;
  /** uso interno: alterações do autor numa publicação de exemplo (que vem do código) */
  edits?: Partial<Review>;
  /** uso interno: publicação de exemplo excluída pelo autor */
  deleted?: boolean;
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
  /** uso interno: comentário de exemplo removido */
  deleted?: boolean;
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
      "A temporada final de AoT eleva o padrão narrativo do anime com conflitos morais complexos e animação impecável.",
    fullContent: `Attack on Titan: The Final Season é o encerramento de uma das séries de anime mais impactantes já produzidas. O que começou como um thriller de sobrevivência evoluiu para uma exploração complexa de guerra, liberdade e o ciclo de ódio entre civilizações.

A animação do estúdio MAPPA representa uma mudança significativa em relação ao WIT Studio, mas eleva ainda mais a qualidade visual da série. As sequências de ação são simplesmente espetaculares.

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

Miles Morales continua sendo um dos heróis mais bem escritos do cinema de super-heróis. Sua jornada de autodescoberta e o conflito com a ideia de "destino" tocam em algo profundamente humano.

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

A primeira temporada acompanha a história das irmãs Vi e Jinx em Piltover e Zaun — duas cidades divididas por política e classe social. O que poderia ser uma simples aventura de fantasia se transforma numa exploração devastadora de trauma familiar, lealdade e as consequências do progresso sem ética.

A animação do estúdio Fortiche é simplesmente extraordinária. A série mistura técnicas 2D e 3D de forma orgânica, criando uma estética única que parece uma pintura em movimento.

A trilha sonora, com participações de Imagine Dragons e outros artistas, serve como cola emocional perfeita para a narrativa. Arcane provou que adaptações de jogos podem — e devem — ser arte.`,
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
    title: "Toy Story 3",
    subtitle: "Uma despedida divertida e emocionante",
    rating: 5,
    date: "2026-05-30T15:40:00.000Z",
    excerpt: "Brinquedos ganham vida e embarcam em uma aventura sobre amizade, lealdade e aceitação das mudanças.",
    fullContent: "Considero Toy Story 3 uma animação excepcional e merecedora de cinco estrelas. Seus personagens são extremamente carismáticos e bem desenvolvidos, especialmente Woody e Buzz, cuja relação evolui de forma natural e emocionante ao longo da trama. O filme combina humor, aventura e momentos sensíveis com grande equilíbrio, transmitindo mensagens importantes sobre companheirismo, empatia e amadurecimento. Além disso, sua qualidade técnica foi revolucionária para a época, marcando a história da animação.",
    category: "Longa-Metragem",
    image: imgToyStory,
    authorId: "mannequin-carolina",
    authorName: "Carolina Guedes",
    authorUsername: "carol_guedes",
    authorImage: imgCarolina,
    likes: ["mannequin-marcos", "mannequin-rafael"],
    type: "review",
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
    fullContent: "FLCL (Fooly Cooly), lançada em 2000 pelo estúdio Gainax com direção de Kazuya Tsurumaki, é uma OVA de apenas seis episódios. Ela acompanha Naota, um garoto de 12 anos cuja vida pacata muda quando Haruko, uma mulher misteriosa que chega de Vespa, o acerta com um baixo. A partir daí, robôs gigantes começam a sair da cabeça dele.\n\nPor trás da bagunça, a história é uma grande metáfora da puberdade: a confusão de crescer, de querer ser adulto sem saber como e de lidar com sentimentos que não se entendem. A animação é criativa, cheia de mudanças de estilo e referências, e a trilha do grupo The Pillows combina perfeitamente com o clima.\n\nO problema é que o ritmo é tão acelerado e o humor tão peculiar que nem sempre dá para acompanhar o que está acontecendo. Quem gosta de experimentação vai se divertir; quem prefere uma narrativa mais clara pode se sentir perdido.\n\nÉ curta, estilosa e diferente de quase tudo, mas definitivamente não é para todo mundo.",
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
    fullContent: "A cada temporada surge uma abertura que gruda na cabeça por semanas. Algumas apostam na música, outras na animação, e outras na combinação perfeita entre as duas.\n\nPara abrir o debate: o que faz uma abertura ser inesquecível para você? É a música, o ritmo da edição, o momento em que ela aparece ou a nostalgia de assistir toda semana?\n\nConte nos comentários qual é a sua favorita, de qual anime ela é e por que ela merece o primeiro lugar. Vale citar aberturas antigas e novas, e quem quiser pode defender uma opinião impopular!",
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
    title: "De qual desenho da infância você mais sente falta?",
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
  {
    id: "seed-jv-1",
    title: "Dragon Ball Z Kai",
    subtitle: "Uma remasterização do anime clássico Dragon Ball Z",
    rating: 5,
    date: "2026-10-17T22:25:09.235Z",
    excerpt: "Como remasterização de um clássico dos anos 1990 fez uma criança que cresceu nos anos 2010 feliz nas manhãs de domingo.",
    fullContent: "Numa manhã de domingo em 2017, quando estava nos meus 11 anos deitado procurando algo de legal para assistir, trombei com um canal aberto transmitindo no momento um desenho que me interessou. Personagens que nunca tinha visto antes lutando e buscando um objetivo em comum, que era procurar as esferas do dragão. Nesse momento fui apresentado a Dragon Ball Z: Kai, uma versão remasterizada do anime de 1989 em que todo mundo conhecia pelo menos o básico, menos eu.",
    category: "Anime",
    image: imgDbzKai,
    authorId: "mannequin-jvcldf",
    authorName: "Jv, eu mesmo",
    authorUsername: "JvcLdf",
    authorImage: imgJvAvatar,
    likes: [],
    type: "review",
  },
  {
    id: "seed-lacas-1",
    title: "Jujutsu Kaisen",
    subtitle: "Ação, poderes criativos e personagens carismáticos",
    rating: 4.5,
    date: "2026-10-18T14:10:00.000Z",
    excerpt: "Um anime de lutas que acerta em cheio: poderes criativos, personagens carismáticos e relações que fazem a diferença.",
    fullContent: "Jujutsu Kaisen é uma obra que encarna perfeitamente aquilo que se propõe a ser, um anime de lutas. Contendo poderes criativos, personagens carismáticos e cativantes, e uma premissa simples e objetiva, que te permite focar no que realmente importa, o dinamismo das relações entre os personagens, tanto as relações antagônicas quanto as relações entre amigos e aliados.\n\nSe você busca ação, momentos épicos, e alguns dos melhores personagens que os animes podem te oferecer, eu recomendaria Jujutsu Kaisen.",
    category: "Anime",
    image: imgJujutsu,
    authorId: "mannequin-lacas",
    authorName: "LAcasgamer2525hardcoredarksouls",
    authorUsername: "LAcasgamer2525hardcoredarksouls",
    authorImage: imgLacasAvatar,
    likes: [],
    type: "review",
  },
  {
    id: "seed-frank-1",
    title: "A Casa Monstro era SINISTRO",
    subtitle: "Um clássico do terror infantil que dá medo na medida certa.",
    rating: 5,
    date: "2026-10-18T20:00:00.000Z",
    excerpt: "Uma animação incrível que equilibra perfeitamente o suspense e a aventura, entregando um terror genuíno e acessível para todas as idades.",
    fullContent: "A Casa Monstro é uma verdadeira obra-prima do entretenimento infantojuvenil. O filme consegue criar um clima tenso, assustador e sinistro na medida exata, respeitando a inteligência do público mirim sem perder o toque de humor e aventura. É o exemplo perfeito de como introduzir o gênero de terror para as crianças de forma divertida, memorável e acessível, tornando-se um clássico atemporal que continua maravilhoso de assistir.",
    category: "Filme",
    image: imgMonsterHouse,
    authorId: "mannequin-frank127",
    authorName: "Frank",
    authorUsername: "Frank127",
    authorImage: imgFrankAvatar,
    likes: [],
    type: "review",
  },
  {
    id: "seed-frank-2",
    title: "Qual a mulher mais forte dos animes?",
    subtitle: "Qual a opinião de vocês?",
    rating: 0,
    date: "2026-10-18T21:30:00.000Z",
    excerpt: "Quem é a mulher mais forte dos animes? É um tema que eu vejo poucas pessoas falando, o que acham?",
    fullContent: "Quando pensamos nas personagens femininas mais apeladas e poderosas dos animes, a lista é gigantesca. Pra mim, a Yoruichi Shihoin (Bleach) tem um destaque surreal pelo seu combate corpo a corpo, velocidade absurda e o Shunko, mas sei que a disputa é pesadíssima quando colocamos no debate nomes como Kaguya (Naruto), Big Mom (One Piece), Tatsumaki (One Punch Man) ou até personagens de escalas cósmicas.\n\nPara vocês, quem ocupa o verdadeiro topo da mulher mais forte dos animes? Deixem os seus palpites e argumentos nos comentários!",
    category: "Debate",
    image: imgMulherForte,
    authorId: "mannequin-frank127",
    authorName: "Frank",
    authorUsername: "Frank127",
    authorImage: imgFrankAvatar,
    likes: [],
    type: "discussion",
  },
];

// ─── Perfis de exemplo ("manequins") ─────────────────────────────────────────
// Existem para todos os visitantes (vêm do código, não do localStorage de quem acessa)
// e não permitem login. Aparecem nas sugestões de amigos e têm página pública em /user/<usuário>.
// Capa de cor sólida (SVG pequeno que cobre toda a área da capa)
const solidCover = (hex: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="${hex}"/></svg>`
  )}`;

const SEED_USERS: StoredUser[] = [
  {
    id: "mannequin-jvcldf",
    username: "JvcLdf",
    password: "",
    passwordSalt: "9d003bca95dadb77",
    passwordHash: "6c582a1ed9a3c49eb96300661c84314ffbb0a61d62109aa1e4a0d6fa5c602bd7",
    mannequin: true,
    profile: {
      name: "Jv, eu mesmo",
      username: "JvcLdf",
      bio: 'Um dos criadores do Toonframe! Fã de Dragon Ball, Apenas um Show e Gumball\n"Nunca perca o seu brilho" Toy Story devia ter acabado com dignidade no 3.',
      profileImage: imgJvAvatar,
      coverImage: imgJvCover,
      stats: { reviews: 1, friends: 0, favorites: 2 },
    },
    friends: [],
    favoriteMovies: [
      { id: 9, title: "Dragon Ball Z", year: "1989", image: imgJvDbz },
      { id: 5, title: "Toy Story", year: "1995", image: imgToyStory },
    ],
    createdAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "mannequin-lacas",
    username: "LAcasgamer2525hardcoredarksouls",
    password: "",
    passwordSalt: "6c0ea137b8bf9b2f",
    passwordHash: "44042dd60c291734efed0b83556cdd5454160836b17b672bc33218216ce894ee",
    mannequin: true,
    profile: {
      name: "LAcasgamer2525hardcoredarksouls",
      username: "LAcasgamer2525hardcoredarksouls",
      bio: "gamer hardcore, amo dark souls, berserk e góticas",
      profileImage: imgLacasAvatar,
      coverImage: imgLacasCover,
      stats: { reviews: 1, friends: 0, favorites: 0 },
    },
    friends: [],
    favoriteMovies: [],
    createdAt: "2026-10-02T12:00:00.000Z",
  },
  {
    id: "mannequin-frank127",
    username: "Frank127",
    password: "",
    passwordSalt: "c548c2900349e372",
    passwordHash: "ddd90e9d95b0079a342bebab4121904c8e9bf63f34b407509956c892cc4ec98d",
    mannequin: true,
    profile: {
      name: "Frank",
      username: "Frank127",
      bio: "Gosto de heavy metal, Naruto, Shrek, filmes de terror, do fantasmático de ben 10 e de empadinha de camarão.",
      profileImage: imgFrankAvatar,
      coverImage: imgFrankCover,
      stats: { reviews: 2, friends: 0, favorites: 0 },
    },
    friends: [],
    favoriteMovies: [],
    createdAt: "2026-10-03T12:00:00.000Z",
  },
  {
    id: "mannequin-bruno",
    username: "bruno_alves",
    password: "",
    mannequin: true,
    profile: {
      name: "Bruno Alves",
      username: "bruno_alves",
      bio: "Fã de animação desde criança. Sempre de olho em desenhos, filmes e animes novos para maratonar nos fins de semana.",
      profileImage: imgBruno,
      coverImage: solidCover("#3B82F6"),
      stats: { reviews: 0, friends: 0, favorites: 0 },
    },
    friends: [],
    favoriteMovies: [],
    createdAt: "2026-05-18T12:00:00.000Z",
  },
  {
    id: "mannequin-marcos",
    username: "vini_marcos",
    password: "",
    mannequin: true,
    profile: {
      name: "Marcos Vinícius",
      username: "vini_marcos",
      bio: "Gosto de animações clássicas e de assistir filmes em família. Aqui para trocar ideias sobre cinema de animação.",
      profileImage: imgMarcos,
      coverImage: solidCover("#F97316"),
      stats: { reviews: 0, friends: 0, favorites: 0 },
    },
    friends: [],
    favoriteMovies: [],
    createdAt: "2026-05-19T12:00:00.000Z",
  },
  {
    id: "mannequin-rafael",
    username: "rafaa_mendes",
    password: "",
    mannequin: true,
    profile: {
      name: "Rafael Mendes",
      username: "rafaa_mendes",
      bio: "Apaixonado por animação e por franquias que marcaram época. Opinião sincera sobre tudo que assisto.",
      profileImage: imgRafael,
      coverImage: solidCover("#FACC15"),
      stats: { reviews: 0, friends: 0, favorites: 0 },
    },
    friends: [],
    favoriteMovies: [],
    createdAt: "2026-05-20T12:00:00.000Z",
  },
  {
    id: "mannequin-carolina",
    username: "carol_guedes",
    password: "",
    mannequin: true,
    profile: {
      name: "Carolina Guedes",
      username: "carol_guedes",
      bio: "Apaixonada por animação e por histórias que emocionam. Escrevo sobre os filmes e séries que marcaram minha vida.",
      profileImage: imgCarolina,
      coverImage: solidCover("#A855F7"),
      stats: { reviews: 1, friends: 0, favorites: 0 },
    },
    friends: [],
    favoriteMovies: [],
    createdAt: "2026-05-21T12:00:00.000Z",
  },
];

const SEED_USER_IDS = new Set(SEED_USERS.map((u) => u.id));
const SEED_USERNAMES = new Set(SEED_USERS.map((u) => u.username.toLowerCase()));

/** Os manequins no formato de "amigo" usado pela lista de sugestões (ids 1001, 1002...) */
export const MANNEQUIN_FRIENDS: Friend[] = SEED_USERS.map((u, i) => ({
  id: 1001 + i,
  name: u.profile.name,
  username: `@${u.username}`,
  image: u.profile.profileImage,
}));

/** Confere a senha: manequins usam hash com sal; contas comuns, o texto salvo no navegador */
export function checkPassword(user: StoredUser, password: string): boolean {
  if (user.passwordHash && user.passwordSalt) {
    return sha256Hex(`${user.passwordSalt}:${password}`) === user.passwordHash;
  }
  return !user.mannequin && user.password === password;
}

// ─── User store ───────────────────────────────────────────────────────────────

export const userStore = {
  /** Manequins (do código) + contas criadas neste navegador */
  getAll(): StoredUser[] {
    const stored = load<StoredUser[]>(K.USERS, []);
    const saved = Array.isArray(stored) ? stored : [];
    // se este navegador já tinha uma conta com o mesmo usuário de um manequim, vale o manequim
    const accounts = saved.filter(
      (u) => !SEED_USER_IDS.has(u.id) && !SEED_USERNAMES.has(u.username.toLowerCase())
    );
    // alterações feitas ao usar um manequim ficam salvas só neste dispositivo (sobre o perfil base)
    const mannequins = SEED_USERS.map((seed) => {
      const own = saved.find((u) => u.id === seed.id);
      return own
        ? { ...seed, profile: own.profile, friends: own.friends, favoriteMovies: own.favoriteMovies }
        : seed;
    });
    return [...mannequins, ...accounts];
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
    const users = load<StoredUser[]>(K.USERS, []);
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
    if (SEED_USER_IDS.has(id)) {
      const base = SEED_USERS.find((u) => u.id === id)!;
      const current = this.findById(id)!;
      const merged = { ...current, ...partial };
      const entry: StoredUser = {
        id,
        username: base.username,
        password: "",
        profile: merged.profile,
        friends: merged.friends,
        favoriteMovies: merged.favoriteMovies,
        createdAt: base.createdAt,
        mannequin: true,
      };
      const stored = load<StoredUser[]>(K.USERS, []);
      const at = stored.findIndex((u) => u.id === id);
      if (at === -1) stored.push(entry);
      else stored[at] = entry;
      save(K.USERS, stored);
      return this.findById(id);
    }
    const users = load<StoredUser[]>(K.USERS, []);
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...partial };
    save(K.USERS, users);
    return users[idx];
  },
};

// ─── Review store ─────────────────────────────────────────────────────────────

const EDITABLE_FIELDS = ["title", "subtitle", "rating", "excerpt", "fullContent", "category", "image"] as const;
export type ReviewEdits = Partial<Pick<Review, (typeof EDITABLE_FIELDS)[number]>>;

function savedReviews(): Review[] {
  const stored = load<Review[]>(K.REVIEWS, []);
  return Array.isArray(stored) ? stored : [];
}

/** grava (ou substitui) uma entrada na lista salva sem mexer nas outras */
function upsertReview(entry: Review) {
  const list = savedReviews();
  const at = list.findIndex((r) => r.id === entry.id);
  if (at === -1) list.push(entry);
  else list[at] = entry;
  save(K.REVIEWS, list);
}

export const reviewStore = {
  getAll(): Review[] {
    // As publicações de exemplo vêm sempre do código (assim, textos e imagens novos
    // aparecem mesmo para quem já tinha dados salvos). Do que está salvo no localStorage
    // mantemos curtidas, edições e exclusões dos exemplos, e as publicações dos usuários.
    const saved = savedReviews();
    const seedIds = new Set(SEED_REVIEWS.map((r) => r.id));
    const seeds: Review[] = [];
    for (const seed of SEED_REVIEWS) {
      const prev = saved.find((r) => r.id === seed.id);
      if (prev?.deleted) continue;
      let merged: Review = { ...seed, likes: Array.from(new Set([...seed.likes, ...(prev?.likes ?? [])])) };
      if (prev?.edits) merged = { ...merged, ...prev.edits, editedAt: prev.editedAt };
      seeds.push(merged);
    }
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
    const created: Review = {
      ...review,
      id: genId(),
      date: new Date().toISOString(),
      likes: [],
    };
    save(K.REVIEWS, [...savedReviews(), created]);
    return created;
  },

  toggleLike(reviewId: string, userId: string): Review | null {
    const current = this.getById(reviewId);
    if (!current) return null;
    const likes = current.likes.includes(userId)
      ? current.likes.filter((id) => id !== userId)
      : [...current.likes, userId];
    const seed = SEED_REVIEWS.find((r) => r.id === reviewId);
    if (seed) {
      const prev = savedReviews().find((r) => r.id === reviewId);
      upsertReview({ ...(prev ?? seed), likes });
    } else {
      upsertReview({ ...current, likes });
    }
    return { ...current, likes };
  },

  /** Edita os campos permitidos e marca a publicação como editada (quem pode editar é checado no AuthContext) */
  update(reviewId: string, changes: ReviewEdits): Review | null {
    const current = this.getById(reviewId);
    if (!current) return null;
    const now = new Date().toISOString();
    const seed = SEED_REVIEWS.find((r) => r.id === reviewId);
    if (seed) {
      // exemplo (vem do código): guardamos só o que o autor mudou em relação ao original
      const prev = savedReviews().find((r) => r.id === reviewId);
      const edits: Record<string, unknown> = { ...(prev?.edits ?? {}) };
      for (const key of EDITABLE_FIELDS) {
        if (changes[key] === undefined) continue;
        if (changes[key] === seed[key]) delete edits[key];
        else edits[key] = changes[key];
      }
      upsertReview({ ...(prev ?? seed), likes: current.likes, edits: edits as Partial<Review>, editedAt: now });
    } else {
      const picked: Record<string, unknown> = {};
      for (const key of EDITABLE_FIELDS) if (changes[key] !== undefined) picked[key] = changes[key];
      upsertReview({ ...current, ...picked, editedAt: now });
    }
    return this.getById(reviewId);
  },

  remove(reviewId: string): boolean {
    const seed = SEED_REVIEWS.find((r) => r.id === reviewId);
    if (seed) {
      const prev = savedReviews().find((r) => r.id === reviewId);
      upsertReview({ ...(prev ?? seed), deleted: true });
      return true;
    }
    const list = savedReviews();
    const next = list.filter((r) => r.id !== reviewId);
    if (next.length === list.length) return false;
    save(K.REVIEWS, next);
    return true;
  },
};

// ─── Comment store ────────────────────────────────────────────────────────────

// ─── Comentários de exemplo (feitos pelos perfis manequim) ───────────────────
const SEED_COMMENTS: Comment[] = [
  {
    id: "seed-comment-1",
    reviewId: "seed-6",
    content: "Adoro ver Toy Story 3 com a minha família, é um filme muito bom de se assistir. Você me fez pensar muito enquanto eu lia Carol, vou olhar esse filme com outros olhos quando eu revê-lo novamente.",
    authorId: "mannequin-marcos",
    authorName: "Marcos Vinícius",
    authorUsername: "vini_marcos",
    authorImage: imgMarcos,
    date: "2026-05-30T18:20:00.000Z",
    likes: [],
  },
  {
    id: "seed-comment-2",
    reviewId: "seed-6",
    content: "@vini_marcos de fato o filme e a franquia é maravilhosa, uma pena que a Pixar continua lançando mais e mais sequências estendendo a franquia por mais dinheiro ao invés de ter terminado de maneira digna no 3.",
    authorId: "mannequin-rafael",
    authorName: "Rafael Mendes",
    authorUsername: "rafaa_mendes",
    authorImage: imgRafael,
    date: "2026-05-30T19:05:00.000Z",
    likes: [],
  },
];

function savedComments(): Comment[] {
  const stored = load<Comment[]>(K.COMMENTS, []);
  return Array.isArray(stored) ? stored : [];
}

function upsertComment(entry: Comment) {
  const list = savedComments();
  const at = list.findIndex((c) => c.id === entry.id);
  if (at === -1) list.push(entry);
  else list[at] = entry;
  save(K.COMMENTS, list);
}

export const commentStore = {
  /** Comentários de exemplo (do código) + os feitos neste navegador */
  getAll(): Comment[] {
    const saved = savedComments();
    const seedIds = new Set(SEED_COMMENTS.map((c) => c.id));
    const seeds: Comment[] = [];
    for (const seed of SEED_COMMENTS) {
      const prev = saved.find((c) => c.id === seed.id);
      if (prev?.deleted) continue;
      seeds.push({ ...seed, likes: Array.from(new Set([...seed.likes, ...(prev?.likes ?? [])])) });
    }
    return [...seeds, ...saved.filter((c) => !seedIds.has(c.id))];
  },

  getByReview(reviewId: string): Comment[] {
    return this.getAll().filter((c) => c.reviewId === reviewId);
  },

  deleteByReview(reviewId: string): void {
    save(K.COMMENTS, savedComments().filter((c) => c.reviewId !== reviewId));
    // comentários de exemplo não saem do código: ficam marcados como removidos
    for (const seed of SEED_COMMENTS.filter((c) => c.reviewId === reviewId)) {
      const prev = savedComments().find((c) => c.id === seed.id);
      upsertComment({ ...(prev ?? seed), deleted: true });
    }
  },

  create(comment: Omit<Comment, "id" | "date" | "likes">): Comment {
    const created: Comment = {
      ...comment,
      id: genId(),
      date: new Date().toISOString(),
      likes: [],
    };
    save(K.COMMENTS, [...savedComments(), created]);
    return created;
  },

  toggleLike(commentId: string, userId: string): Comment | null {
    const current = this.getAll().find((c) => c.id === commentId);
    if (!current) return null;
    const likes = current.likes.includes(userId)
      ? current.likes.filter((id) => id !== userId)
      : [...current.likes, userId];
    const seed = SEED_COMMENTS.find((c) => c.id === commentId);
    const prev = savedComments().find((c) => c.id === commentId);
    upsertComment(seed ? { ...(prev ?? seed), likes } : { ...current, likes });
    return { ...current, likes };
  },
};
