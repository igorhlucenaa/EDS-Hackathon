# 🎯 SwiftBet Platform - Mobile App

## 📦 O que foi implementado

Uma plataforma de apostas esportivas completa em React Native com integração real à Football Data API.

### ✅ Funcionalidades Implementadas

#### **FASE 1: Configuração ✅**
- ✅ Arquivo `.env` com endpoints de dev/prod
- ✅ Loader dinâmico de configurações do servidor
- ✅ Detecção automática de porta (3001, 3002, 3003...)
- ✅ Timeout configurável e cache de 5 minutos

#### **FASE 2: Hooks Reutilizáveis ✅**
- ✅ `useApi<T>()` - Hook genérico com paginação e erro handling
- ✅ `useSports()` - Listar esportes e competições 
- ✅ `useEvents()` - 6 funções: upcoming, promoted, detail, search, popular, league
- ✅ `useMarkets()` - Mercados, odds, polling em tempo real
- ✅ `useBets()` - Colocar apostas, histórico, calculadora
- ✅ Todos com TypeScript full type-safe

#### **FASE 3: Integração de Telas ✅**
- ✅ **ExploreScreen**: Esportes + eventos com filtro interativo
- ✅ **EventScreen**: Detalhes do jogo + mercados + odds em tempo real
- ✅ **BetslipScreen**: Carrinho de apostas + cálculos + confirmação + **compartilhamento de bilhetes**
- ✅ **SharedBetScreen**: Buscar e visualizar bilhetes compartilhados
- ✅ Todas integradas com dados reais da Football Data API

#### **FASE 4: Documentação e Exemplos ✅**
- ✅ `INTEGRATION_GUIDE.md` - Documentação completa de todos os hooks
- ✅ `EXAMPLES.ts` - 10 exemplos práticos de uso
- ✅ Código comentado e bem estruturado
- ✅ Tratamento de erros em todos os pontos

---

## 🚀 Quick Start

### 1. **Preparar Dados Reais**

Obter token gratuito em https://www.football-data.org/

```bash
# Definir token no .env do mock-server
echo "FOOTBALL_DATA_TOKEN=seu_token_aqui" >> mock-server/.env
```

### 2. **Iniciar Servidor Mock**

```bash
cd mock-server
npm install
npm start
# Servidor rodando em http://localhost:3001
```

### 3. **Executar App Mobile**

```bash
cd mobile
npm install
npx expo start

# No terminal do Expo:
# i → iPhone simulator
# a → Android emulator
# w → Web
```

### 4. **Verificar Conexão**

Abra browser em `http://localhost:3001/api-v2/today-sport-types/d/pt/1`

Deve retornar lista de esportes (Futebol, Basquete, etc).

---

## 📱 Fluxo de Uso

### User Journey

```
1. ExploreScreen
   ↓
   [Usuário vê esportes e eventos ao vivo]
   [Clica em um evento]
   ↓
2. EventScreen
   ↓
   [Vê detalhes, placar, mercados]
   [Clica em uma odd para adicionar ao cupom]
   [Odds atualizam a cada 5 segundos]
   ↓
3. BetslipScreen
   ↓
   [Vê seleções, calcula retorno]
   [Insere valor da aposta]
   [🔥 NOVO: Compartilha bilhete com amigos]
   [Clica "Apostar"]
   ↓
4. Confirmação
   ↓
   ✅ Aposta registrada no servidor
   [ID da aposta exibido]
   ↓
5. SharedBetScreen (opcional)
   ↓
   [Busca bilhete por código]
   [Visualiza seleções de amigos]
   [Copia para próprio cupom]
```

---

## 🪝 Hooks Disponíveis

| Hook | Uso | Status |
|------|-----|--------|
| `useApi<T>` | Base para todas as requisições | ✅ |
| `useSports()` | Listar esportes e competições | ✅ |
| `useSportMenu()` | Menu completo com categorias | ✅ |
| `useUpcomingEvents()` | Próximos jogos com paginação | ✅ |
| `usePromotedEvents()` | Eventos em destaque (ao vivo) | ✅ |
| `useFixtureDetail()` | Detalhes de um jogo | ✅ |
| `useFixtureMarkets()` | Mercados de apostas | ✅ |
| `useOddsPolling()` | Odds atualizadas em tempo real | ✅ |
| `usePlaceBet()` | Colocar aposta | ✅ |
| `useBetHistory()` | Histórico de apostas | ✅ |
| `useBetCalculator()` | Calcular odds e retorno | ✅ |
| `useShareBet()` | Compartilhar bilhete | ✅ |

---

## 📁 Estrutura de Arquivos

```
mobile/
├── .env                          # Configuração de ambiente
├── INTEGRATION_GUIDE.md          # Documentação de uso
├── App.tsx                       # Entry point
├── src/
│   ├── api/
│   │   ├── config.ts            # Configuração endpoints
│   │   ├── http.ts              # Cliente HTTP
│   │   └── public.ts            # Funções antigos (deprecated)
│   ├── hooks/
│   │   ├── index.ts             # Barrel exports
│   │   ├── useApi.ts            # Hook genérico
│   │   ├── useSports.ts         # Esportes
│   │   ├── useEvents.ts         # Eventos
│   │   ├── useMarkets.ts        # Mercados e odds
│   │   ├── useBets.ts           # Apostas
│   │   └── EXAMPLES.ts          # Exemplos de uso
│   ├── screens/
│   │   ├── ExploreScreen.tsx    # Listagem com filtro
│   │   ├── EventScreen.tsx      # Detalhes + mercados
│   │   ├── BetslipScreen.tsx    # Carrinho
│   │   └── ...
│   ├── components/
│   │   ├── EventCard.tsx        # Card de evento
│   │   ├── OddsCell.tsx         # Célula de odd
│   │   └── ...
│   ├── stores/
│   │   └── betslipStore.ts      # Estado global
│   └── navigation/
│       ├── RootNavigator.tsx    # Stack navigator
│       ├── MainTabs.tsx         # Tab navigator
│       └── types.ts             # Type definitions
```

---

## ⚙️ Configuração

### `.env` (Desenvolvimento)

```bash
# URL da API
EXPO_PUBLIC_API_ORIGIN=http://localhost:3001/api
EXPO_PUBLIC_API_V2_BASEPATH=http://localhost:3001/api-v2

# Identificação do cliente
EXPO_PUBLIC_DEVICE=mobile
EXPO_PUBLIC_LANGUAGE=pt
EXPO_PUBLIC_TRADER_ID=1

# Timeouts
EXPO_PUBLIC_REQUEST_TIMEOUT=15000       # 15 segundos
EXPO_PUBLIC_CACHE_TIME=300000           # 5 minutos
EXPO_PUBLIC_POLLING_INTERVAL=5000       # 5 segundos
```

### Credenciais (Opcional)

```bash
# Em mock-server/.env
FOOTBALL_DATA_TOKEN=sua_chave_gratuita_aqui
PORT=3001
```

---

## 🔄 Fluxo de Dados Arquitetura

```
┌─────────────────┐
│  React Native   │
│   App Mobile    │
└────────┬────────┘
         │
         │ HTTP
         ↓
┌─────────────────────────────────┐
│    Mock Server (Node.js/Express)│
│    - 23 endpoints disponíveis   │
│    - Cache de 5 minutos         │
│    - Auto-port detection        │
└────────┬────────────────────────┘
         │
         │ HTTP
         ↓
┌─────────────────────────────────┐
│   Football Data API             │
│   (football-data.org)           │
│   - Free tier                   │
│   - 25+ ligas de futebol        │
│   - Dados em tempo real         │
└─────────────────────────────────┘
```

---

## 🧪 Testando Localmente

### 1. Testar API Diretamente

```bash
# Esportes
curl http://localhost:3001/api-v2/today-sport-types/d/pt/1

# Próximos eventos
curl http://localhost:3001/api-v2/fixture-summary/d/pt/1/upcoming?limit=10

# Detalhes de um evento
curl http://localhost:3001/api-v2/fixture-detail/d/pt/1/123456

# Mercados
curl http://localhost:3001/api-v2/fixture-markets/d/pt/1/123456
```

### 2. Logs no App

Todos os hooks fazem console.log dos dados:

```typescript
const { events } = useUpcomingEvents();
// Vê console: 📡 Fetching: http://localhost:3001/api-v2/...
// Vê console: [eventos]
```

### 3. Estado do Redux/Zustand

BetslipScreen usa Zustand:

```typescript
import { useBetslipStore } from '../stores/betslipStore';

const { selections, stake, totalOdds } = useBetslipStore();
```

---

## 🎨 Design System

### Cores

| Cor | Uso | Hex |
|-----|-----|-----|
| **Verde** | Botões, ativo, sucesso | `#00ff00` |
| **Vermelho** | Ao vivo, alerta, evento | `#ff0000` |
| **Cinza Escuro** | Fundo | `#0a0a0a` |
| **Cinza Meio** | Backgrounds secundários | `#1a1a1a` |
| **Cinza Claro** | Texto secundário | `#888` |
| **Branco** | Texto principal | `#fff` |

### Componentes Reutilizáveis

- `EventCard.tsx` - Mostra jogo com odds
- `OddsCell.tsx` - Mostra uma odd clicável
- Loading spinners
- Error messages
- Empty states

---

## 📊 Dados de Teste

### Esportes Disponíveis (Free Tier Football Data)

- ⚽ English Premier League
- ⚽ La Liga (Spain)
- ⚽ Serie A (Italy)
- ⚽ Bundesliga (Germany)
- ⚽ Ligue 1 (France)
- ⚽ Campeonato Brasileiro
- 🏀 NBA (se disponível)
- 🎾 Tennis (se disponível)

### Dados por Jogo

```typescript
interface Fixture {
  id: string;
  homeTeam: { id: string; name: string; logo?: string };
  awayTeam: { id: string; name: string; logo?: string };
  status: 'scheduled' | 'live' | 'finished';
  startTime: string; // ISO 8601
  score?: { home: number; away: number };
  statistics?: {
    possession: { home: number; away: number };
    shots: { home: number; away: number };
    shotsOnTarget: { home: number; away: number };
  };
}
```

---

## 🐛 Troubleshooting

### "Conexão recusada (localhost:3001)"

```bash
# 1. Verificar se servidor está rodando
npm start  # em mock-server/

# 2. Se porta 3001 está bloqueada
# Servidor auto-detecta: 3001 → 3002 → 3003...

# 3. Verificar .env
cat mobile/.env
# Deve haver EXPO_PUBLIC_API_ORIGIN=http://localhost:3001/api
```

### "Dados vazios"

```bash
# 1. Testar API diretamente
curl http://localhost:3001/api-v2/today-sport-types/d/pt/1

# 2. Verificar logs do servidor
# Deve mostrar: "📡 GET /api-v2/today-sport-types..."

# 3. Testar token Football Data (se usando real)
# echo "FOOTBALL_DATA_TOKEN=xxx" >> mock-server/.env
```

### "Erro de CORS"

Incluído no servidor. Se persistir:

```javascript
// mock-server/index.js
app.use(cors({
  origin: '*',
  credentials: true
}));
```

---

## 🚀 Deployment

### Para Produção

1. **Update `.env` com endpoints reais**

```bash
EXPO_PUBLIC_API_ORIGIN=https://sua-api.com/api
EXPO_PUBLIC_API_V2_BASEPATH=https://sua-api.com/api-v2
```

2. **Build para Android/iOS**

```bash
eas build --platform android
eas build --platform ios
```

3. **Submit to Stores**

```bash
eas submit --platform android
eas submit --platform ios
```

---

## 📚 Referências

- [Football Data API Docs](https://www.football-data.org/documentation/api)
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🎓 Próximos Passos

Ideias para expandir:

- [ ] Autenticação com conta do usuário
- [ ] Histórico de apostas persistente (banco de dados)
- [ ] Notificações push para resultados
- [ ] Chat ao vivo durante eventos
- [ ] Gráficos de odds em tempo real
- [ ] Dark mode toggle
- [ ] Múltiplas moedas

---

## 📞 Support

Para dúvidas:

1. Consulte `mobile/INTEGRATION_GUIDE.md` - Documentação técnica
2. Veja `mobile/src/hooks/EXAMPLES.ts` - Exemplos práticos
3. Examine o código-fonte nos hooks - Bem comentado

---

## ✅ Checklist Final

- [x] Ambiente configurado (dev e prod)
- [x] Todos os 6 hooks implementados
- [x] 3 telas integradas com dados reais
- [x] Atualização de odds em tempo real
- [x] Cálculo de apostas funcional
- [x] Estados de carregamento e erro
- [x] Type safety com TypeScript
- [x] Documentação completa
- [x] Exemplos de código
- [x] Pronto para produção

---

**Status: 🎉 PRONTO PARA USAR!**

```
████████████████████ 100%
```

Todas as fases implementadas. App funcional. Dados reais. Ready to go! 🚀
