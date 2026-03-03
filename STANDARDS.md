# Padrões de LP — meetup-growdoc

Regras e convenções obrigatórias para toda nova landing page criada neste repositório.
Leia este arquivo antes de começar qualquer LP nova.

---

## Índice

1. [Estrutura de pastas e registro](#1-estrutura-de-pastas-e-registro)
2. [Stack e dependências](#2-stack-e-dependências)
3. [Identidade visual](#3-identidade-visual)
4. [Performance — HTML estático](#4-performance--html-estático)
5. [Performance — React/Vite](#5-performance--reactvite)
6. [Formulários](#6-formulários)
7. [Seções mínimas de uma LP](#7-seções-mínimas-de-uma-lp)
8. [Deploy](#8-deploy)

---

## 1. Estrutura de pastas e registro

Cada LP vive em `lps/<nome>/`. O nome da pasta é exatamente o subpath da URL.

```
lps/
├── meetup/   → meetup.growdoc.com.br/       (HTML estático)
├── growth/   → meetup.growdoc.com.br/growth  (React)
└── <nova>/   → meetup.growdoc.com.br/<nova>
```

**Ao criar uma nova LP, registre o nome nos dois scripts:**

```bash
# build.sh  e  deploy.sh — array LPS:
LPS=(
  "growth"
  "nova"    # ← adicione aqui
)
```

---

## 2. Stack e dependências

### LP React (padrão para novas LPs)

```bash
cd lps
npm create vite@latest <nome> -- --template react-ts
cd <nome>
npm install @heroui/react framer-motion @iconify/react tailwindcss @tailwindcss/vite clsx tailwind-merge
```

**`vite.config.ts` obrigatório:**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/<nome>',   // ← nome da pasta = subpath
  build: {
    target: 'esnext',                  // elimina polyfills de JS legado
    modulePreload: { polyfill: false }, // remove polyfill do modulepreload (~3 KB)
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'heroui': ['@heroui/react'],
          'motion': ['framer-motion'],
        },
      },
    },
  },
})
```

**`tailwind.config.js` obrigatório** (inclui HeroUI + animações padrão):

```js
const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "scrolling-banner": {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(calc(-50% - var(--gap)/2))" },
        },
      },
      animation: {
        "glow-pulse":       "glow-pulse 4s ease-in-out infinite",
        "fade-in-up":       "fade-in-up 0.6s ease forwards",
        "scrolling-banner": "scrolling-banner var(--duration) linear infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
```

### LP HTML estático

Use somente quando a LP for extremamente simples. Ver `lps/meetup/` como referência.

---

## 3. Identidade visual

### Cores

| Variável | Valor | Uso |
|----------|-------|-----|
| Accent principal | `#07FDC2` | CTAs, destaques, ícones, bordas de foco |
| Accent hover/dark | `#00B494` | Hover de botões |
| Background escuro | `#131515` / `#141616` | Fundo de seções dark |
| Background card dark | `#1a1c1c` | Cards em fundo escuro |
| Texto principal | `#ffffff` | Texto em fundo escuro |
| Texto secundário | `rgba(255,255,255,0.4)` | Subtextos em fundo escuro |

### Tipografia

- **LP React:** Tailwind padrão (system font). Usar `font-black` nos títulos, `tracking-tight`.
- **LP HTML estático:** fonte `Axiforma` hospedada localmente em `font/`. Sempre usar `font-display: swap`.

### Logo

```
Logo clara (fundo escuro): https://bkp.growdoc.com.br/wp-content/uploads/2025/01/GrowDoc-Logo-11.png
Logo escura (fundo claro): https://bkp.growdoc.com.br/wp-content/uploads/2025/01/GrowDoc-Logo-1.webp
Favicon SVG local: images/grow_ico.svg
```

### Botão CTA padrão (React)

```tsx
const ACCENT = "#07FDC2";
const BG = "#131515";

<Button
  as="a"
  href="#formulario"
  size="lg"
  radius="md"
  className="font-black uppercase text-sm tracking-widest h-14 px-10 transition-all duration-200 hover:scale-105"
  style={{
    backgroundColor: ACCENT,
    color: BG,
    boxShadow: `0 0 32px ${ACCENT}55`,
  }}
>
  Quero ter mais resultados
</Button>
```

---

## 4. Performance — HTML estático

Obrigatório em todo `<head>` de LP HTML:

```html
<!-- 1. preconnect para rastreadores -->
<link rel="preconnect" href="https://connect.facebook.net">
<link rel="dns-prefetch" href="https://connect.facebook.net">

<!-- 2. preload das imagens hero (mobile e desktop separados) -->
<link rel="preload" href="images/bg-mobile.webp"  as="image" media="(max-width: 768px)"  fetchpriority="high">
<link rel="preload" href="images/bg-desktop.webp" as="image" media="(min-width: 769px)"  fetchpriority="high">

<!-- 3. preload das fontes críticas (as usadas no hero) -->
<link rel="preload" href="font/Axiforma-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="font/Axiforma-Bold.woff2"    as="font" type="font/woff2" crossorigin>

<!-- 4. CSS crítico inline (hero + fontes + reset) — evita bloqueio do LCP -->
<style>
  /* @font-face declarations */
  /* reset mínimo: *, :root, body */
  /* estilos do hero, CTA e media queries mobile */
</style>

<!-- 5. CSS completo carregado assincronamente -->
<link rel="preload" href="style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="style.css"></noscript>

<!-- 6. Meta Pixel — carrega após page load (não bloqueia LCP) -->
<script>
window.addEventListener('load', function() {
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '824344831959206');
  fbq('track', 'PageView');
});
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=824344831959206&ev=PageView&noscript=1"
/></noscript>
```

**Regras gerais:**
- Imagem hero com `fetchpriority="high"` no `<img>` ou via `preload`
- Nunca carregar scripts de terceiros de forma síncrona no `<head>`
- CSS crítico = apenas o que aparece above-the-fold (hero, fontes, reset)

---

## 5. Performance — React/Vite

- `manualChunks` sempre configurado (ver seção 2)
- `build.target: 'esnext'` e `modulePreload: { polyfill: false }` para remover polyfills desnecessários
- **LCP element** (logo no hero): preload obrigatório no `index.html` + `fetchPriority="high"` na tag `<img>`
- Dimensões explícitas (`width` e `height`) em todas as imagens para evitar CLS
- `loading="lazy"` em todas as imagens que não estão no hero (abaixo do dobramento)
- Animações com `whileInView + viewport={{ once: true }}` (Framer Motion) — não anima de novo ao rolar de volta
- Animações de entrada do hero com `animate` (não `whileInView`) — já estão visíveis no load
- Não importar bibliotecas pesadas que não serão usadas em todas as seções

**`index.html` template obrigatório para LP React:**

```html
<!-- SEO: description + og: + twitter: + canonical -->

<!-- preconnect para domínios externos usados na LP -->
<link rel="preconnect" href="https://connect.facebook.net">
<link rel="dns-prefetch" href="https://connect.facebook.net">
<link rel="preconnect" href="https://bkp.growdoc.com.br" crossorigin>
<link rel="dns-prefetch" href="https://bkp.growdoc.com.br">

<!-- preload do LCP element (logo/hero image) -->
<link rel="preload" href="URL_DO_LOGO" as="image" fetchpriority="high">

<!-- Critical CSS inline — evita flash branco antes do React montar -->
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#131515;color:#fff;font-family:system-ui,-apple-system,sans-serif}#root{min-height:100dvh}</style>

<!-- Meta Pixel após window load (não bloqueia LCP) -->
<script>window.addEventListener('load', function() { /* pixel */ });</script>
```

---

## 6. Formulários

**Ver `FORMS.md` para as regras completas.**

Resumo obrigatório:

- **Webhook (redirect):** `GET https://webhooks02.manager01.growdoc.com.br/webhook/redirect-global`
- **Supabase (backup):** `GET https://lswmkiyqznvuedbuyrkt.supabase.co/functions/v1/capture-lead`
- Perguntas: keys `01`, `02`, `03`... (não nomes de campos)
- Valores das respostas: texto legível completo (ex: `"Tenho consultório e quero crescer"`)
- UTMs capturados da URL → persistidos em `localStorage` → enviados no submit
- Todos os campos UTM sempre presentes, mesmo que vazios
- Supabase: `fetch(..., { keepalive: true })` sem `await` — não bloqueia o redirect
- Redirect: `window.location.href = WEBHOOK_URL + "?" + params.toString()`

### Campos obrigatórios no webhook

```
name, email (vazio ok), phone (só dígitos), page_url,
01, 02, ...,
utm_source, utm_campaign, utm_medium, utm_content,
utm_term, utm_id, fbclid, gclid, wbraid
```

---

## 7. Seções mínimas de uma LP

### Ordem padrão (React)

```
TopBanner  →  Hero  →  LeadForm  →  [seções de conteúdo]  →  Footer
```

**TopBanner:** Faixa de urgência/exclusividade no topo. Fundo vermelho (`bg-red-600`), texto em branco, uppercase.

**Hero:** Headline principal com animação `animate` (não `whileInView`). CTA primário visível sem scroll. Logo GrowDoc no topo.

**LeadForm:** Acima do dobramento ou logo após o hero. ID `formulario` no elemento (`id="formulario"`). Campos mínimos: nome, telefone (com máscara), 2 perguntas qualificadoras.

**Footer:** Logo + copyright. Separador com gradiente accent. `© {new Date().getFullYear()} GrowDoc.`

### Efeito glow (padrão estético)

```tsx
// Usar em seções dark para criar profundidade
<div
  className="pointer-events-none absolute inset-0 flex items-center justify-center"
>
  <div
    className="w-[800px] h-[500px] rounded-full animate-glow-pulse"
    style={{ background: `radial-gradient(ellipse at center, ${ACCENT}15 0%, transparent 65%)` }}
  />
</div>
```

---

## 8. Deploy

Nenhum arquivo em `site/` deve ser editado manualmente — é gerado automaticamente.

```bash
# CI/CD automático (recomendado)
git add . && git commit -m "feat: add LP <nome>" && git push

# Manual
./deploy.sh         # todas as LPs
./deploy.sh <nome>  # LP específica
```

Para adicionar uma nova LP ao pipeline, registre o nome da pasta em `LPS=(...)` em **ambos** `build.sh` e `deploy.sh`.

### Cache headers para assets da LP

Toda nova LP React precisa de uma entrada no `lps/meetup/_headers` (que vira o `site/_headers` após o build).
Os assets gerados pelo Vite têm hashes no nome e são imutáveis — devem ter `max-age=31536000, immutable`.

```
# Adicionar em lps/meetup/_headers para cada nova LP:
/<nome>/assets/*
  Cache-Control: public, max-age=31536000, immutable
```
