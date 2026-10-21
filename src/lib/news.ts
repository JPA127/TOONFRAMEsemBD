// Notícias do Toonframe. Existem dois tipos:
//  • Artigos: têm página própria (/news/<id>) com texto completo e comentários.
//  • Notícias rápidas: só texto curto, que se expande no próprio cartão ("LEIA MAIS").
import imgCyberpunk from "../assets/news/cyberpunk-edgerunners-2.jpg";

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
  // Os três artigos abaixo ainda usam o texto curto de antes; o texto completo entra quando for enviado.
  {
    id: "ia-pipeline-animacao",
    title: "Nova Tecnologia de IA Transforma Pipeline de Animação",
    subtitle:
      "Ferramentas revolucionárias de IA estão mudando a forma como animadores trabalham, reduzindo o tempo de produção mantendo a integridade artística.",
    category: "Tecnologia",
    date: "2026-02-23T12:00:00Z",
    author: "Tom Richardson",
    accent: "blue",
    trending: true,
    blocks: [
      {
        type: "paragraph",
        text: "Ferramentas revolucionárias de IA estão mudando a forma como animadores trabalham, reduzindo o tempo de produção mantendo a integridade artística.",
      },
    ],
  },
  {
    id: "temporada-premios-animacao",
    title: "Temporada de Prêmios: Animação Domina",
    subtitle: "Longas e séries de animação dominam categorias principais, marcando um ano histórico para o meio.",
    category: "Prêmios",
    date: "2026-02-22T12:00:00Z",
    author: "Maria Lopez",
    accent: "yellow",
    trending: true,
    blocks: [
      {
        type: "paragraph",
        text: "Longas e séries de animação dominam categorias principais, marcando um ano histórico para o meio.",
      },
    ],
  },
  {
    id: "guerra-do-streaming",
    title: "Guerra do Streaming: Animação se Torna Campo de Batalha",
    subtitle: "Principais plataformas de streaming investem bilhões em conteúdo animado original para atrair assinantes.",
    category: "Negócios",
    date: "2026-02-20T12:00:00Z",
    author: "Alex Turner",
    accent: "blue",
    trending: true,
    blocks: [
      {
        type: "paragraph",
        text: "Principais plataformas de streaming investem bilhões em conteúdo animado original para atrair assinantes.",
      },
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
