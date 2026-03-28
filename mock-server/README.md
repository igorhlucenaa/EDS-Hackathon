# SwiftBet Mock Server

Mock server completo que simula as respostas da API Sportingtech para desenvolvimento local do SwiftBet Platform.

## 🚀 Instalação

```bash
cd mock-server
npm install
```

## 🏃 Como Executar

### Modo produção
```bash
npm start
```

### Modo desenvolvimento (com auto-reload)
```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:3001`

## 🌐 Integração com Dados Reais (Opcional)

O servidor suporta integração com a Football Data API gratuita para fornecer dados mais autênticos durante o desenvolvimento.

### API Suportada

**Football Data API** (football-data.org)
- Gratuito com limites generosos
- Dados de ligas, times, jogos e classificações
- Cobertura de competições europeias principais

### Configuração

1. **Registre-se gratuitamente** em [Football Data API](https://www.football-data.org/client/register)

2. **Configure no arquivo `.env`:**
```env
FOOTBALL_DATA_API_KEY=sua_chave_aqui
USE_REAL_DATA=true
```

3. **Reinicie o servidor**

### Como Funciona

- **Sem configuração**: Usa apenas dados mock (padrão)
- **Com API configurada**: Mescla dados reais com mock para cobertura completa
- **Cache automático**: 5 minutos de cache para evitar abuso da API gratuita
- **Fallback**: Retorna aos dados mock se a API falhar

### Benefícios

- Dados autênticos de ligas europeias
- Jogos reais com placares atualizados
- Times e competições reais
- Melhor experiência de desenvolvimento
- Manutenção da compatibilidade com dados mock

## 📚 Endpoints Implementados

### Esportes e Categorias
- `GET /api-v2/today-sport-types/{device}/{language}/{trader}` - Lista esportes do dia
- `GET /api-v2/left-menu/{device}/{language}/{trader}` - Menu lateral com estrutura completa
- `GET /api-v2/antepost-summary/{device}/{language}/{trader}` - Apostas de longo prazo

### Fixtures e Eventos
- `GET /api-v2/upcoming-events/{device}/{language}/{trader}` - Próximos eventos
- `GET /api-v2/promoted-events/{device}/{language}/{trader}` - Eventos promovidos
- `GET /api-v2/popular-fixture/{device}/{language}/{trader}` - Eventos populares
- `GET /api-v2/detail-card/{device}/{language}/{trader}` - Detalhe de evento
- `GET /api-v2/fixture-search/{device}/{language}/{trader}` - Buscar fixtures
- `GET /api-v2/league-card/{device}/{language}/{trader}/{seasonIds}` - Dados de liga

### Mercados e Odds
- `GET /api-v2/bet-type-groups/{device}/{language}/{trader}` - Grupos de tipos de aposta
- `GET /api-v2/markets/{fixtureId}` - Mercados de um fixture
- `POST /api-v2/get-odds` - Odds em tempo real

### Configuração e Apostas
- `GET /api/generic/getApplicationParameters/{domain}/{device}` - Parâmetros da app
- `GET /api/generic/getTraderDefaults/{domain}/{device}` - Configurações padrão
- `GET /api/generic/getTraderPages/{domain}/{device}/{language_id}` - Configuração de páginas
- `POST /api/user/sportsBet/info` - Simular aposta
- `POST /api/generic/booking/bookabet` - Confirmar aposta

## 📋 Exemplos de Uso

### Buscar esportes do dia
```bash
curl http://localhost:3001/api-v2/today-sport-types/m/1/trader123
```

### Buscar próximos eventos
```bash
curl http://localhost:3001/api-v2/upcoming-events/m/1/trader123
```

### Simular aposta
```bash
curl -X POST http://localhost:3001/api/user/sportsBet/info \
  -H "Content-Type: application/json" \
  -d '{
    "selections": [
      {"id": "o1", "odds": 2.10},
      {"id": "o4", "odds": 2.05}
    ],
    "stake": 100
  }'
```

### Confirmar aposta
```bash
curl -X POST http://localhost:3001/api/generic/booking/bookabet \
  -H "Content-Type: application/json" \
  -d '{
    "selections": [
      {"id": "o1", "odds": 2.10},
      {"id": "o4", "odds": 2.05}
    ],
    "stake": 100,
    "betType": "accumulator"
  }'
```

## 🔌 Parâmetros de URL

Todos os endpoints ficcionam com estes parâmetros:

| Parâmetro | Exemplos | Descrição |
|-----------|----------|-----------|
| `device` | `m`, `d` | `m` = mobile, `d` = desktop |
| `language` | `1`, `2` | ID do idioma (1=português, 2=inglês) |
| `trader` | `trader123` | ID do trader/domain |
| `domain` | `esportesdasorte.bet.br` | Domínio do trader |

## 📊 Dados Mockados

### Esportes
- ⚽ Football (Futebol)
- 🏀 Basketball (Basquete)
- 🎾 Tennis (Tênis)
- 🥊 MMA (Artes Marciais)
- 🏐 Volleyball (Vôlei)

### Ligas
- Brasileirão
- Premier League
- La Liga
- Champions League
- NBA

### Tipos de Mercados
- Match Result (Resultado da Partida)
- Over/Under 2.5 Goals
- Both Teams Score
- Double Chance
- Total Corners

## 🌐 Configuração CORS

O servidor está configurado para aceitar requisições de qualquer origem. Para restringir em produção, edite o arquivo `index.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:8081', // Seu frontend
  credentials: true
}));
```

## 📝 Estrutura de Pasta

```
mock-server/
├── index.js                 # Servidor principal
├── package.json            # Dependências
├── data/
│   └── mockData.js        # Dados mockados
└── routes/
    ├── sports.js          # Endpoints de esportes
    ├── fixtures.js        # Endpoints de eventos
    ├── markets.js         # Endpoints de mercados
    └── config.js          # Endpoints de configuração
```

## 🔧 Entendendo a Estrutura de Respostas

Todas as respostas seguem este padrão:

```json
{
  "success": true,
  "responseCodes": [
    {
      "code": "OK",
      "message": "Success message"
    }
  ],
  "data": {
    // Dados específicos do endpoint
  }
}
```

## 🛠️ Debug e Logs

O servidor loga todas as requisições:

```
[2026-03-27T10:30:45.123Z] GET /api-v2/today-sport-types/m/1/trader123
[2026-03-27T10:30:45.456Z] POST /api/user/sportsBet/info
```

## 🚨 Troubleshooting

### Porta em uso
Se a porta 3001 estiver em uso, varie o PORT:

```bash
PORT=3002 npm start
```

### CORS Error
Certifique-se que o frontend está fazendo requests para `http://localhost:3001`

### Sem resposta
Verifique se o servidor está rodando:

```bash
curl http://localhost:3001/health
```

Deve retornar:
```json
{"status": "ok", "timestamp": "2026-03-27T10:30:45.123Z"}
```

## 📱 Integração com Mobile

No projeto `mobile/src/api/config.ts`, configure:

```typescript
const DEFAULT_API_BASEPATH = 'http://localhost:3001/api'
```

Depois use normalmente:

```typescript
const response = await requestJson('/generic/getApplicationParameters/swiftbet/m');
```

## 🔄 Dados Dinâmicos

- Os eventos ao vivo mudam a cada requisição
- As odds variam entre requisições (±0.3)
- Timestamps são atualizados em tempo real
- Viewer count é gerado aleatoriamente

## 📄 Licença

MIT
