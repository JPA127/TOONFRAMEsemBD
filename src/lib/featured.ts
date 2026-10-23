// Seleção das "Publicações em destaque" da página Início.
import { reviewStore } from "./store";
import type { Review } from "./store";

export const FEATURED_COUNT = 3;

export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Sorteia publicações (críticas e discussões), dando preferência às que têm imagem */
export function pickFeatured(all: Review[], count = FEATURED_COUNT, random: () => number = Math.random): Review[] {
  const withImage = shuffle(all.filter((r) => !!r.image), random);
  const withoutImage = shuffle(all.filter((r) => !r.image), random);
  return [...withImage, ...withoutImage].slice(0, count);
}

let chosenIds: string[] | null = null;

/**
 * Sorteia uma vez a cada abertura do app (carregamento da página) e mantém a escolha enquanto a
 * pessoa navega entre as telas. Abrir o app de novo sorteia outras publicações.
 */
export function getFeaturedPosts(): Review[] {
  const all = reviewStore.getAll();
  if (chosenIds) {
    const byId = new Map(all.map((r) => [r.id, r]));
    const kept = chosenIds.map((id) => byId.get(id)).filter((r): r is Review => !!r);
    // se alguma publicação sorteada foi excluída, sorteia de novo
    if (kept.length === Math.min(FEATURED_COUNT, all.length)) return kept;
  }
  const picked = pickFeatured(all);
  chosenIds = picked.map((r) => r.id);
  return picked;
}

/** As publicações mais novas (pela data), podendo excluir algumas (ex.: as que já estão no carrossel) */
export function pickRecent(all: Review[], count = 3, excludeIds: string[] = []): Review[] {
  const skip = new Set(excludeIds);
  return all
    .filter((r) => !skip.has(r.id))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function getRecentPosts(count = 3, excludeIds: string[] = []): Review[] {
  return pickRecent(reviewStore.getAll(), count, excludeIds);
}
