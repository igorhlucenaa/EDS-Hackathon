# Swiftbet / EDS — Plataforma (front-end)

Sportsbook em **React + Vite + TypeScript**, **Tailwind** e **shadcn/ui**. Dados de demonstração via mocks.

## Scripts

| Comando | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
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
