// Monta o índice da busca com o que existe hoje no site:
//  • usuários (perfis de exemplo + contas criadas neste navegador)
//  • publicações (críticas e discussões)
//  • notícias (artigos e notícias rápidas)
import { userStore, reviewStore, isDiscussion } from "./store";
import { ARTICLES, QUICK_NEWS, formatNewsDate, type ArticleBlock } from "./news";
import { normalize, type IndexEntry, type IndexField } from "./searchCore";

export * from "./searchCore";

/** Parâmetro da página /news que abre e destaca uma notícia rápida (usado pelos resultados da busca) */
export const QUICK_NEWS_PARAM = "aberta";

function fields(list: [string | undefined, number][]): IndexField[] {
  return list
    .filter((f): f is [string, number] => Boolean(f[0]))
    .map(([text, weight]) => ({ text, norm: normalize(text), weight }));
}

function articleText(blocks: ArticleBlock[]): string {
  return blocks
    .map((b) => (b.type === "list" ? b.items.map((i) => `${i.lead ?? ""} ${i.text}`).join(" ") : b.text))
    .join(" ");
}

function time(iso: string): number {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? 0 : t;
}

function shortDate(iso: string): string {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleDateString("pt-BR");
}

export function buildSearchIndex(currentUserId?: string | null): IndexEntry[] {
  const entries: IndexEntry[] = [];

  for (const user of userStore.getAll()) {
    const { name, bio, profileImage } = user.profile;
    entries.push({
      kind: "user",
      icon: "user",
      key: `user-${user.id}`,
      to: user.id === currentUserId ? "/profile" : `/user/${user.username}`,
      title: name || user.username,
      subtitle: `@${user.username}`,
      badge: "USUÁRIO",
      image: profileImage || undefined,
      meta: "",
      fields: fields([
        [name, 10],
        [user.username, 10],
        [bio, 3],
      ]),
      snippetFrom: bio ? [bio] : [],
      sort: 0,
      exact: [normalize(user.username)],
    });
  }

  for (const post of reviewStore.getAll()) {
    const discussion = isDiscussion(post);
    entries.push({
      kind: "post",
      icon: discussion ? "discussion" : "review",
      key: `post-${post.id}`,
      to: `/reviews/${post.id}`,
      title: post.title,
      subtitle: "",
      badge: discussion ? "DISCUSSÃO" : "CRÍTICA",
      image: post.image || undefined,
      meta: [`por ${post.authorName}`, post.category].filter(Boolean).join(" • "),
      fields: fields([
        [post.title, 10],
        [post.authorName, 5],
        [post.authorUsername, 5],
        [post.category, 4],
        [post.subtitle, 4],
        [post.excerpt, 3],
        [post.fullContent, 1],
      ]),
      snippetFrom: [post.excerpt, post.subtitle, post.fullContent],
      sort: time(post.date),
    });
  }

  for (const article of ARTICLES) {
    const body = articleText(article.blocks);
    entries.push({
      kind: "news",
      icon: "article",
      key: `article-${article.id}`,
      to: `/news/${article.id}`,
      title: article.title,
      subtitle: "",
      badge: "ARTIGO",
      image: article.image || undefined,
      meta: [article.category, formatNewsDate(article.date)].filter(Boolean).join(" • "),
      fields: fields([
        [article.title, 10],
        [article.category, 5],
        [article.author, 4],
        [article.subtitle, 3],
        [body, 1],
      ]),
      snippetFrom: [article.subtitle, body],
      sort: time(article.date),
    });
  }

  for (const item of QUICK_NEWS) {
    entries.push({
      kind: "news",
      icon: "quick",
      key: `quick-${item.id}`,
      to: `/news?${QUICK_NEWS_PARAM}=${encodeURIComponent(item.id)}`,
      title: item.title,
      subtitle: "",
      badge: "NOTÍCIA RÁPIDA",
      meta: [item.category, shortDate(item.date)].filter(Boolean).join(" • "),
      fields: fields([
        [item.title, 10],
        [item.category, 5],
        [item.author, 4],
        [item.summary, 3],
        [item.content, 2],
      ]),
      snippetFrom: [item.summary, item.content],
      sort: time(item.date),
    });
  }

  return entries;
}
