import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { Search, X, User, Star, MessageSquare, Newspaper, Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  buildSearchIndex,
  runSearch,
  tokenize,
  highlightRanges,
  isSearchable,
  EMPTY_RESULTS,
  MIN_QUERY_LENGTH,
  type SearchResult,
  type SearchKind,
} from "../../lib/search";

const PANEL_ID = "busca-painel";
const LIST_ID = "busca-resultados";
const INPUT_ID = "busca-campo";

const optionId = (r: SearchResult) => `busca-opcao-${r.key}`;

const ICONS = {
  user: User,
  review: Star,
  discussion: MessageSquare,
  article: Newspaper,
  quick: Zap,
} as const;

const GROUPS: { kind: SearchKind; label: string; bar: string }[] = [
  { kind: "user", label: "USUÁRIOS", bar: "bg-yellow-400" },
  { kind: "post", label: "PUBLICAÇÕES", bar: "bg-blue-500" },
  { kind: "news", label: "NOTÍCIAS", bar: "bg-orange-500" },
];

// ─── Atalho de teclado: "/" ou Ctrl/⌘ + K abrem a busca ───────────────────────

export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      const isSlash = e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey;
      const isCtrlK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if ((isSlash && !typing) || isCtrlK) {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpen]);
}

// ─── Botão (fica no header) ───────────────────────────────────────────────────

export function SearchButton({
  open,
  onClick,
  className = "",
}: {
  open: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      data-search-trigger
      onClick={onClick}
      aria-label="Buscar usuários, publicações e notícias"
      aria-expanded={open}
      aria-controls={PANEL_ID}
      title="Buscar (atalho: /)"
      className={`inline-flex items-center justify-center w-11 h-11 border-2 border-black dark:border-neutral-400 transition-colors ${
        open
          ? "bg-black text-white dark:bg-neutral-100 dark:text-black"
          : "bg-white dark:bg-neutral-900 text-black dark:text-neutral-100 hover:bg-gray-100 dark:hover:bg-neutral-800"
      } ${className}`}
    >
      <Search className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}

// ─── Trecho com as palavras buscadas destacadas ──────────────────────────────

function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  const ranges = useMemo(() => highlightRanges(text, tokens), [text, tokens]);
  if (ranges.length === 0) return <>{text}</>;
  const parts: ReactNode[] = [];
  let last = 0;
  ranges.forEach(([start, end], i) => {
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      <mark key={i} className="bg-yellow-300 text-black px-0.5">
        {text.slice(start, end)}
      </mark>
    );
    last = end;
  });
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Thumb({ result }: { result: SearchResult }) {
  const Icon = ICONS[result.icon];
  const frame =
    "w-12 h-12 shrink-0 border-2 border-black dark:border-neutral-400 overflow-hidden flex items-center justify-center";
  if (result.image) {
    return (
      <div className={`${frame} bg-gray-100 dark:bg-neutral-800`}>
        <ImageWithFallback src={result.image} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }
  if (result.kind === "user") {
    return (
      <div className={`${frame} bg-yellow-400 text-black font-black text-lg`} aria-hidden="true">
        {result.title.trim().charAt(0).toUpperCase() || "?"}
      </div>
    );
  }
  return (
    <div className={`${frame} bg-gray-100 dark:bg-neutral-800`} aria-hidden="true">
      <Icon className="w-5 h-5" />
    </div>
  );
}

// ─── Painel de busca ──────────────────────────────────────────────────────────

export function SearchPanel({ open, onClose }: { open: boolean; onClose: (restoreFocus?: boolean) => void }) {
  const navigate = useNavigate();
  const { currentProfile } = useAuth();
  const currentUserId = currentProfile?.id ?? null;

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // O índice é montado a cada abertura, assim contas e publicações novas já aparecem.
  const index = useMemo(() => (open ? buildSearchIndex(currentUserId) : []), [open, currentUserId]);
  const tokens = useMemo(() => tokenize(query), [query]);
  const results = useMemo(() => (open ? runSearch(index, query) : EMPTY_RESULTS), [open, index, query]);
  const flat = useMemo(() => [...results.users, ...results.posts, ...results.news], [results]);
  const searchable = isSearchable(query);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
    setQuery("");
    setActive(0);
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open || !flat[active]) return;
    document.getElementById(optionId(flat[active]))?.scrollIntoView({ block: "nearest" });
  }, [active, flat, open]);

  if (!open) return null;

  const go = (result: SearchResult) => {
    navigate(result.to);
    onClose(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (flat.length) setActive((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (flat.length) setActive((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      if (flat[active]) {
        e.preventDefault();
        go(flat[active]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose(true);
    } else if (e.key === "Tab") {
      onClose(false);
    }
  };

  const statusText = !searchable
    ? ""
    : flat.length === 0
      ? "Nenhum resultado encontrado."
      : `${results.total} ${results.total === 1 ? "resultado encontrado" : "resultados encontrados"}.`;

  let position = -1;

  return (
    <div className="fixed inset-x-0 bottom-0 top-[68px] sm:top-[84px] z-40">
      {/* fundo escurecido: clicar fora fecha a busca */}
      <div className="absolute inset-0 bg-black/50" onClick={() => onClose(false)} aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto sm:px-6 lg:px-8 flex justify-end pointer-events-none">
        <div
          id={PANEL_ID}
          role="search"
          className="pointer-events-auto w-full sm:max-w-xl flex flex-col max-h-[calc(100vh_-_68px_-_1rem)] sm:max-h-[calc(100vh_-_84px_-_2rem)] bg-white dark:bg-neutral-900 text-black dark:text-neutral-100 border-4 border-t-0 border-black dark:border-neutral-400 sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:sm:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.25)]"
        >
          {/* campo de busca */}
          <div className="flex items-center gap-2 p-3 border-b-4 border-black dark:border-neutral-400">
            <label htmlFor={INPUT_ID} className="sr-only">
              Buscar usuários, publicações e notícias
            </label>
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
              />
              <input
                id={INPUT_ID}
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={flat.length > 0}
                aria-controls={LIST_ID}
                aria-autocomplete="list"
                aria-activedescendant={flat[active] ? optionId(flat[active]) : undefined}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                enterKeyHint="search"
                placeholder="Buscar usuários, publicações e notícias"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full min-h-[44px] pl-10 pr-11 border-2 border-black dark:border-neutral-400 bg-white dark:bg-neutral-950 text-black dark:text-neutral-100 font-bold placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-yellow-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Limpar busca"
                  className="absolute right-0 top-0 w-11 h-11 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => onClose(true)}
              aria-label="Fechar busca"
              className="inline-flex items-center justify-center w-11 h-11 shrink-0 border-2 border-black dark:border-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            {statusText}
          </p>

          {/* conteúdo */}
          <div className="overflow-y-auto overscroll-contain">
            {!searchable && (
              <div className="p-6 text-center">
                <Search className="w-10 h-10 mx-auto mb-3 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                <p className="font-black mb-1">O que você procura?</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Digite pelo menos {MIN_QUERY_LENGTH} letras para achar usuários, publicações (críticas e discussões)
                  e notícias.
                </p>
              </div>
            )}

            {searchable && flat.length === 0 && (
              <div className="p-6 text-center">
                <p className="font-black mb-1 break-words">Nenhum resultado para “{query.trim()}”</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Confira a escrita ou tente uma palavra mais curta. Você pode buscar por nome, @usuário, título,
                  categoria ou trechos do texto.
                </p>
              </div>
            )}

            {flat.length > 0 && (
              <div id={LIST_ID} role="listbox" aria-label="Resultados da busca">
                {GROUPS.map(({ kind, label, bar }) => {
                  const items = kind === "user" ? results.users : kind === "post" ? results.posts : results.news;
                  if (items.length === 0) return null;
                  const total = results.totals[kind];
                  const headingId = `busca-grupo-${kind}`;
                  return (
                    <div key={kind} role="group" aria-labelledby={headingId}>
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-neutral-800 border-b-2 border-black dark:border-neutral-400">
                        <span className={`w-3 h-3 ${bar}`} aria-hidden="true" />
                        <h3 id={headingId} className="text-xs font-black">
                          {label}
                        </h3>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                          {total > items.length ? `${items.length} de ${total}` : total}
                        </span>
                      </div>

                      {items.map((result) => {
                        position += 1;
                        const isActive = position === active;
                        const myPosition = position;
                        return (
                          <div
                            key={result.key}
                            id={optionId(result)}
                            role="option"
                            aria-selected={isActive}
                            onMouseMove={() => {
                              if (active !== myPosition) setActive(myPosition);
                            }}
                          >
                            <Link
                              to={result.to}
                              tabIndex={-1}
                              onClick={() => onClose(false)}
                              className={`flex items-start gap-3 px-4 py-3 border-b-2 border-b-gray-200 dark:border-b-neutral-700 border-l-4 ${
                                isActive
                                  ? "border-l-black dark:border-l-yellow-400 bg-yellow-50 dark:bg-neutral-800"
                                  : "border-l-transparent"
                              }`}
                            >
                              <Thumb result={result} />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="px-2 py-0.5 bg-black text-white dark:border dark:border-neutral-500 text-[11px] font-black leading-tight whitespace-nowrap">
                                    {result.badge}
                                  </span>
                                </div>
                                <p className="font-black leading-snug break-words">
                                  <Highlight text={result.title} tokens={tokens} />
                                </p>
                                {result.subtitle && (
                                  <p className="text-sm font-bold text-gray-600 dark:text-gray-300 break-words">
                                    <Highlight text={result.subtitle} tokens={tokens} />
                                  </p>
                                )}
                                {result.detail && (
                                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug line-clamp-2 break-words">
                                    <Highlight text={result.detail} tokens={tokens} />
                                  </p>
                                )}
                                {result.meta && (
                                  <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400 break-words">
                                    {result.meta}
                                  </p>
                                )}
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-4 px-4 py-2 border-t-2 border-black dark:border-neutral-400 text-xs font-bold text-gray-600 dark:text-gray-300">
            <span>↑ ↓ navegar</span>
            <span>Enter abrir</span>
            <span>Esc fechar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
