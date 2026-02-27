# Regras de Integração de Formulários

Padrão obrigatório para todos os formulários nas páginas do `meetup-growdoc`.

---

## Endpoint do Webhook

```
GET https://webhooks02.manager01.growdoc.com.br/webhook/redirect-global
```

O webhook processa o lead no CRM e redireciona o usuário internamente.
**Não é necessário enviar `redirect_url`** — isso é gerenciado pelo próprio webhook.

---

## Parâmetros obrigatórios

| Parâmetro | Valor | Observação |
|-----------|-------|------------|
| `name` | Nome completo | Texto livre |
| `phone` | Telefone | Somente dígitos, sem máscara |
| `email` | E-mail ou string vazia `""` | Sempre incluir, mesmo vazio |
| `page_url` | URL atual da página | `window.location.href` |
| `01` | Resposta da 1ª pergunta | Ver regra abaixo |
| `02` | Resposta da 2ª pergunta | Ver regra abaixo |
| `utm_source` | UTM | Sempre incluir, mesmo vazio |
| `utm_campaign` | UTM | Sempre incluir, mesmo vazio |
| `utm_medium` | UTM | Sempre incluir, mesmo vazio |
| `utm_content` | UTM | Sempre incluir, mesmo vazio |
| `utm_term` | UTM | Sempre incluir, mesmo vazio |
| `utm_id` | UTM | Sempre incluir, mesmo vazio |
| `fbclid` | Tracking | Sempre incluir, mesmo vazio |
| `gclid` | Tracking | Sempre incluir, mesmo vazio |
| `wbraid` | Tracking | Sempre incluir, mesmo vazio |

---

## Regra das perguntas: `01`, `02`, `03`...

As perguntas do formulário **não usam o nome do campo como chave**.
O CRM identifica as respostas por índice numérico sequencial: `01`, `02`, `03`...

```
❌ Errado:   &is_vascular=Sim&professional_stage=Crescendo
✅ Correto:  &01=Sim&02=Tenho+consultório+e+quero+crescer
```

- A numeração começa em `01` e segue em ordem para cada pergunta do form
- Use **dois dígitos** sempre (`01`, `02`, ..., `09`, `10`)
- O valor enviado deve ser o **texto legível** da resposta (não um código curto)

```
❌ Errado:   &01=sim&02=crescendo
✅ Correto:  &01=Sim&02=Tenho+consultório+e+quero+crescer
```

---

## UTMs: captura e persistência

Os UTMs devem ser capturados da URL no carregamento da página e persistidos em `localStorage` para sobreviver a redirecionamentos.

**Fluxo:**
1. Ao carregar a página, lê UTMs da URL (`?utm_source=...`)
2. Se existirem, salva no `localStorage`
3. No envio do form, lê do `localStorage` (garante que UTMs de tráfego pago não se percam)

**Sempre enviar todos os campos UTM**, mesmo que vazios — o CRM espera os campos presentes:

```
&utm_source=meta&utm_campaign=&utm_medium=&utm_content=&utm_term=&utm_id=&fbclid=&gclid=&wbraid=
```

---

## Captura no Supabase (paralela)

Além do webhook, o form faz um `fetch` paralelo para o Supabase — apenas para backup dos leads.
O Supabase recebe somente: `name`, `email`, `phone`, `page_url`.

```
GET https://lswmkiyqznvuedbuyrkt.supabase.co/functions/v1/capture-lead
  ?name=...&email=&phone=...&page_url=...
```

Isso é feito com `fetch(..., { keepalive: true })` para não bloquear o redirect.

---

## Exemplo de URL final gerada

```
https://webhooks02.manager01.growdoc.com.br/webhook/redirect-global
  ?name=Dr.+João+Silva
  &email=
  &phone=11999999999
  &page_url=https%3A%2F%2Fmeetup.growdoc.com.br%2Fgrowth%3Futm_source%3Dmeta
  &01=Sim
  &02=Tenho+consultório+e+quero+crescer
  &utm_source=meta
  &utm_campaign=medicos-2026
  &utm_medium=cpc
  &utm_content=
  &utm_term=
  &utm_id=
  &fbclid=
  &gclid=
  &wbraid=
```

---

## Checklist ao criar um novo formulário

- [ ] Campos base: `name`, `phone`, `email`, `page_url`
- [ ] Perguntas como `01`, `02`... com valores em texto legível
- [ ] UTMs capturados da URL e persistidos em `localStorage`
- [ ] Todos os campos UTM enviados (mesmo os vazios)
- [ ] Fetch paralelo ao Supabase (sem bloquear o redirect)
- [ ] `window.location.href` para o webhook (não `fetch`)
