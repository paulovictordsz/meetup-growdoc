# meetup-growdoc

Repositório central de páginas da **meetup.growdoc.com.br**.
Todas as páginas vivem aqui — site principal e LPs — e sobem juntas com um único comando.

---

## Estrutura

```
meetup-growdoc/
├── deploy.sh        ← script central de build + deploy
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
Pasta gerada pelo `deploy.sh`. O conteúdo final que vai para o Cloudflare Pages.
**Nunca edite arquivos aqui diretamente** — qualquer mudança será sobrescrita no próximo deploy.

---

## Deploy

Rode sempre a partir da raiz do repositório:

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
5. Faz deploy de `site/` no Cloudflare Pages (`meetup-growdoc`)

---

## Adicionar uma nova LP

**1. Crie a pasta do projeto em `lps/`:**

```bash
# Exemplo: nova LP chamada "evento"
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

**3. Registre no `deploy.sh`:**

```bash
LPS=(
  "growth"
  "evento"    # ← adicione aqui
)
```

**4. Faça o deploy:**

```bash
./deploy.sh
```

A LP estará disponível em `meetup.growdoc.com.br/evento`.

---

## Pré-requisitos

- [Node.js](https://nodejs.org) 18+
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) autenticado

```bash
npm install -g wrangler
wrangler login
```
