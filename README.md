# TOONFRAME 🎬

Comunidade para fãs de animação avaliarem filmes e séries, lerem notícias e se conectarem.

Esta versão **não usa banco de dados nem servidor**: é só o frontend, e todos os dados
(contas, perfis, críticas, comentários e curtidas) ficam salvos no `localStorage` do navegador.

## ▶️ Como rodar

Pré-requisito: [Node.js](https://nodejs.org) 18 ou superior.

```bash
npm install
npm run dev      # abre em http://localhost:5173
```

Para gerar a versão de produção:

```bash
npm run build    # gera a pasta dist/
```

## 📋 Funcionalidades

- Criação de conta e login (usuário e senha)
- Críticas de animações com nota de 1 a 5 estrelas
- Discussões da comunidade (sem nota, com categorias próprias: Debate, Teoria, Recomendação, Dúvida, Nostalgia e Curiosidade). Críticas e discussões aparecem juntas na página Críticas, com filtro por tipo e categoria
- Comentários, respostas e curtidas
- Amigos e filmes favoritos
- Notícias
- Perfil personalizável (nome, bio, foto e capa)
- Modo claro e escuro (botão no topo da página; lembra a escolha e, na primeira visita, segue a preferência do sistema)
- Upload de imagens direto do dispositivo (foto de perfil, capa e imagem da crítica)

## 💾 Como os dados são salvos

| Chave no localStorage | Conteúdo |
| --- | --- |
| `tf_users` | contas, perfis, amigos e favoritos |
| `tf_reviews` | críticas e discussões criadas pelos usuários e curtidas (as 10 críticas e 5 discussões de exemplo vêm do código, em `src/lib/store.ts`) |
| `tf_comments` | comentários |
| `toonframe_session` | usuário que está logado |
| `toonframe_theme` | tema escolhido (`light` ou `dark`) |

Pontos importantes:

- Os dados ficam **apenas naquele navegador e naquele aparelho**. Quem acessar o site em outro
  navegador começa do zero, e limpar os dados do navegador apaga tudo.
- As contas existem só no navegador de quem as criou, e as senhas ficam guardadas em texto puro no
  `localStorage`. Isso serve para um projeto acadêmico/demonstração, **não** para uso real.
- As imagens escolhidas são redimensionadas e comprimidas e guardadas dentro do `localStorage`, que tem limite de ~5 MB por site. Para uso normal é suficiente (cada imagem fica entre ~20 e ~200 KB), mas dezenas de críticas com imagem podem encher o espaço.
- Para resetar o app, abra o DevTools (F12) → Application → Local Storage e apague as chaves acima.

## ♿ Acessibilidade

- Modo escuro com contraste mínimo de 4,5:1 para textos e 3:1 para bordas/ícones (WCAG 2.1 AA)
- Botão de tema acessível por teclado e leitor de tela (`aria-pressed`)
- Indicador de foco visível em links e botões nos dois temas
- Respeita `prefers-reduced-motion` e `prefers-color-scheme`

## 🛠️ Tecnologias

React 18 · TypeScript · Vite · React Router · Tailwind CSS v4 · shadcn/ui · Lucide

## 📁 Estrutura

```
src/
├── app/
│   ├── components/   # telas (Home, Reviews, News, Profile, Login...) e modais
│   │   └── ui/       # componentes shadcn/ui
│   ├── contexts/     # AuthContext (login/sessão), UserContext e ThemeContext (modo escuro)
│   └── routes.ts     # rotas
├── assets/           # imagens e logo
│   └── reviews/      # capas das críticas de exemplo (troque o arquivo mantendo o nome)
├── lib/
│   ├── store.ts      # camada de dados em localStorage
│   └── imageUtils.ts # redimensiona/comprime imagens enviadas
└── styles/
```

## 🚀 Deploy (Vercel)

O projeto já inclui o `vercel.json` necessário (reescrita de rotas para o React Router).
Basta importar o repositório na Vercel: o framework Vite é detectado automaticamente
(Build Command `npm run build`, Output Directory `dist`). Não é preciso configurar variáveis de ambiente.
