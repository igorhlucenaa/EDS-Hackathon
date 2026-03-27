# 🚀 QUICK REFERENCE - Cheatsheet dos Hooks

## 📋 Sumário Rápido

Referência visual para copiar e colar rapidamente.

---

## 1️⃣ useApi - Hook Genérico

```typescript
// Importar
import { useApi } from '../hooks';

// Usar
const { data, loading, error, refetch } = useApi<MyType>(
  '/endpoint',
  true,  // useV2?
  true   // autoFetch?
);

// Acessar
if (loading) { /* ... */ }
if (error) { /* ... */ }
console.log(data);
refetch(); // Recarregar
```

---

## 2️⃣ useSports - Listar Esportes

```typescript
import { useSports } from '../hooks';

const { sports, loading, error } = useSports();

// sports: Array<{id, name, icon}>
// Exemplo: {id: 1, name: "Football", icon: "⚽"}

sports.map(s => <Text key={s.id}>{s.icon} {s.name}</Text>)
```

---

## 3️⃣ useSportMenu - Menu Completo

```typescript
import { useSportMenu } from '../hooks';

const { sports, loading, error } = useSportMenu();

// Acesso a estrutura completa com categorias
```

---

## 4️⃣ useUpcomingEvents - Próximos Jogos

```typescript
import { useUpcomingEvents } from '../hooks';

// Sem paginação
const { events, loading } = useUpcomingEvents();

// Com paginação
const { events, loading, page, nextPage, hasMore } = useUpcomingEvents();

// Acessar dados
events.map(e => ({
  id: e.id,
  home: e.homeTeam.name,
  away: e.awayTeam.name,
  time: new Date(e.startTime),
  score: e.score,  // {home: 1, away:2} ou undefined
  status: e.status // 'scheduled', 'live', 'finished'
}))
```

---

## 5️⃣ usePromotedEvents - Ao Vivo

```typescript
import { usePromotedEvents } from '../hooks';

const { promotedEvents, loading } = usePromotedEvents();

// promotedEvents: events com status='live' ou destaque
// Sempre com score e atualizado
```

---

## 6️⃣ useFixtureDetail - Detalhes do Jogo

```typescript
import { useFixtureDetail } from '../hooks';

const { fixture, loading } = useFixtureDetail('123');

// Acessar
fixture?.homeTeam.name
fixture?.score.home
fixture?.statistics.possession.home
fixture?.status // 'live', 'scheduled', 'finished'
```

---

## 7️⃣ useFixtureMarkets - Mercados

```typescript
import { useFixtureMarkets } from '../hooks';

const { markets, loading } = useFixtureMarkets('fixture-id');

// Estrutura
markets.map(m => ({
  id: m.id,
  name: m.name,  // "Match Result", "Over/Under 2.5", etc
  outcomes: m.outcomes  // [{id, name, odds}...]
}))

// Usar em botão
<TouchableOpacity onPress={() => selectOdds(outcome.id, outcome.odds)}>
  <Text>{outcome.name} @ {outcome.odds}</Text>
</TouchableOpacity>
```

---

## 8️⃣ useOddsPolling - Odds em Tempo Real

```typescript
import { useOddsPolling } from '../hooks';

const odds = useOddsPolling(
  'fixture-123',
  ['market-1', 'market-2'],
  5000  // atualiza a cada 5s
);

// Acessar
const outcomeOdds = odds.odds['market-1']['outcome-id'];  // "1.50"
const lastUpdate = odds.lastUpdate;  // timestamp

// Rerender automático quando odds mudam
<Text>{odds.odds['market-1']['outcome-home']}</Text>
```

---

## 9️⃣ usePlaceBet - Colocar Aposta

```typescript
import { usePlaceBet } from '../hooks';

const { placeBet, loading, error } = usePlaceBet();

// Usar
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

// result: {betId, status, timestamp}
console.log(result.betId);
```

---

## 🔟 useBetHistory - Histórico

```typescript
import { useBetHistory } from '../hooks';

const { bets, loading } = useBetHistory();

// bets: Array<{id, stake, totalOdds, potentialWin, status, timestamp}>
// status: 'won', 'lost', 'pending'

bets.map(bet => (
  <View key={bet.id}>
    <Text>R$ {bet.stake}</Text>
    <Text>Status: {bet.status}</Text>
  </View>
))
```

---

## 🔳 useBetCalculator - Calcular Odds

```typescript
import { useBetCalculator } from '../hooks';

const { calculateReturn, calculateTotalOdds, parseOdds } = useBetCalculator();

// Calcular total de odds
const totalOdds = calculateTotalOdds([1.50, 2.00, 1.80]);
// → 5.4

// Calcular retorno
const potentialWin = calculateReturn(100, 5.4);
// → 540

// Parse string para número
const num = parseOdds("1.50");
// → 1.5
```

---

## 🎯 Integração Rápida em Telas

### ExploreScreen (Listagem)

```typescript
import { useSports, useUpcomingEvents } from '../hooks';

export function ExploreScreen({ navigation }) {
  const { sports } = useSports();
  const { events } = useUpcomingEvents();

  return (
    <ScrollView>
      {/* Esportes */}
      <ScrollView horizontal>
        {sports.map(s => (
          <Text key={s.id}>{s.icon} {s.name}</Text>
        ))}
      </ScrollView>

      {/* Eventos */}
      {events.map(e => (
        <TouchableOpacity
          key={e.id}
          onPress={() => navigation.navigate('Event', { id: e.id })}
        >
          <Text>{e.homeTeam.name}</Text>
          <Text value>{e.awayTeam.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
```

### EventScreen (Detalhes)

```typescript
import { useFixtureDetail, useFixtureMarkets, useOddsPolling } from '../hooks';

export function EventScreen({ route }) {
  const { id } = route.params;
  const { fixture } = useFixtureDetail(id);
  const { markets } = useFixtureMarkets(id);
  const odds = useOddsPolling(id, markets.map(m => m.id), 5000);

  return (
    <ScrollView>
      {/* Placar */}
      <Text>{fixture?.homeTeam.name} {fixture?.score?.home}</Text>
      <Text>{fixture?.awayTeam.name} {fixture?.score?.away}</Text>

      {/* Mercados */}
      {markets.map(m => (
        <View key={m.id}>
          <Text>{m.name}</Text>
          {m.outcomes.map(o => (
            <TouchableOpacity key={o.id}>
              <Text>{o.name}</Text>
              <Text>{odds.odds[m.id]?.[o.id] || o.odds}</Text>
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

  const handleBet = async () => {
    const result = await placeBet({
      selections: selections.map(s => ({...})),
      stake,
      expectedReturn: potentialWin
    });
    clearSelections();
  };

  return (
    <View>
      <Text>Odds: {totalOdds.toFixed(2)}</Text>
      <Text>Retorno: R$ {potentialWin.toFixed(2)}</Text>
      <TouchableOpacity onPress={handleBet} disabled={loading}>
        <Text>{loading ? 'Aguarde...' : 'Apostar'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## ⚠️ Erros Comuns

### ❌ Sem type safety
```typescript
const data = useApi('/endpoint');
```

### ✅ Com type safety
```typescript
const data = useApi<YourType>('/endpoint');
```

### ❌ Acesso a null
```typescript
const { fixture } = useFixtureDetail(id);
return <Text>{fixture.name}</Text>; // ❌ Pode quebrar
```

### ✅ Verificar null
```typescript
const { fixture, loading } = useFixtureDetail(id);
if (!fixture) return null;
return <Text>{fixture.name}</Text>; // ✅ Seguro
```

### ❌ Sem tratamento de erro
```typescript
const { data, error } = useApi('/endpoint');
return <Text>{data.name}</Text>; // ❌ Ignora erro
```

### ✅ Com tratamento
```typescript
const { data, loading, error } = useApi('/endpoint');
if (loading) return <Spinner />;
if (error) return <ErrorView error={error} />;
return <Text>{data?.name}</Text>;
```

---

## 🎨 Padrão de Componente

```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useMyHook } from '../hooks';

interface MyComponentProps {
  // props aqui
}

export function MyComponent(props: MyComponentProps) {
  // States
  const [state, setState] = useState(null);

  // Hooks
  const { data, loading, error, refetch } = useMyHook();

  // Handlers
  const handlePress = () => {
    // logic
  };

  // Render: loading
  if (loading && !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator color="#00ff00" />
      </View>
    );
  }

  // Render: error
  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: '#ff0000' }}>❌ {error.message}</Text>
        <TouchableOpacity onPress={refetch}>
          <Text>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render: success
  return (
    <View>
      <Text>{data?.name}</Text>
      <TouchableOpacity onPress={handlePress}>
        <Text>Ação</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 📝 Tipos TypeScript

```typescript
// Sport
interface Sport {
  id: number;
  name: string;
  icon: string;
  competitions?: string[];
}

// Fixture
interface Fixture {
  id: string;
  name: string;
  status: 'scheduled' | 'live' | 'finished';
  startTime: string;
  homeTeam: Team;
  awayTeam: Team;
  score?: { home: number; away: number };
  sportId: number;
  league: string;
}

// Team
interface Team {
  id: string;
  name: string;
  logo?: string;
}

// Market
interface Market {
  id: string;
  name: string;
  type: string;
  outcomes: Outcome[];
}

// Outcome
interface Outcome {
  id: string;
  name: string;
  odds: number | string;
}

// Bet
interface Bet {
  id: string;
  stake: number;
  totalOdds: number;
  potentialWin: number;
  status: 'won' | 'lost' | 'pending';
  timestamp: string;
}
```

---

## 🔗 Links Úteis

- **Código dos Hooks**: `mobile/src/hooks/`
- **Exemplos Completos**: `mobile/src/hooks/EXAMPLES.ts`
- **Documentação Completa**: `mobile/INTEGRATION_GUIDE.md`
- **README Projeto**: `README_MOBILE.md`

---

## ✅ Checklist de Implementação

Ao usar um hook:

- [ ] Importar corretamente
- [ ] Adicionar type generics `<T>`
- [ ] Validar `loading` state
- [ ] Tratar `error` case
- [ ] Render fallback para `null`
- [ ] Usar `refetch()` para retry
- [ ] Componentes memoizados se necessário
- [ ] Testar com dados locais primeiro

---

**Print este arquivo e mantenha à mão! 📄**
