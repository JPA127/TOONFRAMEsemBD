// Notícias do Toonframe. Existem dois tipos:
//  • Artigos: têm página própria (/news/<id>) com texto completo e comentários.
//  • Notícias rápidas: só texto curto, que se expande no próprio cartão ("LEIA MAIS").
import imgCyberpunk from "../assets/news/cyberpunk-edgerunners-2.jpg";
import imgIaAnimacao from "../assets/news/ia-animacao-3d.jpg";
import imgDemonSlayer from "../assets/news/demon-slayer-castelo-infinito.jpg";
import imgStreaming from "../assets/news/streaming-animacao.jpg";

// ─── Artigos ──────────────────────────────────────────────────────────────────

/** Pedaços do texto de um artigo, na ordem em que aparecem */
export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: { lead?: string; text: string }[] }
  | { type: "quote"; text: string; large?: boolean };

export interface Article {
  id: string;
  title: string;
  /** texto de abertura (linha fina), mostrado no destaque e no início do artigo */
  subtitle: string;
  category: string;
  /** data ISO; use formatNewsDate() para exibir */
  date: string;
  author: string;
  image?: string;
  /** cor da faixa do cartão em "Em alta agora" */
  accent: "blue" | "yellow" | "orange";
  featured?: boolean;
  trending?: boolean;
  blocks: ArticleBlock[];
}

export const ARTICLES: Article[] = [
  {
    id: "cyberpunk-edgerunners-2",
    title: "Netflix e CD Projekt RED anunciam “Cyberpunk: Edgerunners 2”",
    subtitle:
      "Se você achou que o final devastador da primeira temporada de Cyberpunk: Mercenários (Edgerunners) tinha sido o último capítulo dessa história, pense novamente. Em uma transmissão surpresa que parou as redes sociais, a CD Projekt RED e a Netflix confirmaram a nova temporada do anime ambientado no universo de Cyberpunk 2077.",
    category: "Anime",
    date: "2026-10-21T12:00:00Z",
    author: "Equipe Toonframe",
    image: imgCyberpunk,
    accent: "orange",
    featured: true,
    blocks: [
      {
        type: "paragraph",
        text: "A animação ganha uma nova história focada em vingança, redenção e novos mercenários tentando sobreviver ao moedor de carne que é a megacidade.",
      },
      { type: "heading", text: "O que já sabemos até agora?" },
      {
        type: "list",
        items: [
          {
            lead: "Uma História Antológica:",
            text: "Esqueça reciclar velhos enredos. A nova temporada apresenta um elenco inédito de edgerunners. Novos personagens como o netrunner D, a ex-corpo Talia e o ciborgue veterano Weak prometem mostrar cantos ainda mais sombrios da cidade.",
          },
          {
            lead: "Visual Alucinante Continua:",
            text: "A produção mantém o visual frenético e cheio de atitude em parceria com estúdios de peso, garantindo aquelas cenas de ação ultraviolentas e estilizadas que consagraram a franquia.",
          },
          {
            lead: "Sincronia com o Jogo:",
            text: "Para acompanhar o lançamento, a CD Projekt RED já confirmou novas atualizações para o jogo Cyberpunk 2077, trazendo armas, vestimentas e contratos inspirados nos novos episódios.",
          },
        ],
      },
      { type: "quote", text: "A cidade nunca dorme, e os mercenários também não", large: true },
      {
        type: "paragraph",
        text: "Em nota oficial, os produtores revelaram que a recepção calorosa do público nos últimos anos foi o grande combustível para continuar explorando esse universo.",
      },
      {
        type: "quote",
        text: "Night City é um personagem por si só. Há milhares de histórias trágicas e viscerais acontecendo sob as luzes de neon todos os dias. Mal podemos esperar para vocês conhecerem nossa nova tripulação.",
      },
    ],
  },
  // Artigos de "Em alta agora" (com o mesmo subtítulo curto na página de notícias e no Início)
  {
    id: "ia-pipeline-animacao",
    title: "Nova tecnologia de inteligência artificial transforma o pipeline da animação 3D",
    subtitle: "Ferramentas de inteligência artificial entram no fluxo dos estúdios e aceleram a produção de animação.",
    category: "Tecnologia",
    date: "2026-10-20T12:00:00Z",
    author: "Tom Richardson",
    image: imgIaAnimacao,
    accent: "blue",
    trending: true,
    blocks: [
      { type: "paragraph", text: "A indústria da animação e dos efeitos visuais passa por uma das maiores transformações de sua história com a rápida integração de ferramentas de inteligência artificial no fluxo de trabalho dos estúdios. O novo ecossistema tecnológico está otimizando desde as etapas iniciais de criação até a pós-produção, otimizando pipelines complexos e oferecendo aos artistas novas formas de dar vida a personagens e cenários." },
      { type: "paragraph", text: "Uma das principais mudanças está na incorporação direta dessas tecnologias nos softwares mais populares do mercado. Programas como o Maya 2027 já trazem recursos generativos integrados ao fluxo nativo dos profissionais, dando suporte direto em etapas estratégicas como layout de cena, simulações dinâmicas e a própria animação de personagens." },
      { type: "paragraph", text: "Outro grande avanço do setor é a geração de movimento a partir de descrições em texto ou referências em vídeo. Desenvolvidas por gigantes como a Nvidia e plataformas especializadas como a QuickMagic, essas ferramentas conseguem traduzir prompts em linguagem natural ou gravações do mundo real em esqueletos tridimensionais totalmente articulados e prontos para exportação, acelerando processos que antes exigiam captura de movimento complexa ou rigging manual exaustivo." },
      { type: "paragraph", text: "Um dos desafios históricos da IA generativa no meio artístico — a manutenção do estilo visual — também encontrou soluções eficientes. O uso de fichas de personagens (character sheets), alinhado a referências visuais cruzadas, travas de texto e ferramentas de refinamento como Magnific e Kling, agora garante a consistência total da identidade de personagens e cenários ao longo de diferentes quadros e sequências de um projeto." },
      { type: "paragraph", text: "A consequência mais direta dessa evolução é uma expressiva redução de custos e prazos de produção. Etapas de trabalho que costumavam levar meses nas metodologias tradicionais agora podem ser concluídas em uma fração do tempo, permitindo maior escala de entregas. Contudo, os especialistas do setor destacam que a tecnologia atua como uma amplificadora da eficiência, mantendo a direção criativa, a sensibilidade e a visão narrativa humana no centro indiscutível do processo artístico." },
    ],
  },
  {
    id: "temporada-premios-animacao",
    title: "Demon Slayer: Castelo Infinito varre premiações globais e consolida histórico de sucesso no cinema",
    subtitle: "O longa acumula prêmios em vários países e consolida de vez seu sucesso nos cinemas.",
    category: "Prêmios",
    date: "2026-10-19T12:00:00Z",
    author: "Maria Lopez",
    image: imgDemonSlayer,
    accent: "yellow",
    trending: true,
    blocks: [
      { type: "paragraph", text: "O fenômeno do mundo dos animes continua quebrando recordes e acumulando troféus nas principais premiações do cinema e da animação mundial. A aclamada adaptação do arco Castelo Infinito, da franquia Demon Slayer: Kimetsu no Yaiba, vem registrando uma trajetória épica ao redor do globo, arrebatando a aclamação tanto da crítica especializada quanto do público." },
      { type: "paragraph", text: "A consagração máxima no Japão veio com a vitória na 49ª edição do Japan Academy Film Prize, em 2026, onde o longa foi coroado como o Melhor Filme de Animação. Além disso, a obra também conquistou o prêmio de Filme de Animação do Ano no prestigiado Tokyo Anime Award Festival 2026 e garantiu o troféu de Melhor Filme Animado no Japan’s Filmarks Awards, a principal plataforma de resenhas do público japonês." },
      { type: "paragraph", text: "O sucesso ultrapassou as fronteiras asiáticas e impactou fortemente a indústria ocidental. No Saturn Awards 2026, a produção venceu na categoria de Melhor Filme Animado Internacional, reafirmando sua força no cinema de gênero fantástico. O reconhecimento da crítica internacional já havia começado no final do ano anterior, quando o longa foi homenageado no Critics’ Choice Awards 2025 como Melhor Animação. No ambiente digital, o enorme engajamento popular foi reconhecido pelo portal Rotten Tomatoes, que nomeou o longa na categoria de Fan Favorite Animated Movie." },
      { type: "paragraph", text: "O grande destaque global da temporada ficou por conta do Crunchyroll Anime Awards 2026, onde o filme teve um desempenho avassalador ao conquistar sete prêmios, incluindo o cobiçado título de Filme do Ano. Entre as vitórias técnicas da noite, a inesquecível trilha sonora composta por Yuki Kajiura e Go Shiina levou o prêmio principal de sua categoria." },
      { type: "paragraph", text: "Para o público brasileiro, a premiação reservou um momento especial de orgulho. O dublador Charles Emmanuel venceu na categoria de Melhor Dublagem em Português-BR por sua atuação marcante ao dar voz ao personagem Akaza. O reconhecimento internacional destaca a excelência da dublagem brasileira no cenário mundial." },
      { type: "paragraph", text: "Com uma arrecadação histórica nas bilheterias e um verdadeiro domínio nas maiores premiações do planeta, Demon Slayer: Castelo Infinito firma definitivamente seu nome na história do audiovisual moderno." },
    ],
  },
  {
    id: "guerra-do-streaming",
    title: "Plataformas investem bilhões em animação e impulsionam nova era de filmes nos animes",
    subtitle: "Streamings apostam bilhões em conteúdo animado, e os animes ganham uma nova era nos cinemas.",
    category: "Negócios",
    date: "2026-10-18T12:00:00Z",
    author: "Alex Turner",
    image: imgStreaming,
    accent: "blue",
    trending: true,
    blocks: [
      { type: "paragraph", text: "A guerra pela atenção do espectador global ganhou um novo e bilionário campo de batalha: a animação. O que antes era tratado como um nicho secundário pelas plataformas de streaming tornou-se uma das principais estratégias para atração e retenção de assinantes em todo o mundo. Lideradas por gigantes como Netflix, Disney+ e Amazon Prime Video, as empresas têm destinado orçamentos colossais para a criação de conteúdos animados originais e licenciamento exclusivo." },
      { type: "paragraph", text: "Exemplos desse investimento massivo não faltam. A Netflix transformou obras animadas em verdadeiros fenômenos globais e aclamados pela crítica, como a premiada série Arcane, baseada no universo de League of Legends, além de produções como Cyberpunk: Mercenários e o indicado ao Oscar Klaus. Já a Disney reforçou seu catálogo com expansões de grandes franquias em formato animado, a exemplo de Star Wars: Visions e What If...?, atraindo públicos de todas as idades para o ambiente digital." },
      { type: "paragraph", text: "Paralelamente a essa expansão do streaming, a indústria japonesa de animação vem estabelecendo um novo padrão comercial e narrativo: a adaptação de arcos inteiros em formato de longa-metragem para os cinemas antes de sua chegada às telas domésticas. Em vez de veicular enredos decisivos apenas em episódios semanais na televisão, estúdios renomados têm apostado na experiência cinematográfica para eventos cruciais de suas obras." },
      { type: "paragraph", text: "O modelo, que ganhou força estrondosa com o fenômeno Demon Slayer: Mugen Train e se consolidou com o arco Castelo Infinito, passou a ser adotado por diversas outras grandes franquias da atualidade. Títulos de peso como Chainsaw Man — que levou o importante Arco da Reze para as telonas em Chainsaw Man The Movie: Reze Arc — e Jujutsu Kaisen comprovam a eficácia do formato. A estratégia garante bilheterias recordes nos cinemas e, posteriormente, gera um engajamento estrondoso ao estrear de forma exclusiva nas plataformas digitais." },
      { type: "paragraph", text: "Essa união entre produções originais milionárias e o lançamento cinematográfico de arcos canônicos reforça como o mercado de animações deixou de ser um mero complemento de catálogo para se posicionar como o verdadeiro pilar de crescimento da indústria do entretenimento moderno." },
    ],
  },
];

export const getArticle = (id: string): Article | undefined => ARTICLES.find((a) => a.id === id);

// ─── Notícias rápidas ─────────────────────────────────────────────────────────

export interface QuickNews {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  accent: "blue" | "yellow" | "orange";
  /** frase curta mostrada com o cartão fechado */
  summary: string;
  /** notícia completa (3 a 4 linhas), mostrada ao clicar em "LEIA MAIS" */
  content: string;
}

export const QUICK_NEWS: QuickNews[] = [
  {
    id: "one-piece-elbaf",
    title: "One Piece divulga trailer do Arco de Elbaf e anuncia estreia para abril de 2026",
    category: "Anime Shounen",
    date: "2026-02-24T12:00:00Z",
    author: "Jessica Park",
    accent: "orange",
    summary: "O primeiro trailer do aguardado Arco de Elbaf já está no ar.",
    content:
      "One Piece divulgou o primeiro trailer do aguardado Arco de Elbaf, revelando cenas inéditas, novos desafios e a tão esperada chegada à terra dos gigantes. A prévia já movimenta os fãs com promessas de batalhas épicas e grandes revelações, e a estreia está marcada para abril de 2026.",
  },
  {
    id: "ghibli-novo-longa",
    title: "Studio Ghibli Anuncia Novo Longa-Metragem",
    category: "Produção",
    date: "2026-02-21T12:00:00Z",
    author: "Kenji Yamamoto",
    accent: "orange",
    summary: "O lendário estúdio revela detalhes sobre seu próximo projeto.",
    content:
      "O lendário estúdio revela detalhes sobre seu próximo projeto, com lançamento previsto para o final de 2027. Por enquanto, poucas informações foram divulgadas sobre a história e a equipe criativa, e a expectativa entre os fãs é enorme.",
  },
  {
    id: "animadores-independentes",
    title: "Animadores Independentes Encontram Sucesso nas Redes Sociais",
    category: "Cultura",
    date: "2026-02-19T12:00:00Z",
    author: "Sophie Chen",
    accent: "yellow",
    summary: "Criadores constroem audiência direto na internet, sem estúdios.",
    content:
      "Uma nova geração de criadores contorna estúdios tradicionais, construindo audiências diretamente online. Curtas e séries independentes ganham espaço nas redes, e muitos já conseguem financiar novos projetos com o apoio do próprio público.",
  },
  {
    id: "tecnicas-classicas",
    title: "Técnicas Clássicas de Animação Fazem Retorno",
    category: "Tendências",
    date: "2026-02-18T12:00:00Z",
    author: "Robert Blake",
    accent: "orange",
    summary: "Desenho à mão e stop-motion voltam a ganhar força.",
    content:
      "Animação desenhada à mão e stop-motion veem ressurgimento conforme o público anseia por artesanato tradicional. Produções que valorizam o traço e o trabalho manual têm chamado a atenção de fãs e da crítica.",
  },
  {
    id: "coproducoes-internacionais",
    title: "Coproduções Internacionais Atingem Novos Patamares",
    category: "Indústria",
    date: "2026-02-17T12:00:00Z",
    author: "Nina Patel",
    accent: "blue",
    summary: "Parcerias entre países unem diferentes perspectivas culturais.",
    content:
      "Colaborações transfronteiriças estão criando projetos animados únicos que combinam perspectivas culturais. A troca entre equipes de países diferentes traz novos estilos visuais e histórias para o público do mundo todo.",
  },
  {
    id: "educacao-em-animacao",
    title: "Programas de Educação em Animação Expandem Globalmente",
    category: "Educação",
    date: "2026-02-16T12:00:00Z",
    author: "David Wong",
    accent: "yellow",
    summary: "Novas escolas formam a próxima geração de talentos.",
    content:
      "Novas escolas e programas estão treinando a próxima geração de talentos de animação em todo o mundo. Os cursos combinam técnicas tradicionais, ferramentas digitais e contato direto com profissionais da indústria.",
  },
];

// ─── Utilitários ──────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/** "2026-02-24T12:00:00Z" → "24 Fev, 2026" */
export function formatNewsDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}

/** Chave usada para guardar os comentários de um artigo (separada das chaves das críticas) */
export const articleCommentKey = (articleId: string) => `news-${articleId}`;

export const ACCENT_BAR: Record<"blue" | "yellow" | "orange", string> = {
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  orange: "bg-orange-500",
};
