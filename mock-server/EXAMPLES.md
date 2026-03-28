# 📚 Exemplos de Requisições e Respostas

## 1️⃣ Health Check

### Requisição
```bash
curl http://localhost:3001/health
```

### Resposta
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

---

## 2️⃣ Listar Esportes do Dia

### Requisição
```bash
curl http://localhost:3001/api-v2/today-sport-types/m/1/trader123
```

### Resposta
```json
{
  "success": true,
  "responseCodes": [],
  "data": {
    "sports": [
      {
        "id": 1,
        "name": "Football",
        "icon": "🏟️",
        "eventCount": 20,
        "liveCount": 5
      },
      {
        "id": 2,
        "name": "Basketball",
        "icon": "🏀",
        "eventCount": 8,
        "liveCount": 2
      }
    ]
  }
}
```

---

## 3️⃣ Próximos Eventos

### Requisição
```bash
curl "http://localhost:3001/api-v2/upcoming-events/m/1/trader123"
```

### Resposta
```json
{
  "success": true,
  "responseCodes": [],
  "data": {
    "events": [
      {
        "id": "fixture_1",
        "fixtureId": 1,
        "name": "Flamengo vs Palmeiras",
        "status": "upcoming",
        "startTime": "2024-01-15T20:00:00Z",
        "sportId": 1,
        "leagueId": 1,
        "homeTeam": {
          "id": "team_1",
          "name": "Flamengo",
          "shortName": "FLA",
          "logo": "https://example.com/flamengo.png"
        },
        "awayTeam": {
          "id": "team_2",
          "name": "Palmeiras",
          "shortName": "PAL",
          "logo": "https://example.com/palmeiras.png"
        },
        "markets": [
          {
            "id": "market_1",
            "type": "Match Result",
            "outcomes": [
              {
                "id": "o1",
                "name": "Home",
                "odds": 2.10
              },
              {
                "id": "o2",
                "name": "Draw",
                "odds": 3.20
              },
              {
                "id": "o3",
                "name": "Away",
                "odds": 3.50
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## 4️⃣ Simular Aposta

### Requisição
```bash
curl -X POST http://localhost:3001/api/user/sportsBet/info \
  -H "Content-Type: application/json" \
  -d '{
    "selections": [
      {
        "id": "o1",
        "odds": 2.10,
        "marketType": "Match Result"
      },
      {
        "id": "o4",
        "odds": 2.05,
        "marketType": "Over 2.5"
      }
    ],
    "stake": 100,
    "betType": "accumulator"
  }'
```

### Resposta
```json
{
  "success": true,
  "responseCodes": [],
  "data": {
    "betInfo": {
      "totalOdds": 4.305,
      "stake": 100,
      "potentialWin": 430.5,
      "profit": 330.5,
      "currency": "BRL",
      "selections": [
        {
          "id": "o1",
          "odds": 2.10,
          "status": "valid"
        },
        {
          "id": "o4",
          "odds": 2.05,
          "status": "valid"
        }
      ]
    }
  }
}
```

### Explicação dos Campos
- **totalOdds**: 2.10 × 2.05 = 4.305
- **potentialWin**: 100 × 4.305 = €430.50
- **profit**: 430.50 - 100 = €330.50

---

## 5️⃣ Confirmar Aposta

### Requisição
```bash
curl -X POST http://localhost:3001/api/generic/booking/bookabet \
  -H "Content-Type: application/json" \
  -d '{
    "selections": [
      {
        "id": "o1",
        "odds": 2.10,
        "fixtureId": "fixture_1"
      },
      {
        "id": "o4",
        "odds": 2.05,
        "fixtureId": "fixture_2"
      }
    ],
    "stake": 100,
    "betType": "accumulator"
  }'
```

### Resposta
```json
{
  "success": true,
  "responseCodes": [],
  "data": {
    "booking": {
      "bookingId": "BK_9a7c6b5f2d8e1a",
      "status": "confirmed",
      "totalOdds": 4.305,
      "stake": 100,
      "potentialWin": 430.5,
      "profit": 330.5,
      "createdAt": "2024-01-15T10:35:22Z",
      "expiresAt": "2024-01-15T10:40:22Z",
      "selections": [
        {
          "id": "o1",
          "odds": 2.10,
          "status": "confirmed"
        },
        {
          "id": "o4",
          "odds": 2.05,
          "status": "confirmed"
        }
      ],
      "message": "Bet booking confirmed"
    }
  }
}
```

### Importante
- **bookingId**: ID único para rastrear a aposta
- **expiresAt**: Aposta expira em 5 minutos
- A aposta só é válida dentro deste período

---

## 6️⃣ Grupos de Apostas

### Requisição
```bash
curl http://localhost:3001/api-v2/bet-type-groups/m/1/trader123
```

### Resposta
```json
{
  "success": true,
  "responseCodes": [],
  "data": {
    "betTypeGroups": [
      {
        "id": "group_1",
        "name": "Match Results",
        "marketCount": 3,
        "markets": [
          {
            "id": "market_1",
            "type": "Match Result",
            "outcomes": 3
          },
          {
            "id": "market_2",
            "type": "Double Chance",
            "outcomes": 3
          }
        ]
      },
      {
        "id": "group_2",
        "name": "Goals",
        "marketCount": 4,
        "markets": [
          {
            "id": "market_3",
            "type": "Over/Under",
            "outcomes": 2
          },
          {
            "id": "market_4",
            "type": "Both Score",
            "outcomes": 2
          }
        ]
      }
    ]
  }
}
```

---

## 7️⃣ Mercados de um Evento

### Requisição
```bash
curl http://localhost:3001/api-v2/markets/fixture_1
```

### Resposta
```json
{
  "success": true,
  "responseCodes": [],
  "data": {
    "fixtureId": "fixture_1",
    "markets": [
      {
        "id": "market_1",
        "type": "Match Result",
        "outcomes": [
          {"id": "o1", "name": "Home", "odds": 2.10},
          {"id": "o2", "name": "Draw", "odds": 3.20},
          {"id": "o3", "name": "Away", "odds": 3.50}
        ]
      },
      {
        "id": "market_2",
        "type": "Over/Under 2.5",
        "outcomes": [
          {"id": "o4", "name": "Over", "odds": 2.05},
          {"id": "o5", "name": "Under", "odds": 1.85}
        ]
      },
      {
        "id": "market_3",
        "type": "Both Teams to Score",
        "outcomes": [
          {"id": "o6", "name": "Yes", "odds": 1.95},
          {"id": "o7", "name": "No", "odds": 1.85}
        ]
      }
    ]
  }
}
```

---

## 8️⃣ Obter Odds Dinâmicas

### Requisição
```bash
curl -X POST http://localhost:3001/api-v2/get-odds \
  -H "Content-Type: application/json" \
  -d '{
    "marketIds": ["market_1", "market_2", "market_3"]
  }'
```

### Resposta (Primeira Chamada)
```json
{
  "success": true,
  "responseCodes": [],
  "data": {
    "odds": [
      {
        "marketId": "market_1",
        "outcomes": [
          {"id": "o1", "odds": 2.10, "movement": "up"},
          {"id": "o2", "odds": 3.20, "movement": "stable"},
          {"id": "o3", "odds": 3.50, "movement": "down"}
        ]
      }
    ]
  }
}
```

### Resposta (Segunda Chamada - Odds Diferentes!)
```json
{
  "success": true,
  "responseCodes": [],
  "data": {
    "odds": [
      {
        "marketId": "market_1",
        "outcomes": [
          {"id": "o1", "odds": 2.15, "movement": "up"},        // Mudou!
          {"id": "o2", "odds": 3.18, "movement": "down"},      // Mudou!
          {"id": "o3", "odds": 3.52, "movement": "up"}         // Mudou!
        ]
      }
    ]
  }
}
```

⚠️ **Nota**: As odds variam de ±0.3 a cada requisição, simulando mercado em tempo real!

---

## 9️⃣ Configuração da App

### Requisição
```bash
curl http://localhost:3001/api/generic/getApplicationParameters/swiftbet/m
```

### Resposta
```json
{
  "success": true,
  "responseCodes": [],
  "data": {
    "applicationParameters": {
      "domain": "swiftbet",
      "timezone": "UTC",
      "currency": "BRL",
      "dateFormat": "DD/MM/YYYY",
      "decimalPlaces": 2,
      "minStake": 10,
      "maxStake": 10000,
      "maxOdds": 100,
      "minOdds": 1.01,
      "features": {
        "liveStreaming": true,
        "inPlayBetting": true,
        "cashOut": true,
        "multipleOptions": true
      }
    }
  }
}
```

---

## 🔟 Padrão de Erro

### Requisição (Endpoint Inválido)
```bash
curl http://localhost:3001/api-v2/invalid-endpoint/m/1/trader123
```

### Resposta
```json
{
  "success": false,
  "responseCodes": [
    {
      "code": "NOT_FOUND",
      "message": "Endpoint not found"
    }
  ],
  "data": null
}
```

---

## 🎯 Dicas de Testing

### 1. Testar Validação
```javascript
// JavaScript example
const payload = {
  selections: [
    { id: "o1", odds: 2.10 },
    { id: "o2", odds: 0.5 }  // Odds muito baixa!
  ],
  stake: 100
};

fetch('http://localhost:3001/api/user/sportsBet/info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(data => console.log(data));
```

### 2. Testar Expiry de Booking
```javascript
// Aposta expira em 5 minutos
const booking = { /* ... */ };
const expiryTime = new Date(booking.expiresAt);
const now = new Date();
const minutesLeft = (expiryTime - now) / 60000;
console.log(`Aposta válida por: ${minutesLeft} minutos`);
```

### 3. Testar Múltiplas Requisições
```javascript
// Odds mudam a cada requisição
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    fetch('http://localhost:3001/api-v2/get-odds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marketIds: ["market_1"] })
    })
    .then(r => r.json())
    .then(data => console.log(`Request ${i}:`, data.data.odds));
  }, i * 1000);
}
```

---

## 🧵 Fluxo Completo de Aposta

1. **Listar eventos** → GET `/api-v2/upcoming-events/...`
2. **Ver mercados** → GET `/api-v2/markets/{fixtureId}`
3. **Simular aposta** → POST `/api/user/sportsBet/info`
4. **Confirmar aposta** → POST `/api/generic/booking/bookabet`
5. **Obter confirmação** → Response contém `bookingId` e `expiresAt`

```bash
# Exemplo completo
curl -X POST http://localhost:3001/api/generic/booking/bookabet \
  -H "Content-Type: application/json" \
  -d '{"selections":[{"id":"o1","odds":2.10}],"stake":100}' \
  | jq '.data.booking | {bookingId, status, expiresAt}'
```
