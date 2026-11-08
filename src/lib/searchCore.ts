// Núcleo da busca do Toonframe (sem React e sem acesso ao localStorage, para ser fácil de testar).
// A montagem do índice (quais usuários, publicações e notícias entram) fica em search.ts.

export type SearchKind = "user" | "post" | "news";
export type ResultIcon = "user" | "review" | "discussion" | "article" | "quick";

export const MIN_QUERY_LENGTH = 2;
export const RESULT_LIMITS: Record<SearchKind, number> = { user: 4, post: 5, news: 5 };

export interface IndexField {
  /** texto original */
  text: string;
  /** texto sem acento e em minúsculas (calculado uma vez ao montar o índice) */
  norm: string;
  /** importância do campo: título pesa mais que o corpo do texto */
  weight: number;
}

export interface IndexEntry {
  kind: SearchKind;
  icon: ResultIcon;
  key: string;
  /** rota para onde o resultado leva */
  to: string;
  title: string;
  /** linha fixa abaixo do título (ex.: @usuario) */
  subtitle: string;
  badge: string;
  image?: string;
  meta: string;
  fields: IndexField[];
  /** textos de onde sai o trecho mostrado (o primeiro que contiver a busca é usado) */
  snippetFrom: string[];
  /** desempate: data (timestamp) da publicação/notícia */
  sort: number;
  /** textos normalizados que dão pontos extras quando a busca é idêntica (ex.: nome de usuário) */
  exact?: string[];
}

export interface SearchResult {
  key: string;
  kind: SearchKind;
  icon: ResultIcon;
  to: string;
  title: string;
  subtitle: string;
  detail: string;
  meta: string;
  badge: string;
  image?: string;
}

export interface SearchResults {
  users: SearchResult[];
  posts: SearchResult[];
  news: SearchResult[];
  /** total de resultados achados em cada grupo (antes de limitar a lista) */
  totals: Record<SearchKind, number>;
  total: number;
}

export const EMPTY_RESULTS: SearchResults = {
  users: [],
  posts: [],
  news: [],
  totals: { user: 0, post: 0, news: 0 },
  total: 0,
};

// ─── Texto ────────────────────────────────────────────────────────────────────

const MARKS = /[\u0300-\u036f]/g;

/** "Ação" → "acao": minúsculas e sem acentos, para a busca ignorar os dois */
export function normalize(text: string): string {
  return text.normalize("NFD").toLowerCase().replace(MARKS, "");
}

/** Igual a normalize, mas guarda de onde veio cada caractere (para marcar o trecho no texto original) */
export function normalizeWithMap(text: string): { norm: string; map: number[] } {
  let norm = "";
  const map: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const piece = text[i].normalize("NFD").toLowerCase().replace(MARKS, "");
    for (let j = 0; j < piece.length; j++) map.push(i);
    norm += piece;
  }
  return { norm, map };
}

/** Palavras da busca: sem acento, sem "@" no começo, sem repetição */
export function tokenize(query: string): string[] {
  const words = normalize(query)
    .split(/\s+/)
    .map((w) => w.replace(/^@+/, ""))
    .filter(Boolean);
  return Array.from(new Set(words));
}

export function isSearchable(query: string): boolean {
  return tokenize(query).join("").length >= MIN_QUERY_LENGTH;
}

/** Trechos [início, fim) do texto original que batem com a busca (para destacar) */
export function highlightRanges(text: string, tokens: string[]): [number, number][] {
  if (!text || tokens.length === 0) return [];
  const { norm, map } = normalizeWithMap(text);
  const ranges: [number, number][] = [];
  for (const token of tokens) {
    if (!token) continue;
    let from = 0;
    while (from <= norm.length - token.length) {
      const at = norm.indexOf(token, from);
      if (at === -1) break;
      ranges.push([map[at], map[at + token.length - 1] + 1]);
      from = at + token.length;
    }
  }
  ranges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged: [number, number][] = [];
  for (const [s, e] of ranges) {
    const last = merged[merged.length - 1];
    if (last && s <= last[1]) last[1] = Math.max(last[1], e);
    else merged.push([s, e]);
  }
  return merged;
}

/** Recorte curto do texto em volta do primeiro trecho que bate com a busca */
export function makeSnippet(text: string, tokens: string[], max = 130): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const { norm, map } = normalizeWithMap(clean);
  let at = -1;
  for (const token of tokens) {
    const i = norm.indexOf(token);
    if (i !== -1 && (at === -1 || i < at)) at = i;
  }
  if (at === -1 || clean.length <= max) {
    return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
  }
  const hit = map[at];
  let start = Math.max(0, hit - 40);
  if (start > 0) {
    const space = clean.indexOf(" ", start);
    if (space !== -1 && space < hit) start = space + 1;
  }
  const end = Math.min(clean.length, start + max);
  return `${start > 0 ? "…" : ""}${clean.slice(start, end).trim()}${end < clean.length ? "…" : ""}`;
}

function pickSnippet(sources: string[], tokens: string[]): string {
  for (const source of sources) {
    if (!source) continue;
    const norm = normalize(source);
    if (tokens.some((t) => norm.includes(t))) return makeSnippet(source, tokens);
  }
  const first = sources.find(Boolean) ?? "";
  return makeSnippet(first, tokens);
}

// ─── Pontuação ────────────────────────────────────────────────────────────────

/** 0 = não serve. Toda palavra da busca precisa aparecer em algum campo. */
function scoreEntry(entry: IndexEntry, tokens: string[]): number {
  let total = 0;
  for (const token of tokens) {
    let best = 0;
    for (const field of entry.fields) {
      const at = field.norm.indexOf(token);
      if (at === -1) continue;
      const startsWord = at === 0 || !/[a-z0-9]/.test(field.norm[at - 1]);
      const value = field.weight * (startsWord ? 1 : 0.6);
      if (value > best) best = value;
    }
    if (best === 0) return 0;
    total += best;
  }
  if (entry.exact && entry.exact.some((e) => tokens.includes(e))) total += 8;
  return total;
}

export function runSearch(
  index: IndexEntry[],
  query: string,
  limits: Record<SearchKind, number> = RESULT_LIMITS
): SearchResults {
  if (!isSearchable(query)) return EMPTY_RESULTS;
  const tokens = tokenize(query);

  const scored = index
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || b.entry.sort - a.entry.sort);

  const toResult = (entry: IndexEntry): SearchResult => ({
    key: entry.key,
    kind: entry.kind,
    icon: entry.icon,
    to: entry.to,
    title: entry.title,
    subtitle: entry.subtitle,
    detail: pickSnippet(entry.snippetFrom, tokens),
    meta: entry.meta,
    badge: entry.badge,
    image: entry.image,
  });

  const group = (kind: SearchKind) => scored.filter((s) => s.entry.kind === kind);
  const users = group("user");
  const posts = group("post");
  const news = group("news");

  return {
    users: users.slice(0, limits.user).map((s) => toResult(s.entry)),
    posts: posts.slice(0, limits.post).map((s) => toResult(s.entry)),
    news: news.slice(0, limits.news).map((s) => toResult(s.entry)),
    totals: { user: users.length, post: posts.length, news: news.length },
    total: scored.length,
  };
}
