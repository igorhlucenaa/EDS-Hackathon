# Swiftbet / EDS — Arquitetura (React + Vite)

## Camadas

- **`src/app/features/`** — Telas por domínio (home, live, event, wallet, auth, …).
- **`src/app/premium/`** — Features premium (radar, copilot, retomada, pressão, intenções).
- **`src/app/shared/ui/`** — Componentes de domínio reutilizáveis (cards, odds).
- **`src/app/data/mocks/`** — Dados mock consistentes (eventos, user, wallet, busca, insights).
- **`src/app/state/`** — Zustand + persist (betslip, user, visita, rascunhos, auth, preferências).
- **`src/components/ui/`** — shadcn/Radix (primitivos).
- **`src/app/design-system/tokens.ts`** — Tokens exportados (foundations).

## Rotas principais

- `/` Home (adaptativa Pro/Iniciante, Quick Bet, premium blocks)
- `/live`, `/explore`, `/search`, `/sport/:id`, `/league/:id`, `/event/:id`
- `/betslip`, `/bets`, `/favorites`, `/promotions`
- `/wallet`, `/wallet/deposit`, `/wallet/withdraw`
- `/notifications`, `/account`, `/account/preferences`, `/help`
- `/intencoes`, `/market-explorer`
- `/auth/login`, `/auth/register`, `/onboarding` (sem bottom nav)

## Evolução

Trocar mocks por `src/app/data/api/` + React Query; manter interfaces em `models/types.ts`.
