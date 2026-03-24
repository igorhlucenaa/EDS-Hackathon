# Hackathon Esportes da Sorte — Plataforma (front-end)

Plataforma de apostas esportivas em **React + Vite + TypeScript**, com **Tailwind CSS** e **shadcn/ui** (Radix). Layout responsivo, suporte a safe areas em mobile e build para **web** e **app nativo** (Capacitor).

---

## Stack tecnológico

| Camada | Tecnologia |
|--------|------------|
| Framework | React 18, Vite 5 |
| Estilização | Tailwind CSS, shadcn/ui (Radix) |
| Estado | Zustand (betslip, user, visitas, preferências) |
| Dados | React Query, mocks em `src/app/data/mocks/` |
| Navegação | React Router v6 (lazy loading) |
| Ícones | Lucide React |
| Animações | Framer Motion, CSS keyframes |
| App nativo | Capacitor 6 (Android, iOS) |

---

## Pré-requisitos

- **Node.js** 18+ (recomendado LTS)
- Para **Android**: Android Studio + JDK 17
- Para **iOS**: macOS + Xcode + CocoaPods

---

## Instalação

```bash
git clone <repositório>
cd swiftbet-platform
npm install
```

---

## Desenvolvimento

```bash
npm run dev
```

Acesse **http://localhost:8080**. O servidor usa HMR e recarrega automaticamente ao editar.

---

## Scripts

| Comando | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento (porta 8080) |
| `npm run build` | Build de produção |
| `npm run build:dev` | Build em modo development |
| `npm run preview` | Preview do build (Vite; sem gzip) |
| `npm run preview:compressed` | Build + servidor Express com gzip em `127.0.0.1:4173` |
| `npm run preview:lighthouse` | Alias de `preview:compressed` — use para auditar Performance |
| `npm run cap:sync` | Build + sincroniza `dist/` para Android e iOS |
| `npm run cap:open:android` | Abre o projeto no Android Studio |
| `npm run cap:open:ios` | Abre o projeto no Xcode (apenas macOS) |
| `npm run test` | Rodar testes (Vitest) |
| `npm run test:watch` | Rodar testes em modo watch |
| `npm run lint` | ESLint |

---

## Estrutura do projeto

```
src/
├── app/
│   ├── features/          # Páginas por domínio
│   │   ├── home/
│   │   ├── live/
│   │   ├── event/
│   │   ├── betslip/
│   │   ├── bets/
│   │   ├── wallet/
│   │   ├── auth/
│   │   └── ...
│   ├── premium/           # Módulos premium (radar, copilot, intenções, etc.)
│   ├── shared/ui/         # Componentes reutilizáveis (EventCard, OddsCell, etc.)
│   ├── data/
│   │   ├── mocks/         # Dados de demonstração
│   │   └── models/        # Tipos e interfaces
│   ├── state/             # Zustand stores
│   ├── layouts/           # MainLayout (header, nav, FAB)
│   └── design-system/     # Tokens e foundations
├── components/ui/         # shadcn/Radix (primitivos)
├── lib/                   # Utilitários (cn, oddsQuickStyles)
└── assets/                # Logo, imagens

android/                   # Projeto nativo Android (Capacitor)
ios/                       # Projeto nativo iOS (Capacitor)
scripts/                   # preview-compressed.mjs
```

---

## Rotas e funcionalidades

### Com bottom navigation
- `/` — Home (adaptativa Pro/Iniciante, hero ao vivo, quick chips)
- `/live` — Eventos ao vivo
- `/explore` — Explorar competições
- `/betslip` — Cupom de apostas
- `/bets` — Minhas apostas
- `/account` — Conta do usuário

### Outras
- `/search` — Busca global
- `/sport/:sportId`, `/league/:leagueId` — Esportes e ligas
- `/event/:id` — Detalhe do evento
- `/favorites` — Favoritos
- `/promotions` — Promoções
- `/wallet`, `/wallet/deposit`, `/wallet/withdraw` — Carteira
- `/notifications`, `/help`, `/account/preferences`
- `/intencoes` — Intenções de aposta (premium)
- `/market-explorer` — Explorador de mercados
- `/auth/login`, `/auth/register` — Autenticação
- `/onboarding` — Boas-vindas

---

## Lighthouse (Performance)

Se o relatório mostra **FCP/LCP de dezenas de segundos**, **~5 MB transferidos**, **"minificar JavaScript"** e **"habilitar compressão"**, você provavelmente auditou o **dev server** (`localhost:8080`), não o build de produção.

**Como auditar corretamente:**
1. Pare o `npm run dev`.
2. Execute `npm run preview:lighthouse`.
3. No Chrome, use **janela anônima** sem extensões.
4. Abra **http://127.0.0.1:4173/** e rode o Lighthouse **nessa URL**.

O script `preview-compressed` usa Express com gzip e envia `Cache-Control: immutable` para assets com hash. O `vite preview` padrão não comprime e o Lighthouse continua acusando falhas.

**Otimizações aplicadas:**
- Fontes via **@fontsource** (sem Google Fonts em runtime)
- Build gera `.gz` e `.br` em `dist/`
- Home com lazy loading de seções premium (Radar, Retomada)
- FAB do layout com animação CSS em vez de Framer Motion no shell

---

## Capacitor (app nativo)

O projeto está configurado com **Capacitor 6** para gerar apps **Android** e **iOS** a partir do mesmo código web.

### Fluxo

1. **`npm run cap:sync`** — Faz o build, copia `dist/` para `android/` e `ios/`.
2. **Android** (Windows/Linux/Mac): `npm run cap:open:android` — Abre no Android Studio. Depois: Build → Run (emulador ou dispositivo).
3. **iOS** (apenas macOS): `npm run cap:open:ios` — Abre no Xcode. Requer CocoaPods (`sudo gem install cocoapods`).

### Configuração

- **Bundle ID**: `com.esportesdasorte.app` (edite em `capacitor.config.ts`)
- **`base: './'`** no Vite — necessário para assets carregarem corretamente no WebView nativo

---

## Testes

```bash
npm run test
npm run test:watch
```

Usa **Vitest** e **Testing Library**. Configuração em `vitest.config.ts` e `playwright.config.ts`.

---

## Evolução e integração com backend

Os dados atuais vêm de **mocks** em `src/app/data/mocks/`. Para integrar uma API real:

- Crie módulos em `src/app/data/api/`
- Use **React Query** (`useQuery`, `useMutation`)
- Mantenha as interfaces em `src/app/data/models/types.ts`
- Consulte `docs/ARCHITECTURE.md` para o desenho de camadas

---

## Odds fora do OddsCell

Botões rápidos (Radar, Intenções, Explorador) usam `src/lib/oddsQuickStyles.ts` para o estado **no cupom**, alinhado ao CTA **Rápido** (`bg-primary`).

---

## Licença

Projeto interno / demonstração.
