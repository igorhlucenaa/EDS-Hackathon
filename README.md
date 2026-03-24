# Hackathon Esportes da Sorte — Plataforma (front-end)

Sportsbook em **React + Vite + TypeScript**, **Tailwind** e **shadcn/ui**. Dados de demonstração via mocks.

## Scripts

| Comando | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run preview:lighthouse` | Build + preview em `127.0.0.1:4173` (use para auditar Performance de perto do prod) |

## Lighthouse (Performance)

- **Não rode o Lighthouse em `npm run dev`** (localhost com Vite): o JS não é minificado, não há compressão HTTP, há WebSocket do HMR (afeta bfcache) e o peso é muito maior — isso explica FCP/LCP na casa de **dezenas de segundos** e “reduzir JS / minificar / habilitar compressão”.
- Para métricas próximas da produção: **`npm run preview:lighthouse`**, abra `http://127.0.0.1:4173/` e audite em **janela anônima** sem extensões (o Chrome avisa quando extensões distorcem o resultado).
- **Fontes** (`Inter` + `Space Grotesk`) estão em **@fontsource** (bundle), sem Google Fonts em tempo de execução.
- O build gera **`.gz` e `.br`** em `dist/` para servidores que sirvam `Content-Encoding` (ex.: Nginx `gzip_static`). Muitos hosts (Vercel, Netlify, CDN) também comprimem automaticamente.
| `npm run test` | Vitest |
| `npm run lint` | ESLint |

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
