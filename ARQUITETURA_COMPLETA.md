# Arquitetura Completa do SwiftBet Platform

## Objetivo do projeto

O SwiftBet Platform é um projeto mobile criado no contexto de um desafio do Esportes da Sorte para desenhar um novo layout e uma nova experiência de apostas esportivas em app mobile.

A arquitetura atual foi montada para permitir três coisas ao mesmo tempo:

- prototipar UX rapidamente com dados locais
- evoluir a integração com endpoints reais ou simulados
- manter um mock server independente para desenvolvimento e demonstração

Este documento descreve a arquitetura real do repositório no estado atual do código.

---

## Visão macro da arquitetura

```text
Usuário
  ↓
App Mobile (React Native + Expo)
  ├─ Navegação (React Navigation)
  ├─ Telas e componentes
  ├─ Stores persistidas (Zustand + AsyncStorage)
  ├─ Hooks de dados
  ├─ Cliente HTTP próprio
  └─ Camada compartilhada @shared
         ↓
Mock Server (Node.js + Express)
  ├─ Middleware HTTP
  ├─ Rotas /api e /api-v2
  ├─ Geração dinâmica de dados mock
  └─ Integração opcional com dados reais
         ↓
Football Data API (opcional)
```

A arquitetura é híbrida:

- parte da UI ainda lê dados locais via `@shared`
- parte da UI já consome a camada HTTP e o mock server
- existe também uma segunda camada de hooks com React Query preparada para uma evolução mais robusta da integração

---

## Estrutura do repositório

```text
swiftbet-platform/
├── mobile/                App React Native com Expo
├── mock-server/           Servidor Express para simular backend
├── shared/                Tipos, mocks e utilitários compartilhados
├── README.md              Visão geral do projeto
├── README_MOBILE.md       Guia funcional do app mobile
├── ARCHITECTURE.md        Documento arquitetural anterior
├── DEVELOPER_GUIDE.md     Guia rápido para desenvolvimento
├── MOCK_SERVER_SETUP.md   Integração do app com o mock server
└── TABLE_OF_CONTENTS.md   Índice da documentação
```

Do ponto de vista estrutural, o projeto funciona como um repositório único com três blocos principais:

- `mobile` como cliente mobile
- `mock-server` como backend de desenvolvimento
- `shared` como contrato e base de dados locais para prototipação

Não existe um sistema formal de workspaces NPM. O compartilhamento com `shared` é feito por alias configurado no app mobile.

---

## Camada mobile

## 1. Bootstrap da aplicação

O ponto de entrada do app é `mobile/App.tsx`.

Responsabilidades do bootstrap:

- inicializar o `QueryClientProvider` do TanStack Query
- configurar o `StatusBar`
- renderizar o `RootNavigator`

Resumo do fluxo de subida do app:

```text
App.tsx
  ↓
QueryClientProvider
  ↓
RootNavigator
  ↓
Fluxo de autenticação / onboarding / app principal
```

Mesmo com React Query configurado na raiz, o projeto ainda não usa React Query em toda a aplicação. Hoje coexistem dois modelos de acesso a dados.

---

## 2. Navegação

A navegação está em `mobile/src/navigation/`.

Arquivos centrais:

- `RootNavigator.tsx`
- `MainTabs.tsx`
- `types.ts`

### 2.1 Root stack

`RootNavigator.tsx` controla o fluxo principal do aplicativo usando `@react-navigation/native-stack`.

A decisão de rota inicial depende de dois estados persistidos do `authStore`:

- `isAuthenticated`
- `onboardingDone`

Fluxo:

```text
Se não autenticado
  → Login / Register

Se autenticado e onboarding não concluído
  → Onboarding

Se autenticado e onboarding concluído
  → MainTabs + telas auxiliares do stack
```

### 2.2 Bottom tabs

`MainTabs.tsx` define as cinco abas principais:

- `Home`
- `Live`
- `Explore`
- `Bets`
- `Account`

Além das tabs, existe um FAB flutuante do cupom de apostas:

- aparece quando há seleções no `betslipStore`
- navega para `Betslip`
- mostra badge com quantidade de seleções

### 2.3 Telas fora das tabs

O stack principal também concentra telas de jornada e detalhes:

- `Event`
- `Betslip`
- `Sport`
- `League`
- `Search`
- `IntentExplore`
- `Favorites`
- `Promotions`
- `Wallet`
- `WalletDeposit`
- `WalletWithdraw`
- `Notifications`
- `Preferences`
- `Help`
- `MarketExplorer`

### 2.4 Tipagem de navegação

`types.ts` centraliza os contratos de navegação:

- `MainTabParamList`
- `RootStackParamList`

Isso mantém a navegação tipada entre tabs, stack e telas de detalhe.

---

## 3. Organização de telas

A pasta `mobile/src/screens/` contém a camada de apresentação.

### 3.1 Telas dirigidas por API/mock server

Hoje, as telas mais conectadas à camada HTTP são:

- `ExploreScreen`
- `EventScreen`
- `BetslipScreen`

Essas telas usam hooks do diretório `hooks/` para buscar ou enviar dados.

### 3.2 Telas dirigidas por dados locais de `@shared`

Hoje, várias telas ainda usam mocks locais da biblioteca compartilhada:

- `HomeScreen`
- `LiveScreen`
- `SportScreen`
- `LeagueScreen`
- `SearchScreen`
- `FavoritesScreen`
- `MarketExplorerScreen`
- `PromotionsScreen`
- `NotificationsScreen`
- `WalletScreen`
- `WithdrawScreen`
- `BetsScreen`
- partes de `AccountScreen`

Isso mostra que o app está em uma fase híbrida entre:

- protótipo de experiência com mocks locais
- integração progressiva com backend simulado

### 3.3 Componentes reutilizáveis

A pasta `mobile/src/components/` concentra os blocos visuais reutilizáveis:

- `EventCard.tsx`
- `LiveSnapshotCard.tsx`
- `OddsCell.tsx`

Esses componentes recebem dados de evento, odds e seleção e conversam com o `betslipStore` quando necessário.

---

## 4. Estado global e persistência

O estado global do app está em `mobile/src/stores/` e usa Zustand com persistência em `AsyncStorage`.

### 4.1 Stores existentes

- `authStore.ts`
- `betslipStore.ts`
- `userStore.ts`
- `preferencesStore.ts`
- `visitStore.ts`
- `searchHistoryStore.ts`

### 4.2 Responsabilidades de cada store

#### `authStore`

Responsável por:

- status de autenticação
- conclusão do onboarding

Persistência:

- chave `swiftbet-native-auth-v2`

#### `betslipStore`

Responsável por:

- seleções do cupom
- stake
- modo do cupom
- tipo de aposta
- visibilidade do cupom
- cálculo de odds totais e retorno potencial

Persistência:

- chave `eds-betslip`

#### `userStore`

Responsável por:

- modo de experiência (`beginner` ou `pro`)
- esportes favoritos
- ligas favoritas
- times favoritos

Persistência:

- chave `eds-user-prefs`

#### `preferencesStore`

Responsável por:

- preferências de push
- preferências de e-mail
- modo de visualização compacta de odds

Persistência:

- chave `eds-prefs`

#### `visitStore`

Responsável por:

- histórico de visita
- últimos eventos visitados
- estado de dismiss do banner inicial da home

Persistência:

- chave `eds-visit`

#### `searchHistoryStore`

Responsável por:

- últimas buscas do usuário

Persistência:

- chave `eds-search-history`

### 4.3 Papel arquitetural das stores

As stores sustentam a camada de experiência e sessão local do app:

- navegação guiada por auth e onboarding
- personalização da experiência
- persistência leve sem backend
- continuidade do cupom entre sessões

---

## 5. Biblioteca compartilhada `shared`

A pasta `shared/` é a camada de domínio compartilhado entre app e protótipos locais.

Arquivos principais:

- `types.ts`
- `mocks/sports.ts`
- `mocks/events.ts`
- `mocks/user.ts`
- `utils/timeUntil.ts`
- `index.ts`

### 5.1 Tipos centrais

`shared/types.ts` define entidades do domínio:

- `Sport`
- `League`
- `Team`
- `SportEvent`
- `Market`
- `MarketOutcome`
- `BetSelection`
- `User`
- `UserBet`
- `Transaction`
- `Promotion`
- `Notification`

### 5.2 Mocks compartilhados

Os mocks locais ajudam a acelerar a construção de UX e layout:

- esportes e ligas em `mocks/sports.ts`
- eventos ao vivo e futuros em `mocks/events.ts`
- usuário, apostas, transações, promoções e notificações em `mocks/user.ts`

### 5.3 Resolução do alias `@shared`

O consumo de `shared` no app depende de três pontos de configuração:

- `mobile/tsconfig.json`
- `mobile/babel.config.js`
- `mobile/metro.config.js`

Esses arquivos garantem:

- tipagem TypeScript correta
- resolução do alias no bundle
- watch do diretório compartilhado no Metro

Arquiteturalmente, `shared` funciona como um pacote local de domínio e prototipação.

---

## Camada de dados do mobile

## 6. Configuração de ambiente e runtime

A configuração principal da API está em `mobile/src/api/config.ts`.

Esse arquivo:

- lê variáveis de ambiente do Expo em tempo de execução
- define `apiBasePath` e `apiV2BaseUrl`
- deriva `domain`, `referer`, `customOrigin` e `bragiUrl`
- define timeout da camada HTTP
- expõe builders para URLs `/api` e `/api-v2`

### 6.1 Fonte de verdade atual

Hoje, a fonte de verdade para endpoints é a combinação de:

- `mobile/.env`
- `mobile/src/api/config.ts`

Exemplo atual de dev:

- `EXPO_PUBLIC_API_BASEPATH=http://localhost:3001/api`
- `EXPO_PUBLIC_API_V2_BASEPATH=http://localhost:3001/api-v2`

### 6.2 Arquivo legado / paralelo

Existe também `mobile/src/api/environment.ts`, mas ele não é a fonte principal de configuração usada pelos hooks atuais.

Isso significa que o projeto possui duas abordagens coexistindo:

- uma abordagem baseada em `config.ts` + `.env`
- uma abordagem mais antiga/documental baseada em `environment.ts`

---

## 7. Cliente HTTP

O cliente HTTP está em `mobile/src/api/http.ts`.

Peças centrais:

- `requestJson<T>()`
- `ApiRequestError`

Responsabilidades da função `requestJson`:

- montar headers
- serializar body quando necessário
- aplicar timeout com `AbortController`
- interpretar JSON ou texto
- normalizar falhas de rede e timeout

Esse cliente é a base do acesso a dados do app.

---

## 8. Abstrações de acesso a dados no mobile

Hoje o projeto tem duas camadas diferentes de abstração.

### 8.1 Camada 1: hooks customizados sobre `useApi`

Arquivos:

- `useApi.ts`
- `useSports.ts`
- `useEvents.ts`
- `useMarkets.ts`
- `useBets.ts`

Esse conjunto representa a primeira geração da integração.

Fluxo:

```text
Screen
  ↓
Hook de domínio
  ↓
useApi / usePaginatedApi
  ↓
requestJson
  ↓
mock server ou backend configurado
```

Essa camada é a que alimenta, hoje, boa parte do fluxo funcional conectado:

- explorar eventos
- abrir detalhe de evento
- carregar detalhes de fixture
- enviar aposta no cupom

### 8.2 Camada 2: hooks com React Query

Arquivo principal:

- `usePublicApiQueries.ts`

Esse arquivo introduz uma arquitetura mais madura para consumo de dados com:

- cache
- `queryKey`
- `staleTime`
- bootstrap de configuração pública
- queries específicas para endpoints `/api-v2`

Ele já cobre:

- application parameters
- trader defaults
- trader pages
- multilanguage
- today sport types
- bet type groups
- left menu
- upcoming events
- popular fixtures
- promoted events

Arquiteturalmente, essa segunda camada parece ser a evolução desejada do projeto, mas ainda não é a fonte dominante de dados das telas.

### 8.3 Arquivo `public.ts`

`mobile/src/api/public.ts` centraliza:

- contratos de resposta
- builders de headers para `/api-v2`
- tipos de envelope da API
- funções públicas para bootstrap e navegação do sportsbook

É a camada mais próxima da API pública real.

---

## 9. Estado atual do consumo de dados

O app opera hoje em três modos de dados ao mesmo tempo.

### Modo A: UX local com `@shared`

Usado para:

- home
- feed de jogos ao vivo
- promoções
- carteira
- favoritos
- notificações
- listas de esportes e eventos em telas ainda não integradas

Vantagem:

- muito rápido para testar UX e navegação

Limite:

- não representa a integração real com backend

### Modo B: integração com mock server via hooks customizados

Usado para:

- `ExploreScreen`
- `EventScreen`
- `BetslipScreen`

Vantagem:

- aproxima o app da experiência real de rede

Limite:

- ainda existem desalinhamentos entre contratos do frontend e rotas do mock server

### Modo C: camada de React Query pronta para adoção maior

Usado hoje mais como base arquitetural pronta do que como camada dominante da UI.

---

## Camada backend adapter: mock server

## 10. Papel do mock server

A pasta `mock-server/` funciona como um backend de desenvolvimento.

Objetivos do mock server:

- simular respostas da plataforma de apostas
- permitir desenvolvimento local sem backend oficial
- fornecer endpoints `/api` e `/api-v2`
- servir uma interface de teste via `test.html`
- opcionalmente mesclar dados reais da Football Data API

---

## 11. Bootstrap do servidor

Arquivo principal:

- `mock-server/index.js`

Responsabilidades:

- carregar `.env` com `dotenv`
- iniciar `express`
- habilitar `cors`
- habilitar parsing JSON e URL-encoded
- logar todas as requisições
- servir arquivos estáticos da própria pasta
- expor `/health`
- montar rotas `/api-v2` e `/api`
- tratar erros e 404
- iniciar servidor com fallback automático de porta

### 11.1 Estratégia de porta

O servidor tenta a porta definida em `PORT` ou `3001`.

Se a porta estiver ocupada:

- detecta `EADDRINUSE`
- tenta a próxima porta automaticamente

Isso reduz atrito em ambiente local.

---

## 12. Estrutura das rotas do mock server

As rotas estão organizadas por domínio funcional.

### 12.1 `routes/sports.js`

Responsável por endpoints de descoberta e estrutura esportiva:

- `GET /api-v2/today-sport-types/:device/:language/:trader`
- `GET /api-v2/left-menu/:device/:language/:trader`
- `GET /api-v2/antepost-summary/:device/:language/:trader`

### 12.2 `routes/fixtures.js`

Responsável por endpoints de fixtures e descoberta de eventos:

- `GET /api-v2/upcoming-events/:device/:language/:trader`
- `GET /api-v2/promoted-events/:device/:language/:trader`
- `GET /api-v2/popular-fixture/:device/:language/:trader`
- `GET /api-v2/detail-card/:device/:language/:trader`
- `GET /api-v2/fixture-search/:device/:language/:trader`
- `GET /api-v2/league-card/:device/:language/:trader/:seasonIds/:encodedbody`

### 12.3 `routes/markets.js`

Responsável por mercados e odds:

- `GET /api-v2/bet-type-groups/:device/:language/:trader`
- `GET /api-v2/markets/:fixtureId`
- `POST /api-v2/get-odds`

### 12.4 `routes/config.js`

Responsável por bootstrap funcional da aplicação e fluxo de aposta:

- `GET /api/generic/getApplicationParameters/:domain/:device`
- `GET /api/generic/getTraderDefaults/:domain/:device`
- `GET /api/generic/getTraderPages/:domain/:device/:language_id`
- `POST /api/user/sportsBet/info`
- `POST /api/generic/booking/bookabet`
- `GET /api/generic/getTraderFavoriteTeamList/:domain/:device`
- `POST /api/generic/getContentByCode`

### 12.5 Endpoint de saúde

- `GET /health`

---

## 13. Camada de dados do mock server

Arquivo principal:

- `mock-server/data/mockData.js`

Essa é a fonte central dos dados mock.

### 13.1 O que esse arquivo fornece

- lista de esportes
- lista de ligas
- lista de times
- geração dinâmica de eventos
- geração dinâmica de mercados
- grupos de tipos de aposta
- parâmetros gerais da aplicação

### 13.2 Geração dinâmica

As funções `generateEvents()` e `generateMarkets()` criam dados variáveis a cada requisição.

Isso permite simular:

- jogos ao vivo
- jogos futuros
- placares mutáveis
- odds com pequenas variações
- volume e diversidade de fixtures

### 13.3 Estratégia híbrida com dados reais

`mockData.js` também funciona como fachada para a integração opcional com dados reais.

Funções como:

- `getSports()`
- `getLeagues()`
- `getTeams()`
- `getEvents()`

seguem a lógica:

- se `USE_REAL_DATA=true` e a integração estiver habilitada, tentar usar dados reais
- em caso de falha, voltar para os mocks

---

## 14. Integração opcional com dados reais

Arquivo principal:

- `mock-server/realDataFetcher.js`

Essa camada usa `axios` para falar com a Football Data API.

### 14.1 Capacidades

- buscar competições reais
- buscar partidas reais
- buscar classificações
- buscar times
- gerar mercados sintéticos a partir de jogos reais
- aplicar cache em memória por 5 minutos
- mesclar dados reais com dados mock

### 14.2 Dependências e variáveis

A integração depende principalmente de:

- `FOOTBALL_DATA_API_KEY`
- `USE_REAL_DATA`

### 14.3 Estratégia arquitetural

Essa camada transforma o mock server em um adaptador híbrido:

- completamente mock quando não há chave
- semi-real quando a Football Data API está configurada

Isso é útil para demonstração e para evoluir a experiência sem depender do backend final.

---

## Fluxos principais do sistema

## 15. Fluxo de exploração de eventos

Fluxo atual da `ExploreScreen`:

```text
ExploreScreen
  ├─ useSports()
  ├─ useSportMenu()
  ├─ usePromotedEvents()
  └─ useUpcomingEvents()
        ↓
useApi()
        ↓
requestJson()
        ↓
mock-server /api-v2/*
        ↓
routes/*.js
        ↓
mockData.js
        ↓
resposta envelope { success, responseCodes, data }
```

A tela usa esses dados para:

- montar filtro de esportes
- exibir eventos promovidos ao vivo
- listar próximos jogos
- navegar para detalhe de evento

---

## 16. Fluxo de detalhe de evento

Fluxo pretendido da `EventScreen`:

```text
EventScreen
  ├─ useFixtureDetail(id)
  ├─ useFixtureMarkets(id)
  └─ useOddsPolling(id, marketIds)
        ↓
camada HTTP
        ↓
mock server
```

A tela renderiza:

- cabeçalho do evento
- placar ou horário
- tabs de mercado
- odds clicáveis
- estatísticas quando disponíveis

Ela também escreve no `betslipStore` quando o usuário escolhe uma odd.

---

## 17. Fluxo do cupom de aposta

Fluxo atual:

```text
EventCard / OddsCell / EventScreen
  ↓
useBetslipStore.toggleSelection()
  ↓
BetslipScreen
  ├─ lê selections do store
  ├─ calcula odds totais
  ├─ calcula retorno potencial
  └─ chama usePlaceBet()
          ↓
POST para /api/user/sportsBet/info
```

A lógica do cupom está dividida entre:

- estado persistido em `betslipStore`
- cálculo local em `useBetCalculator()`
- tentativa de envio da aposta via `usePlaceBet()`

---

## 18. Fluxo de autenticação e onboarding

Fluxo atual:

```text
RootNavigator
  ↓
authStore
  ├─ isAuthenticated
  └─ onboardingDone
```

Esse fluxo decide se o usuário vê:

- login/registro
- onboarding
- app principal

A autenticação ainda é local e orientada por estado persistido, sem backend real de auth integrado.

---

## Decisões arquiteturais importantes

## 19. Decisões estruturais

### 19.1 Projeto mobile-first

O repositório foi simplificado para uma estratégia mobile-only.

Hoje, o produto principal está em `mobile/`.

### 19.2 Backend adapter desacoplado

O mock server é um projeto separado do app mobile.

Isso permite:

- rodar backend e frontend em processos distintos
- testar endpoints fora do app
- trocar base URLs sem reescrever a UI

### 19.3 Camada compartilhada local

`shared/` existe para permitir velocidade na construção de experiência.

Isso é especialmente útil em um projeto de redesign e validação de UX.

### 19.4 Persistência local como suporte de experiência

O uso de Zustand + AsyncStorage evita depender cedo demais do backend para:

- auth mock
- onboarding
- favoritos
- histórico leve de busca
- cupom
- preferências

### 19.5 API pública e API mock convivendo

A presença de `public.ts` e `usePublicApiQueries.ts` mostra que o projeto também quer conversar com endpoints mais próximos da API real de sportsbook.

---

## Estado arquitetural atual: pontos fortes e pontos de atenção

## 20. Pontos fortes

- separação clara entre app mobile, mock server e domínio compartilhado
- navegação bem centralizada e tipada
- stores persistidas simples e objetivas
- mock server suficiente para desenvolvimento local
- integração opcional com dados reais para enriquecer demos
- presença de uma segunda camada com React Query pronta para amadurecimento
- alias `@shared` bem configurado no toolchain do mobile

---

## 21. Pontos de atenção e desalinhamentos atuais

A arquitetura atual é funcional, mas ainda está em transição. Os principais desalinhamentos são:

### 21.1 Duas fontes de verdade para dados de tela

Hoje coexistem:

- telas baseadas em `@shared`
- telas baseadas em API/mock server

Isso é bom para velocidade, mas dificulta padronização de contratos.

### 21.2 Duas abordagens de acesso a dados

Hoje coexistem:

- hooks legados com `useApi`
- hooks novos com React Query

A ausência de uma escolha única aumenta custo de manutenção.

### 21.3 Configuração de ambiente duplicada

Existem dois caminhos de configuração:

- `api/config.ts` + `.env`
- `api/environment.ts`

No estado atual, o primeiro é o caminho efetivamente usado.

### 21.4 Desalinhamento entre alguns hooks e as rotas do mock server

Hoje existem diferenças importantes entre o contrato esperado por parte do mobile e o contrato implementado no mock server.

Exemplos do código atual:

- `useFixtureMarkets()` consulta o caminho como se fosse `/api/markets/:fixtureId`, enquanto o mock server expõe `GET /api-v2/markets/:fixtureId`
- `useOdds()` faz requisição compatível com `GET`, enquanto o mock server expõe `POST /api-v2/get-odds`
- `usePlaceBet()` usa `localhost` hardcoded e não passa pela configuração central da API
- `usePlaceBet()` e `BetslipScreen` não estão 100% alinhados com o envelope retornado por `POST /api/user/sportsBet/info`

### 21.5 Divergência entre modelos de domínio

Os tipos do `shared` e os tipos usados em alguns hooks de API não são idênticos.

Exemplo:

- o domínio local usa `SportEvent`, `home`, `away`, `league`, `status.type`
- parte dos hooks de API trabalha com `Fixture`, `homeTeam`, `awayTeam`, `status` string e outros formatos próximos ao backend

Isso é o principal ponto arquitetural a ser unificado no futuro.

---

## Arquitetura recomendada para a próxima fase

## 22. Direção de evolução

Para a próxima etapa do projeto, a direção mais consistente seria:

### 22.1 Escolher uma única fonte de verdade para dados de tela

Opções:

- manter `@shared` apenas para prototipação e testes visuais
- mover as telas de produto para contratos normalizados vindos da camada API

### 22.2 Consolidar a camada de dados

Direção sugerida:

- adotar React Query como padrão
- manter `requestJson` como primitive HTTP
- concentrar a integração em uma camada única de client/service

### 22.3 Criar um normalizador de domínio

Em vez de expor o shape cru do backend para a UI, o ideal é criar uma camada que transforme:

- resposta do mock server
- resposta da API pública
- mocks locais

em um único modelo de domínio para a interface.

### 22.4 Remover hardcodes de ambiente

Apostas, odds, mercados e bootstrap devem usar sempre a mesma configuração central de runtime.

### 22.5 Fechar o ciclo do redesign

Como o objetivo do projeto é criar uma nova experiência mobile, a arquitetura ideal para a próxima fase é:

- UX rápida com componentes reutilizáveis
- dados normalizados
- backend adapter isolado
- navegação e estado persistente simples
- expansão posterior para autenticação real, wallet real e odds em tempo real de verdade

---

## Resumo executivo

O SwiftBet Platform hoje é uma arquitetura híbrida e bastante útil para fase de redesign:

- `mobile/` entrega a experiência do app
- `mock-server/` simula o backend necessário para desenvolvimento
- `shared/` acelera prototipação e garante um domínio local reutilizável

A principal característica arquitetural do projeto no estado atual é a convivência de três camadas de dados:

- mocks locais para UX
- mock server para integração de desenvolvimento
- adaptação opcional com dados reais

Isso torna o projeto excelente para iteração rápida de produto, mas também indica que a próxima grande evolução deve ser a unificação dos contratos de dados e da estratégia de consumo de API.

---

## Arquivos mais importantes para entender a arquitetura

### Mobile

- `mobile/App.tsx`
- `mobile/src/navigation/RootNavigator.tsx`
- `mobile/src/navigation/MainTabs.tsx`
- `mobile/src/api/config.ts`
- `mobile/src/api/http.ts`
- `mobile/src/api/public.ts`
- `mobile/src/hooks/useApi.ts`
- `mobile/src/hooks/usePublicApiQueries.ts`
- `mobile/src/stores/betslipStore.ts`
- `mobile/src/stores/authStore.ts`

### Mock server

- `mock-server/index.js`
- `mock-server/data/mockData.js`
- `mock-server/realDataFetcher.js`
- `mock-server/routes/sports.js`
- `mock-server/routes/fixtures.js`
- `mock-server/routes/markets.js`
- `mock-server/routes/config.js`

### Shared

- `shared/types.ts`
- `shared/mocks/sports.ts`
- `shared/mocks/events.ts`
- `shared/mocks/user.ts`
- `shared/index.ts`

---

