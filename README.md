# Hackathon Esportes da Sorte — Plataforma (front-end)

Sportsbook em **React + Vite + TypeScript**, **Tailwind** e **shadcn/ui**. Dados de demonstração via mocks.

## Scripts

| Comando | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento (**porta 8080** — não use para Lighthouse) |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build (Vite; sem gzip HTTP) |
| `npm run preview:compressed` | Build + servidor estático com **gzip** em `127.0.0.1:4173` |
| `npm run preview:lighthouse` | Alias de `preview:compressed` — **use para auditar Performance** |
| `npm run test` | Vitest |
| `npm run lint` | ESLint |

## Lighthouse (Performance)

Se o relatório mostra **FCP/LCP de dezenas de segundos**, **~5 MB transferidos**, **“minificar JavaScript”** e **“habilitar compressão”**, quase sempre a URL auditada é o **dev** (`http://localhost:8080` com `npm run dev`), não o build.

1. Pare o dev server.
2. Rode **`npm run preview:lighthouse`** (ou `npm run preview:compressed`).
3. No Chrome, **janela anônima** sem extensões.
4. Abra **`http://127.0.0.1:4173/`** e rode o Lighthouse **nessa URL** (não na 8080).

O script `preview-compressed` usa **Express + compressão HTTP**, como a maioria dos hosts em produção. O `vite preview` sozinho **não** envia `Content-Encoding: gzip`, e o Lighthouse continua a acusar “text compression”.

- **Fontes** (`Inter` + `Space Grotesk`): **@fontsource** no bundle (sem Google Fonts em runtime).
- O build gera também **`.gz` / `.br`** em `dist/` para Nginx `gzip_static` ou equivalente.
- **`preview-compressed`** envia **`Cache-Control: immutable`** em `/assets/*` (hashes) — melhora o audit de cache no Lighthouse.
- A **home** carrega **Radar / Retomada** com `lazy` + `Suspense` e o **FAB** do layout usa **CSS** em vez de Framer — menos JS no caminho crítico.

## Estrutura (resumo)

- `src/app/features/` — páginas por domínio (home, live, event, wallet, auth, …)
- `src/app/premium/` — módulos premium (radar, copilot, retomada, pressão, intenções)
- `src/app/state/` — Zustand (betslip, user, visita, auth, preferências, …)
- `src/app/data/mocks/` — eventos, user, wallet, busca, insights
- `docs/ARCHITECTURE.md` — notas de arquitetura

## Odds fora do `OddsCell`

Botões rápidos (Radar, Intenções, Explorador) usam `src/lib/oddsQuickStyles.ts` para o estado **no cupom** alinhado ao CTA **Rápido** (`bg-primary`).

## Licença

Projeto interno / demonstração.
