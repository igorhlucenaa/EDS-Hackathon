# 🏗️ Arquitetura do SwiftBet Platform

## Diagrama da Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SWIFTBET PLATFORM                              │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                           CLIENTE (Mobile)                               │
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │               React Native App (mobile/)                           │ │
│  │                                                                    │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │  Screens (Telas)                                             │ │ │
│  │  │  ├─ AccountScreen     (💳 Conta)                             │ │ │
│  │  │  ├─ ExploreScreen     (🔍 Explorar)                          │ │ │
│  │  │  ├─ BetslipScreen     (🎯 Carrinho de Apostas)              │ │ │
│  │  │  ├─ EventScreen       (📅 Detalhes do Evento)               │ │ │
│  │  │  └─ BetsScreen        (📊 Minhas Apostas)                   │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  │                              ↓                                      │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │  Components (Componentes Reutilizáveis)                      │ │ │
│  │  │  ├─ EventCard      (Cartão de Evento)                       │ │ │
│  │  │  ├─ OddsCell       (Célula de Odds)                         │ │ │
│  │  │  └─ LiveSnapshot   (Snapshot ao Vivo)                       │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  │                              ↓                                      │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │  Hooks & Stores (Estado Global)                             │ │ │
│  │  │  ├─ usePublicApiQueries()    (Requisições de API)          │ │ │
│  │  │  └─ Redux/Context API        (Estado Global)                │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  │                              ↓                                      │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │  API Layer (Camada de API)                                   │ │ │
│  │  │  ├─ environment.ts  ⭐ (Config: mock/dev/prod)              │ │ │
│  │  │  ├─ config.ts       (Endpoints & Métodos)                   │ │ │
│  │  │  ├─ http.ts         (Axios/Fetch Client)                    │ │ │
│  │  │  ├─ public.ts       (Endpoints Públicos)                    │ │ │
│  │  │  └─ index.ts        (Exportações)                           │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
                                  ↓↑ HTTP/REST
                       (localhost:3001 ou api.sportingtech.com)
┌──────────────────────────────────────────────────────────────────────────┐
│                      BACKEND ADAPTER                                     │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │            Express.js Server (mock-server/)                       │ │
│  │                                                                    │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │  index.js (Main Server)                                      │ │ │
│  │  │  ├─ app.use(cors())              ✅ CORS Habilitado          │ │ │
│  │  │  ├─ app.use(bodyParser)          ✅ JSON Parsing            │ │ │
│  │  │  ├─ app.use(logging)             ✅ Request Logging         │ │ │
│  │  │  ├─ app.use(express.static)      ✅ test.html               │ │ │
│  │  │  └─ app.listen(3001)             ✅ Start Server            │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  │                              ↓                                      │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │  Routes (Endpoints)                                          │ │ │
│  │  │                                                               │ │ │
│  │  │  📊 Sports Routes (sports.js)                                │ │ │
│  │  │  ├─ GET /api-v2/today-sport-types/{...}                   │ │ │
│  │  │  ├─ GET /api-v2/left-menu/{...}                           │ │ │
│  │  │  └─ GET /api-v2/antepost-summary/{...}                    │ │ │
│  │  │                                                               │ │ │
│  │  │  📅 Fixtures Routes (fixtures.js)                            │ │ │
│  │  │  ├─ GET /api-v2/upcoming-events/{...}                     │ │ │
│  │  │  ├─ GET /api-v2/promoted-events/{...}                     │ │ │
│  │  │  ├─ GET /api-v2/popular-fixture/{...}                     │ │ │
│  │  │  ├─ GET /api-v2/detail-card/{...}                         │ │ │
│  │  │  ├─ GET /api-v2/fixture-search/{...}                      │ │ │
│  │  │  └─ GET /api-v2/league-card/{...}                         │ │ │
│  │  │                                                               │ │ │
│  │  │  🎯 Markets Routes (markets.js)                              │ │ │
│  │  │  ├─ GET /api-v2/bet-type-groups/{...}                     │ │ │
│  │  │  ├─ GET /api-v2/markets/{fixtureId}                       │ │ │
│  │  │  └─ POST /api-v2/get-odds                                 │ │ │
│  │  │                                                               │ │ │
│  │  │  ⚙️ Config Routes (config.js)                                │ │ │
│  │  │  ├─ GET /api/generic/getApplicationParameters/{...}        │ │ │
│  │  │  ├─ GET /api/generic/getTraderDefaults/{...}              │ │ │
│  │  │  ├─ GET /api/generic/getTraderPages/{...}                 │ │ │
│  │  │  ├─ POST /api/user/sportsBet/info ⭐ (Simular Aposta)      │ │ │
│  │  │  ├─ POST /api/generic/booking/bookabet ⭐ (Confirmar)      │ │ │
│  │  │  ├─ GET /api/generic/getTraderFavoriteTeamList/{...}      │ │ │
│  │  │  └─ POST /api/generic/getContentByCode                    │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  │                              ↓                                      │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │  Data Layer (data/mockData.js)                               │ │ │
│  │  │                                                               │ │ │
│  │  │  📊 sportTypes[] (5 esportes)                                │ │ │
│  │  │      ├─ Football                                             │ │ │
│  │  │      ├─ Basketball                                           │ │ │
│  │  │      ├─ Tennis                                               │ │ │
│  │  │      ├─ MMA                                                  │ │ │
│  │  │      └─ Volleyball                                           │ │ │
│  │  │                                                               │ │ │
│  │  │  🏟️ leagues[] (10 ligas)                                    │ │ │
│  │  │      ├─ Premier League                                       │ │ │
│  │  │      ├─ La Liga                                              │ │ │
│  │  │      ├─ Champions League                                     │ │ │
│  │  │      ├─ Brasileirão                                          │ │ │
│  │  │      └─ ... (6 mais)                                         │ │ │
│  │  │                                                               │ │ │
│  │  │  🎭 teams[] (6 times)                                        │ │ │
│  │  │      ├─ Flamengo                                             │ │ │
│  │  │      ├─ Manchester United                                    │ │ │
│  │  │      └─ ... (4 mais)                                         │ │ │
│  │  │                                                               │ │ │
│  │  │  🎪 generateEvents() → 20 eventos dinâmicos                  │ │ │
│  │  │      └─ 8 live + 12 próximos com dados realistas           │ │ │
│  │  │                                                               │ │ │
│  │  │  💰 generateMarkets() → Mercados por evento                  │ │ │
│  │  │      ├─ Match Result (3 outcomes)                            │ │ │
│  │  │      ├─ Over/Under (2 outcomes)                              │ │ │
│  │  │      ├─ Both Score (2 outcomes)                              │ │ │
│  │  │      ├─ Double Chance (3 outcomes)                           │ │ │
│  │  │      └─ Corners (2 outcomes)                                 │ │ │
│  │  │                                                               │ │ │
│  │  │  📈 Odds com variação dinâmica (±0.3 a cada requisição)     │ │ │
│  │  │                                                               │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                            SHARED LIBRARY                                │
│                            (shared/)                                     │
│                                                                          │
│  types.ts       → Tipos TypeScript compartilhados                       │
│  utils/         → Funções utilitárias (timeUntil, etc)                 │
│  mocks/         → Dados mock (events.ts, sports.ts, user.ts)           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados

### 1️⃣ Requisição GET (Listar Eventos)

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User clica em "Próximos Eventos"                            │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Component chama usePublicApiQueries()                        │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. HTTP Client faz GET /api-v2/upcoming-events/m/1/trader123   │
│    URI: http://localhost:3001/api-v2/upcoming-events/m/1/...   │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Express Router chama fixtures.js                             │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. mockData.generateEvents() cria dados dinâmicos              │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. Retorna JSON com envelope: {success, responseCodes, data}  │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. App recebe e renderiza eventos na tela                      │
└─────────────────────────────────────────────────────────────────┘
```

### 2️⃣ Requisição POST (Simular Aposta)

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User seleciona odds e clica "Simular"                       │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. App envia POST /api/user/sportsBet/info                     │
│    Body: {selections: [...], stake: 100}                       │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Server recebe no config.js                                   │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Calcula:                                                     │
│    totalOdds = 2.10 × 2.05 = 4.305                             │
│    potentialWin = 100 × 4.305 = 430.5                          │
│    profit = 430.5 - 100 = 330.5                                │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. Retorna: {totalOdds, potentialWin, profit, selections}     │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. App mostra "Ganho Potencial: R$ 330.50"                     │
└─────────────────────────────────────────────────────────────────┘
```

### 3️⃣ Requisição POST (Confirmar Aposta)

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User clica "Confirmar Aposta"                               │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. App envia POST /api/generic/booking/bookabet                │
│    Body: {selections: [...], stake: 100, betType: "accum"}     │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Server gera:                                                 │
│    bookingId = "BK_" + random hash                             │
│    expiresAt = Date.now() + 5 minutos                          │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Retorna confirmação com bookingId e expiresAt              │
└─────────────────┬───────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. App mostra "Aposta confirmada! ID: BK_xxx"                 │
│    Timer: "Válida por 5 minutos"                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔌 Integração Entre Componentes

```
User Interface
     ↓
┌─────────────────────────┐
│   Screen / Component    │  (BetslipScreen, ExploreScreen)
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│   Custom Hook           │  (usePublicApiQueries)
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│   API Config            │  (environment.ts, config.ts)
│   ├─ BASE_PATH          │
│   ├─ ENDPOINTS          │
│   └─ DEFAULT_PARAMS     │
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│   HTTP Client           │  (axios / fetch wrapper)
└──────────┬──────────────┘
           ↓
       (Network)
           ↓
┌─────────────────────────┐
│   Mock Server           │  (localhost:3001 ou api.sportingtech.com)
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│   Express Routes        │  (sports.js, fixtures.js, etc)
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│   Mock Data             │  (generateEvents, generateMarkets)
└──────────┬──────────────┘
           ↓
       Response
           ↓
       (Network)
           ↓
┌─────────────────────────┐
│   Store / Context       │  (Redux / Context API)
└──────────┬──────────────┘
           ↓
       Re-render
```

---

## 📊 Estrutura de Dados

### Para Evento
```javascript
{
  id: "fixture_1",
  fixtureId: 1,
  name: "Flamengo vs Palmeiras",
  status: "live" | "upcoming",
  startTime: "2024-01-15T20:00:00Z",
  sport: { id: 1, name: "Football" },
  league: { id: 1, name: "Brasileirão" },
  homeTeam: { id: "t1", name: "Flamengo", logo: "..." },
  awayTeam: { id: "t2", name: "Palmeiras", logo: "..." },
  score: { home: 2, away: 1 },         // Se ao vivo
  markets: [/* ... */]
}
```

### Para Mercado
```javascript
{
  id: "market_1",
  type: "Match Result",
  outcomes: [
    { id: "o1", name: "Home", odds: 2.10 },
    { id: "o2", name: "Draw", odds: 3.20 },
    { id: "o3", name: "Away", odds: 3.50 }
  ]
}
```

### Para Aposta Confirmada
```javascript
{
  bookingId: "BK_abc123def456",
  status: "confirmed",
  totalOdds: 4.305,
  stake: 100,
  potentialWin: 430.5,
  profit: 330.5,
  createdAt: "2024-01-15T10:30:00Z",
  expiresAt: "2024-01-15T10:35:00Z",    // +5 minutos
  selections: [...]
}
```

---

## 🔐 Parâmetros de Requisição

```
/api-v2/upcoming-events/{device}/{language}/{trader}
                         │         │          │
                         │         │          └─ ID do trader (123)
                         │         └─ Idioma (1=PT, 2=EN)
                         └─ Tipo de dispositivo (m=mobile, d=desktop)
```

---

## 📱 Modo Offline (Futuro)

```
App com Mock Server
     ↓↑ (Sempre conectado em dev)
     
App sem Mock Server (Em Produção)
     ↓↑
Real Backend (api.sportingtech.com)
```

---

## ✅ Checklist de Integração

- [ ] Mock server rodando em localhost:3001
- [ ] test.html acessível
- [ ] App mobile conectado ao mock server
- [ ] Consegue listar eventos
- [ ] Consegue simular apostas
- [ ] Consegue confirmar apostas
- [ ] Dados variam a cada requisição

---

**Última Atualização**: Janeiro/2024
