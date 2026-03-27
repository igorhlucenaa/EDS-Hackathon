/**
 * 🧪 EXEMPLOS DE USO DOS HOOKS
 * 
 * Este arquivo mostra exemplos práticos de como usar cada hook
 * em seus componentes React Native.
 */

// ============================================================================
// 1. HOOK GENÉRICO - useApi()
// ============================================================================

import { useApi } from '../hooks';

/**
 * Exemplo: Buscar dados genéricos da API
 */
function ExampleApiUsage() {
  const { data, loading, error, refetch } = useApi(
    '/endpoint-qualquer',
    true
  );

  if (loading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro: {error.message}</Text>;

  return (
    <View>
      <Text>{JSON.stringify(data)}</Text>
      <Button title="Recarregar" onPress={refetch} />
    </View>
  );
}

// ============================================================================
// 2. LISTAR ESPORTES - useSports()
// ============================================================================

import { useSports } from '../hooks';

function ExampleSports() {
  const { sports, loading } = useSports();

  if (loading) return <ActivityIndicator />;

  return (
    <ScrollView>
      {sports.map(sport => (
        <View key={sport.id}>
          <Text style={{ fontSize: 16 }}>
            {sport.icon} {sport.name}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

// Output esperado:
// ⚽ England
// ⚽ Spain
// ⚽ Germany
// ⚽ Italy
// ⚽ France
// 🏀 NBA
// etc.

// ============================================================================
// 3. PRÓXIMOS EVENTOS - useUpcomingEvents()
// ============================================================================

import { useUpcomingEvents } from '../hooks';

function ExampleUpcomingEvents() {
  const { events, loading, page, nextPage, hasMore } = useUpcomingEvents();

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <ScrollView>
        {events.map(event => (
          <View key={event.id} style={{ marginBottom: 12 }}>
            <Text>{event.homeTeam.name} × {event.awayTeam.name}</Text>
            <Text style={{ fontSize: 12, color: '#888' }}>
              {new Date(event.startTime).toLocaleTimeString('pt-BR')}
            </Text>
          </View>
        ))}
      </ScrollView>

      {hasMore && (
        <Button
          title={`Próxima página (página ${page})`}
          onPress={nextPage}
        />
      )}
    </View>
  );
}

// Output esperado:
// Arsenal × Liverpool
// 14:00
//
// Manchester City × Chelsea
// 16:30
//
// Tottenham × Newcastle
// 18:00
// [Próxima página (página 0)]

// ============================================================================
// 4. EVENTOS AO VIVO - usePromotedEvents()
// ============================================================================

import { usePromotedEvents } from '../hooks';

function ExamplePromotedEvents() {
  const { promotedEvents, loading } = usePromotedEvents();

  if (loading) return <ActivityIndicator />;

  return (
    <ScrollView horizontal>
      {promotedEvents.map(event => (
        <View
          key={event.id}
          style={{
            borderWidth: 2,
            borderColor: '#ff0000',
            padding: 12,
            marginRight: 12,
            borderRadius: 8
          }}
        >
          <Text style={{ color: '#ff0000', fontWeight: 'bold' }}>🔴 AO VIVO</Text>
          <Text>{event.name}</Text>
          {event.score && (
            <Text style={{ color: '#00ff00', fontSize: 18, fontWeight: 'bold' }}>
              {event.score.home} - {event.score.away}
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

// Output esperado:
// ┌─────────────────────┐
// │ 🔴 AO VIVO          │ ┌─────────────────────┐
// │ Arsenal × Liverpool │ │ 🔴 AO VIVO          │
// │ 2 - 1               │ │ Man City × Chelsea  │
// └─────────────────────┘ │ 3 - 0               │
//                         └─────────────────────┘

// ============================================================================
// 5. DETALHES DO JOGO - useFixtureDetail()
// ============================================================================

import { useFixtureDetail } from '../hooks';

function ExampleFixtureDetail() {
  const { fixture, loading } = useFixtureDetail('123456'); // ID real do jogo

  if (loading) return <ActivityIndicator />;
  if (!fixture) return <Text>Jogo não encontrado</Text>;

  return (
    <ScrollView>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        {fixture.homeTeam.name}
      </Text>

      <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center' }}>
        {fixture.score?.home} - {fixture.score?.away}
      </Text>

      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>
        {fixture.awayTeam.name}
      </Text>

      {fixture.statistics && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>📊 Estatísticas</Text>
          <Text>Posse: {fixture.statistics.possession.home}% - {fixture.statistics.possession.away}%</Text>
          <Text>Chutes: {fixture.statistics.shots.home} - {fixture.statistics.shots.away}</Text>
          <Text>Chutes no Alvo: {fixture.statistics.shotsOnTarget.home} - {fixture.statistics.shotsOnTarget.away}</Text>
        </View>
      )}
    </ScrollView>
  );
}

// Output esperado:
// Arsenal
//
//      2 - 1
//
// Liverpool
//
// 📊 Estatísticas
// Posse: 45% - 55%
// Chutes: 12 - 15
// Chutes no Alvo: 5 - 6

// ============================================================================
// 6. MERCADOS DE APOSTAS - useFixtureMarkets()
// ============================================================================

import { useFixtureMarkets } from '../hooks';

function ExampleFixtureMarkets() {
  const { markets, loading } = useFixtureMarkets('123456');

  if (loading) return <ActivityIndicator />;

  return (
    <ScrollView>
      {markets.map(market => (
        <View key={market.id} style={{ marginBottom: 16, padding: 12, backgroundColor: '#eee', borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>{market.name}</Text>

          <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
            {market.outcomes.map(outcome => (
              <TouchableOpacity
                key={outcome.id}
                style={{
                  flex: 1,
                  backgroundColor: '#00ff00',
                  padding: 8,
                  borderRadius: 4,
                  alignItems: 'center'
                }}
              >
                <Text>{outcome.name}</Text>
                <Text style={{ fontWeight: 'bold' }}>{outcome.odds}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// Output esperado:
// ┌──────────────────────────────────┐
// │ Match Result                     │
// │ [Home  ] [Draw  ] [Away  ]       │
// │  1.50    3.00    2.80            │
// └──────────────────────────────────┘
// ┌──────────────────────────────────┐
// │ Over/Under 2.5 Goals             │
// │ [Over   ] [Under ]               │
// │  1.95     1.90                   │
// └──────────────────────────────────┘

// ============================================================================
// 7. ODDS EM TEMPO REAL - useOddsPolling()
// ============================================================================

import { useOddsPolling } from '../hooks';

function ExampleOddsPolling() {
  const { odds, lastUpdate, loading } = useOddsPolling(
    '123456', // fixtureId
    ['market-1', 'market-2'], // marketIds
    5000 // interval em ms (atualiza a cada 5s)
  );

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Text>Última atualização: {new Date(lastUpdate).toLocaleTimeString()}</Text>

      {/* Acessar odds de um outcomeId específico */}
      <Text>
        Odds Home: {odds.odds['market-1']?.['outcome-home-id']}
      </Text>
      <Text>
        Odds Away: {odds.odds['market-1']?.['outcome-away-id']}
      </Text>
    </View>
  );
}

// Output esperado:
// Última atualização: 14:32:45
// Odds Home: 1.50
// Odds Away: 2.80
// [atualiza automaticamente a cada 5 segundos]

// ============================================================================
// 8. COLOCAR APOSTA - usePlaceBet()
// ============================================================================

import { usePlaceBet } from '../hooks';

function ExamplePlaceBet() {
  const { placeBet, loading, error } = usePlaceBet();

  const handlePlaceBet = async () => {
    try {
      const result = await placeBet({
        selections: [
          {
            eventId: '123456',
            marketId: 'market-id-1',
            outcomeId: 'outcome-home',
            odds: 1.50
          },
          {
            eventId: '789012',
            marketId: 'market-id-2',
            outcomeId: 'outcome-under',
            odds: 1.95
          }
        ],
        stake: 100,
        expectedReturn: 292.50 // 100 * 1.50 * 1.95
      });

      console.log('✅ Aposta colocada:', result.betId);
      Alert.alert('Sucesso', `Aposta #${result.betId} registrada!`);
    } catch (err) {
      console.error('❌ Erro:', error?.message);
      Alert.alert('Erro', 'Não conseguimos processar sua aposta');
    }
  };

  return (
    <TouchableOpacity onPress={handlePlaceBet} disabled={loading}>
      <Text>{loading ? 'Processando...' : 'Apostar R$ 100'}</Text>
    </TouchableOpacity>
  );
}

// Output esperado:
// ✅ Aposta colocada: bet_12345
// Alert: Sucesso
// Aposta #bet_12345 registrada!

// ============================================================================
// 9. HISTÓRICO DE APOSTAS - useBetHistory()
// ============================================================================

import { useBetHistory } from '../hooks';

function ExampleBetHistory() {
  const { bets, loading } = useBetHistory();

  if (loading) return <ActivityIndicator />;

  return (
    <ScrollView>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Minhas Apostas</Text>

      {bets.map(bet => (
        <View
          key={bet.id}
          style={{
            padding: 12,
            marginBottom: 8,
            backgroundColor: bet.status === 'won' ? '#00ff0033' : '#ff000033',
            borderRadius: 8,
            borderLeftWidth: 3,
            borderLeftColor: bet.status === 'won' ? '#00ff00' : '#ff0000'
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>Aposta #{bet.id}</Text>
          <Text>Valor: R$ {bet.stake.toFixed(2)}</Text>
          <Text>Odds Totais: {bet.totalOdds.toFixed(2)}</Text>
          <Text>Retorno: R$ {bet.potentialWin.toFixed(2)}</Text>
          <Text style={{ fontWeight: 'bold', color: bet.status === 'won' ? '#00ff00' : '#ff0000' }}>
            Status: {bet.status === 'won' ? '✅ Ganhou' : '❌ Perdeu'}
          </Text>
          <Text style={{ fontSize: 12, color: '#888' }}>
            {new Date(bet.timestamp).toLocaleString('pt-BR')}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

// Output esperado:
// Minhas Apostas
// ┌─────────────────────────────────┐ (verde)
// │ Aposta #bet_12345               │
// │ Valor: R$ 100.00                │
// │ Odds Totais: 2.45               │
// │ Retorno: R$ 245.00              │
// │ Status: ✅ Ganhou               │
// │ 25/03/2026 14:30:00             │
// └─────────────────────────────────┘
// ┌─────────────────────────────────┐ (vermelho)
// │ Aposta #bet_12344               │
// │ Valor: R$ 50.00                 │
// │ Odds Totais: 1.80               │
// │ Retorno: R$ 90.00               │
// │ Status: ❌ Perdeu               │
// │ 24/03/2026 18:15:00             │
// └─────────────────────────────────┘

// ============================================================================
// 10. CALCULAR ODDS - useBetCalculator()
// ============================================================================

import { useBetCalculator } from '../hooks';

function ExampleBetCalculator() {
  const { calculateReturn, calculateTotalOdds, parseOdds } = useBetCalculator();

  // Exemplo 1: Calcular retorno
  const stake = 100;
  const odds = [1.50, 2.00, 1.80];
  const totalOdds = calculateTotalOdds(odds);
  const potentialReturn = calculateReturn(stake, totalOdds);

  console.log(`Aposta: R$ ${stake}`);
  console.log(`Odds: ${odds.join(' × ')} = ${totalOdds}`);
  console.log(`Retorno potencial: R$ ${potentialReturn}`);

  // Exemplo 2: Parse odds de string
  const stringOdds = '1.50';
  const numOdds = parseOdds(stringOdds); // 1.5

  return (
    <View>
      <Text>Stake: R$ {stake}</Text>
      <Text>Odds Totais: {totalOdds.toFixed(2)}</Text>
      <Text>Retorno: R$ {potentialReturn.toFixed(2)}</Text>
      <Text>Ganho Potencial: R$ {(potentialReturn - stake).toFixed(2)}</Text>
    </View>
  );
}

// Output esperado:
// Aposta: R$ 100
// Odds: 1.5 × 2 × 1.8 = 5.4
// Retorno potencial: R$ 540
//
// Stake: R$ 100
// Odds Totais: 5.40
// Retorno: R$ 540.00
// Ganho Potencial: R$ 440.00

// ============================================================================
// FLUXO COMPLETO DE INTEGRAÇÃO
// ============================================================================

/**
 * Este é um exemplo real de como integrar todos os hooks
 * em um fluxo completo de aposta
 */

import { useBetslipStore } from '../stores/betslipStore';

function BetFlowExample() {
  // 1. Listar eventos
  const { events: upcomingEvents } = useUpcomingEvents();
  const { promotedEvents } = usePromotedEvents();

  const handleSelectEvent = (eventId) => {
    // 2. Buscar detalhes do evento
    // navigation.navigate('Event', { id: eventId });
  };

  // 3. Em EventScreen:
  // - useFixtureDetail() para placar
  // - useFixtureMarkets() para mercados
  // - useOddsPolling() para odds em tempo real

  // 4. Em BetslipScreen:
  // - useBetCalculator() para totais
  // - usePlaceBet() para enviar aposta
  // - useBetHistory() para ver histórico

  return <View>{/* renderizar eventos */}</View>;
}

// ============================================================================
// RESUMO DE ERROS COMUNS
// ============================================================================

/**
 * ❌ ERRADO:
 * const data = useApi('/endpoint'); // Sem type
 * 
 * ✅ CORRETO:
 * const { data } = useApi<MyType>('/endpoint');
 */

/**
 * ❌ ERRADO:
 * const { fixture } = useFixtureDetail(params.id); // Pode ser null ao carregar
 * return <Text>{fixture.homeTeam.name}</Text>;
 * 
 * ✅ CORRETO:
 * const { fixture, loading } = useFixtureDetail(params.id);
 * if (loading || !fixture) return <ActivityIndicator />;
 * return <Text>{fixture.homeTeam.name}</Text>;
 */

/**
 * ❌ ERRADO:
 * const odds = useOddsPolling(fixtureId, marketIds); // Sem interval
 * 
 * ✅ CORRETO:
 * const odds = useOddsPolling(fixtureId, marketIds, 5000); // 5 segundos
 */

export {};
