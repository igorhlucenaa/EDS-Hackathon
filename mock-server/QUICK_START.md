# 🚀 Quick Start - SwiftBet Mock Server

## ⚡ Comece em 30 segundos

### Windows
```bash
cd mock-server
start.bat
```

### macOS / Linux
```bash
cd mock-server
chmod +x start.sh
./start.sh
```

## 📱 Acessar a Interface de Testes

Depois que o servidor iniciar, abra no navegador:

```
http://localhost:3001/test.html
```

Você verá uma interface interativa para testar todos os endpoints em tempo real.

## 🧪 Testar Manualmente com cURL

### 1. Verificar saúde do servidor
```bash
curl http://localhost:3001/health
```

### 2. Listar esportes do dia
```bash
curl http://localhost:3001/api-v2/today-sport-types/m/1/trader123
```

### 3. Listar eventos próximos
```bash
curl http://localhost:3001/api-v2/upcoming-events/m/1/trader123
```

### 4. Simular uma aposta
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

### 5. Confirmar uma aposta
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

## 🔄 Modo Desenvolvimento (com auto-reload)

```bash
cd mock-server
npm run dev
```

Qualquer mudança nos arquivos será detectada automaticamente.

## 📋 Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Verifica se o servidor está rodando |
| GET | `/api-v2/today-sport-types/m/1/trader123` | Lista de esportes |
| GET | `/api-v2/upcoming-events/m/1/trader123` | Próximos eventos |
| GET | `/api-v2/promoted-events/m/1/trader123` | Eventos promovidos |
| GET | `/api-v2/popular-fixture/m/1/trader123` | Eventos populares |
| GET | `/api-v2/left-menu/m/1/trader123` | Menu completo |
| GET | `/api-v2/bet-type-groups/m/1/trader123` | Tipos de apostas |
| POST | `/api/user/sportsBet/info` | Simular aposta |
| POST | `/api/generic/booking/bookabet` | Confirmar aposta |
| GET | `/api/generic/getApplicationParameters/swiftbet/m` | Config app |

## 🔗 Integração com o App Mobile

No arquivo `mobile/src/api/config.ts`, altere:

```typescript
const DEFAULT_API_BASEPATH = 'http://localhost:3001/api';
```

Ou configure uma variável de ambiente para alternar entre mock e produção.

## ❓ Troubleshooting

**Porta já em uso?**
```bash
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # macOS/Linux

# Altere manualmente em mock-server/index.js ou use:
PORT=3002 npm start
```

**CORS erro?**
- O servidor já vem com CORS habilitado para todas as origens
- Se ainda tiver problema, verifique a URL da app mobile

**Dados vazios?**
- Os dados são gerados dinamicamente
- Faça uma nova requisição para obter dados diferentes

## 📚 Documentação Completa

Para mais detalhes, veja [README.md](./README.md)
