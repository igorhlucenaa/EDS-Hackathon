# 🎯 Guia de Integração - App Mobile + API Mock Server

## 📋 Sumário

Este documento descreve como usar os hooks criados para integrar sua aplicação React Native com o servidor mock que conecta à Football Data API.

---

## 🚀 Quick Start

### 1. **Iniciar o Servidor Mock**

```bash
cd mock-server
npm install
npm start
```

O servidor rodará em `http://localhost:3001` (ou porta auto-detectada se 3001 estiver ocupada).

### 2. **Verificar Conexão no App**

O arquivo `.env` já está configurado para apontar para `http://localhost:3001/api` (v1) e `http://localhost:3001/api-v2` (v2).

---

## 🪝 Hooks Disponíveis

### **useApi<T>()** - Hook Genérico
Base para todas as requisições à API com gerenciamento de estado automático.

```typescript
import { useApi } from '../hooks';

const { data, loading, error, refetch } = useApi<Sport[]>(
  '/today-sport-types/d/pt/1',
  true // useV2
);

if (loading) return <ActivityIndicator />;
if (error) return <Text>Erro: {error.message}</Text>;
return <Text>{data?.length} esportes</Text>;
```

**Parâmetros:**
- `endpoint` (string): Caminho da API
- `useV2` (boolean, padrão: true): Usar API v2
- `autoFetch` (boolean, padrão: true): Fazer fetch automático

**Retorna:**
- `data`: Dados recebidos (null enquanto carrega)
- `loading`: boolean indicando carregamento
- `error`: ApiRequestError ou null
- `refetch()`: Função para refazer a requisição

---

### **useSports()** - Listar Esportes e Competições

```typescript
import { useSports } from '../hooks';

const { sports, loading, error } = useSports();

return (
  <View>
    {sports.map(sport => (
      <Text key={sport.id}>⚽ {sport.name}</Text>
    ))}
  </View>
);
```

**Retorna:**
```typescript
{
  id: number;
  name: string;
  icon: string; // emoji
  competitions?: string[];
}[]
```

---

### **useSportMenu()** - Menu Completo de Esportes

```typescript
import { useSportMenu } from '../hooks';

const { sports: menu, loading } = useSportMenu();

// Acesso a categorias, tiers, mercados
```

---

### **useUpcomingEvents()** - Próximos Jogos

```typescript
import { useUpcomingEvents } from '../hooks';

const { events, loading, page, nextPage } = useUpcomingEvents();

return (
  <View>
    {events.map(event => (
      <View key={event.id}>
        <Text>{event.homeTeam.name} × {event.awayTeam.name}</Text>
        <Text>{new Date(event.startTime).toLocaleTimeString()}</Text>
      </View>
    ))}
    <TouchableOpacity onPress={nextPage}>
      <Text>Próxima página</Text>
    </TouchableOpacity>
  </View>
);
```

**Retorna:**
```typescript
{
  id: string;
  name: string;
  status: 'scheduled' | 'live' | 'finished';
  startTime: string; // ISO 8601
  homeTeam: { id: string; name: string; logo?: string };
  awayTeam: { id: string; name: string; logo?: string };
  score?: { home: number; away: number };
  sportId: number;
  league: string;
}[]
```

---

### **usePromotedEvents()** - Eventos em Destaque (Ao Vivo)

```typescript
import { usePromotedEvents } from '../hooks';

const { promotedEvents, loading } = usePromotedEvents();

// Eventos destacados/ao vivo com placar em tempo real
```

---

### **useFixtureDetail()** - Detalhes de um Jogo

```typescript
import { useFixtureDetail } from '../hooks';

const { fixture, loading } = useFixtureDetail('12345');

return (
  <View>
    <Text>{fixture?.homeTeam.name} {fixture?.score.home}</Text>
    <Text>{fixture?.awayTeam.name} {fixture?.score.away}</Text>
  </View>
);
```

---

### **useFixtureMarkets()** - Mercados de Apostas

```typescript
import { useFixtureMarkets } from '../hooks';

const { markets, loading } = useFixtureMarkets('12345');

return (
  <View>
    {markets.map(market => (
      <View key={market.id}>
        <Text>{market.name}</Text>
        {market.outcomes.map(outcome => (
          <TouchableOpacity 
            key={outcome.id}
            onPress={() => addToBetslip(outcome)}
          >
            <Text>{outcome.name} @ {outcome.odds}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ))}
  </View>
);
```

---

### **useOddsPolling()** - Odds em Tempo Real

```typescript
import { useOddsPolling } from '../hooks';

const odds = useOddsPolling(
  'fixture-id',
  ['market-1', 'market-2'],
  5000 // atualizar a cada 5 segundos
);

// odds.odds[marketId][outcomeId] = "1.50"
// odds.lastUpdate = timestamp da última atualização
```

---

### **usePlaceBet()** - Colocar Aposta

```typescript
import { usePlaceBet } from '../hooks';

const { placeBet, loading, error } = usePlaceBet();

const handleBet = async () => {
  const result = await placeBet({
    selections: [
      {
        eventId: '100',
        marketId: 'm1',
        outcomeId: 'o1',
        odds: 1.50
      }
    ],
    stake: 100,
    expectedReturn: 150
  });
  
  console.log('Aposta colocada:', result.betId);
};
```

**Retorna:**
```typescript
{
  betId: string;
  status: 'accepted' | 'pending';
  timestamp: string;
}
```

---

### **useBetHistory()** - Histórico de Apostas

```typescript
import { useBetHistory } from '../hooks';

const { bets, loading } = useBetHistory();

return (
  <View>
    {bets.map(bet => (
      <View key={bet.id}>
        <Text>Aposta #{bet.id}</Text>
        <Text>Status: {bet.status}</Text>
        <Text>Retorno: R$ {bet.potentialWin}</Text>
      </View>
    ))}
  </View>
);
```

---

### **useBetCalculator()** - Calcular Odds e Retorno

```typescript
import { useBetCalculator } from '../hooks';

const { calculateReturn, calculateTotalOdds } = useBetCalculator();

const stake = 100;
const odds = [1.50, 2.00, 1.80];
const totalOdds = calculateTotalOdds(odds); // 5.4
const potentialWin = calculateReturn(stake, totalOdds); // 540
```

---

## 🎬 Fluxo Completo de Exemplo

### ExploreScreen (Listagem)

```typescript
import { useSports, useUpcomingEvents } from '../hooks';

export function ExploreScreen() {
  const { sports } = useSports();
  const { events } = useUpcomingEvents();
  
  const handleSelectEvent = (eventId) => {
    navigation.navigate('Event', { id: eventId });
  };

  return (
    <ScrollView>
      {/* Esportes */}
      <View>
        {sports.map(sport => (
          <TouchableOpacity key={sport.id}>
            <Text>{sport.icon} {sport.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Eventos */}
      <View>
        {events.map(event => (
          <TouchableOpacity 
            key={event.id} 
            onPress={() => handleSelectEvent(event.id)}
          >
            <Text>{event.homeTeam.name}</Text>
            <Text>vs</Text>
            <Text>{event.awayTeam.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
```

### EventScreen (Detalhes + Mercados)

```typescript
import { useFixtureDetail, useFixtureMarkets, useOddsPolling } from '../hooks';
import { useBetslipStore } from '../stores/betslipStore';

export function EventScreen({ route }) {
  const { id } = route.params;
  const { fixture } = useFixtureDetail(id);
  const { markets } = useFixtureMarkets(id);
  const odds = useOddsPolling(id, markets.map(m => m.id), 5000);
  const toggleSelection = useBetslipStore(s => s.toggleSelection);

  const handleSelectOdds = (outcome, market) => {
    toggleSelection({
      id: `${id}-${outcome.id}`,
      eventId: id,
      event: fixture,
      marketId: market.id,
      marketName: market.name,
      outcomeId: outcome.id,
      outcomeName: outcome.name,
      odds: parseFloat(odds.odds[market.id][outcome.id] || outcome.odds)
    });
  };

  return (
    <ScrollView>
      {/* Placar */}
      <Text>{fixture?.homeTeam.name} {fixture?.score?.home}</Text>
      <Text>{fixture?.awayTeam.name} {fixture?.score?.away}</Text>

      {/* Mercados */}
      {markets.map(market => (
        <View key={market.id}>
          <Text>{market.name}</Text>
          {market.outcomes.map(outcome => (
            <TouchableOpacity
              key={outcome.id}
              onPress={() => handleSelectOdds(outcome, market)}
            >
              <Text>
                {outcome.name} @ {odds.odds[market.id][outcome.id] || outcome.odds}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
```

### BetslipScreen (Carrinho)

```typescript
import { usePlaceBet, useBetCalculator } from '../hooks';
import { useBetslipStore } from '../stores/betslipStore';

export function BetslipScreen() {
  const { selections, clearSelections } = useBetslipStore();
  const { placeBet, loading } = usePlaceBet();
  const { calculateTotalOdds, calculateReturn } = useBetCalculator();
  
  const [stake, setStake] = useState(10);
  
  const totalOdds = calculateTotalOdds(selections.map(s => s.odds));
  const potentialWin = calculateReturn(stake, totalOdds);

  const handlePlaceBet = async () => {
    const result = await placeBet({
      selections: selections.map(s => ({
        eventId: s.eventId,
        marketId: s.marketId,
        outcomeId: s.outcomeId,
        odds: s.odds
      })),
      stake,
      expectedReturn: potentialWin
    });

    Alert.alert('✅ Aposta registrada', `ID: ${result.betId}`);
    clearSelections();
  };

  return (
    <View>
      <Text>Odds totais: {totalOdds.toFixed(2)}</Text>
      <Text>Retorno: R$ {potentialWin.toFixed(2)}</Text>
      
      <TouchableOpacity onPress={handlePlaceBet} disabled={loading}>
        <Text>Apostar R$ {stake}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 🔴 Tratamento de Erros

Todos os hooks retornam um objeto `error` do tipo `ApiRequestError`:

```typescript
interface ApiRequestError extends Error {
  status: number;
  url: string;
  details: unknown;
}

// Uso
const { data, error } = useSports();

if (error) {
  console.error(`Erro ${error.status} em ${error.url}`);
  console.error(error.details);
}
```

---

## 🧪 Validação de Dados

Todos os dados vêm da **Football Data API** (free tier):
- ✅ 25+ ligas do mundo
- ✅ Atualização em tempo real
- ✅ Estatísticas completas de partidas
- ✅ Escalações de times

---

## 📱 Ambiente de Desenvolvimento

**Arquivo: `.env`**
```
EXPO_PUBLIC_API_ORIGIN=http://localhost:3001/api
EXPO_PUBLIC_API_V2_BASEPATH=http://localhost:3001/api-v2
EXPO_PUBLIC_DEVICE=mobile
EXPO_PUBLIC_LANGUAGE=pt
EXPO_PUBLIC_TRADER_ID=1
EXPO_PUBLIC_REQUEST_TIMEOUT=15000
EXPO_PUBLIC_CACHE_TIME=300000
```

---

## 🎯 Checklist de Implementação

- [x] Environment configurado
- [x] Hooks criados e testados
- [x] Telas integradas com dados reais
- [x] Estados de carregamento implementados
- [x] Tratamento de erros
- [x] Cálculos de odds e retorno
- [x] Betslip funcional
- [x] Atualização em tempo real (polling)

---

## 📞 Suporte

Para dúvidas sobre os hooks, consulte:
1. [mobile/src/hooks/](./src/hooks/) - Código-fonte
2. Exemplos de uso acima
3. Tipos TypeScript inline documentados

**Tudo está pronto para produção!** 🚀
