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
- Comentários, respostas e curtidas
- Amigos e filmes favoritos
- Notícias
- Perfil personalizável (nome, bio, foto e capa)

## 💾 Como os dados são salvos

| Chave no localStorage | Conteúdo |
| --- | --- |
| `tf_users` | contas, perfis, amigos e favoritos |
| `tf_reviews` | críticas (4 críticas de exemplo são criadas na primeira visita) |
| `tf_comments` | comentários |
| `toonframe_session` | usuário que está logado |

Pontos importantes:

- Os dados ficam **apenas naquele navegador e naquele aparelho**. Quem acessar o site em outro
  navegador começa do zero, e limpar os dados do navegador apaga tudo.
- As contas existem só no navegador de quem as criou, e as senhas ficam guardadas em texto puro no
  `localStorage`. Isso serve para um projeto acadêmico/demonstração, **não** para uso real.
- Para resetar o app, abra o DevTools (F12) → Application → Local Storage e apague as chaves acima.

## 🛠️ Tecnologias

React 18 · TypeScript · Vite · React Router · Tailwind CSS v4 · shadcn/ui · Lucide

## 📁 Estrutura

```
src/
├── app/
│   ├── components/   # telas (Home, Reviews, News, Profile, Login...) e modais
│   │   └── ui/       # componentes shadcn/ui
│   ├── contexts/     # AuthContext (login/sessão) e UserContext
│   └── routes.ts     # rotas
├── assets/           # imagens e logo
├── lib/store.ts      # camada de dados em localStorage
└── styles/
```

## 🚀 Deploy (Vercel)

O projeto já inclui o `vercel.json` necessário (reescrita de rotas para o React Router).
Basta importar o repositório na Vercel: o framework Vite é detectado automaticamente
(Build Command `npm run build`, Output Directory `dist`). Não é preciso configurar variáveis de ambiente.
