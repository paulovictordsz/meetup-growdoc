# meetup-growdoc

Repositório central de páginas da **meetup.growdoc.com.br**.
Todas as páginas vivem aqui — site principal e LPs — e sobem juntas com um único comando.

---

## Estrutura

```
meetup-growdoc/
├── build.sh         ← build para CI/CD (Cloudflare Pages + GitHub)
├── deploy.sh        ← build + deploy manual via Wrangler
├── site/            ← gerado automaticamente (não editar)
└── lps/
    ├── meetup/      ← site principal → meetup.growdoc.com.br/
    └── growth/      ← LP GrowDoc    → meetup.growdoc.com.br/growth
```

### `lps/`
Contém o código-fonte de cada projeto. Cada pasta = uma URL.

| Pasta | URL | Tecnologia |
|-------|-----|------------|
| `meetup/` | `meetup.growdoc.com.br/` | HTML + CSS + JS estático |
| `growth/` | `meetup.growdoc.com.br/growth` | Vite + React + HeroUI |

### `site/`
Pasta gerada pelos scripts de build. O conteúdo final que vai para o Cloudflare Pages.
**Nunca edite arquivos aqui diretamente** — qualquer mudança será sobrescrita no próximo build.

---

## Deploy

Existem duas formas de fazer deploy. Escolha a que melhor se encaixa no seu fluxo.

---

### Opção 1 — Manual (Wrangler local)

Rode direto do terminal, sem depender do GitHub.
Útil para testar e subir rapidamente sem precisar fazer commit.

**Pré-requisitos:**
- [Node.js](https://nodejs.org) 18+
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) autenticado

```bash
npm install -g wrangler
wrangler login
```

**Comandos:**

```bash
# Builda todos os projetos e sobe tudo
./deploy.sh

# Builda e sobe apenas um projeto específico
./deploy.sh growth
./deploy.sh meetup
```

O script:
1. Limpa a pasta `site/`
2. Copia o site principal (`lps/meetup/`) para a raiz de `site/`
3. Builda cada LP com `npm run build` e copia para `site/[nome]/`
4. Atualiza o `_redirects` com as regras de SPA de cada LP
5. Faz deploy de `site/` no Cloudflare Pages via `wrangler pages deploy`

---

### Opção 2 — Automático (Cloudflare Pages + GitHub)

Todo push para `main` dispara o build e o deploy automaticamente.
Não precisa rodar nada localmente — o Cloudflare cuida de tudo.

**Configuração inicial (feita uma única vez no dashboard do Cloudflare):**

1. Acesse o projeto `meetup-growdoc` em [dash.cloudflare.com](https://dash.cloudflare.com)
2. Vá em **Settings → Build & deployments**
3. Conecte ao repositório `paulovictordsz/meetup-growdoc`
4. Configure os campos de build:

| Campo | Valor |
|-------|-------|
| Build command | `./build.sh` |
| Build output directory | `site` |
| Root directory | `/` |

**Uso no dia a dia:**

```bash
# Qualquer push para main dispara o deploy automaticamente
git add .
git commit -m "mensagem"
git push
```

O `build.sh` roda no ambiente do Cloudflare e:
1. Limpa e recria a pasta `site/`
2. Copia o site principal para a raiz
3. Instala dependências e builda cada LP
4. Monta o `_redirects` com as regras de SPA
5. O Cloudflare faz o deploy do `site/` automaticamente

---

## Adicionar uma nova LP

Os passos são os mesmos para as duas opções de deploy.

**1. Crie a pasta do projeto em `lps/`:**

```bash
cd lps
npm create vite@latest evento -- --template react-ts
cd evento
npm install @heroui/react framer-motion @iconify/react tailwindcss @tailwindcss/vite clsx tailwind-merge
```

**2. Configure o `base` no `vite.config.ts`:**

```ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/evento',   // ← nome da pasta = subpath da URL
})
```

**3. Registre nos dois scripts:**

Em `deploy.sh` e em `build.sh`, adicione o nome da LP no array `LPS`:

```bash
LPS=(
  "growth"
  "evento"    # ← adicione aqui
)
```

**4. Faça o deploy:**

```bash
# Manual
./deploy.sh

# Automático — só fazer push
git add . && git commit -m "feat: add LP evento" && git push
```

A LP estará disponível em `meetup.growdoc.com.br/evento`.
