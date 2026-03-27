# 👨‍💻 Developer Guide - SwiftBet Platform

## 🎯 Guia Prático para Desenvolvedores

Este guia simplificado mostra como começar a desenvolver o SwiftBet Platform em 5 minutos.

---

## ⚡ Setup Inicial (5 minutos)

### 1. Clone / Abra o Projeto
```bash
cd c:\Users\adm\Documents\workspace_igor\swiftbet-platform
```

### 2. Inicie o Mock Server
```bash
cd mock-server
npm install      # Primeira vez apenas
npm start        # Aguarde "listening on port 3001"
```

### 3. Em Outro Terminal - Inicie o App Mobile
```bash
cd mobile
npm install      # Primeira vez apenas
npm start        # ou expo start
```

### 4. Teste os Endpoints
Abra no navegador: **http://localhost:3001/test.html**

---

## 📱 Estrutura do Projeto

```
swiftbet-platform/
│
├── mobile/                    # App React Native
│   ├── src/
│   │   ├── screens/          # Telas (AccountScreen, BetslipScreen, etc)
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── hooks/            # Custom hooks (usePublicApiQueries)
│   │   ├── stores/           # Estado global (selectors, reducers)
│   │   ├── theme/            # Temas e estilos
│   │   ├── navigation/       # Navegação (RootNavigator, MainTabs)
│   │   ├── api/              # Configuração da API ⭐
│   │   └── App.tsx           # Componente raiz
│   └── package.json
│
├── mock-server/               # Servidor Mock para Desenvolvimento ⭐⭐
│   ├── index.js              # Entrada do servidor
│   ├── data/mockData.js       # Dados simulados
│   ├── routes/                # Endpoints de API
│   │   ├── sports.js          # Esportes (3 endpoints)
│   │   ├── fixtures.js        # Eventos (6 endpoints)
│   │   ├── markets.js         # Mercados (3 endpoints)
│   │   └── config.js          # Configuração (7 endpoints)
│   ├── test.html              # Interface para testar ⭐⭐⭐
│   ├── QUICK_START.md         # Guia rápido
│   ├── EXAMPLES.md            # Exemplos de cURL
│   └── package.json
│
├── shared/                     # Código compartilhado
│   ├── types.ts               # Tipos TypeScript
│   ├── utils/                 # Utilitários
│   └── mocks/                 # Dados mock (sports, events, users)
│
└── README.md                   # Documentação principal
```

---

## 🚀 Tarefas Comuns

### ✅ Executar o App
```bash
cd mobile && npm start
```

### ✅ Executar o Mock Server
```bash
cd mock-server && npm start
```

### ✅ Testar Endpoints
Abra: http://localhost:3001/test.html

### ✅ Ver Logs de API
```bash
# Terminal do mock-server mostra todas as requisições
[2024-01-15T10:30:45.123Z] GET /api-v2/today-sport-types/m/1/trader123
```

### ✅ Alterar para Produção
```bash
# Em mobile/src/api/environment.ts
const ENV = 'production';  // Altere de 'mock' para 'production'
```

### ✅ Testar com cURL
```bash
curl http://localhost:3001/api-v2/upcoming-events/m/1/trader123
```

---

## 🔗 Endpoints Mais Usados

| Usar | Endpoint | Descrição |
|------|----------|-----------|
| 📅 | `GET /api-v2/upcoming-events/m/1/trader123` | Lista próximos eventos |
| 🎯 | `GET /api-v2/markets/{fixtureId}` | Mercados de um evento |
| 💰 | `POST /api/user/sportsBet/info` | Simular aposta |
| ✅ | `POST /api/generic/booking/bookabet` | Confirmar aposta |
| 📊 | `GET /api-v2/today-sport-types/m/1/trader123` | Esportes disponíveis |

---

## 💻 Desenvolvimento Local

### Modo Watch (Auto-reload)
```bash
cd mobile && npm start
cd mock-server && npm run dev
```

### Debug de Requisições
No arquivo `mobile/src/api/http.ts`, adicione logs:
```javascript
api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method} ${config.url}`);
  return config;
});
```

### InspectNetwork
Use React Native Debugger ou Expo DevTools para ver requisições em tempo real.

---

## 📚 Documentação por Tópico

| Tópico | Arquivo | Para Quem |
|--------|---------|-----------|
| Quick Start | `mock-server/QUICK_START.md` | Iniciantes |
| Todos os Exemplos | `mock-server/EXAMPLES.md` | Desenvolvedores |
| Setup Completo | `MOCK_SERVER_SETUP.md` | Integradores |
| Detalhes Técnicos | `mock-server/README.md` | Arquitetos |
| Status Geral | `mock-server/STATUS.md` | Gerenciadores |

---

## 🧪 Testando a App

### Test.html (Recomendado)
```
Abra: http://localhost:3001/test.html
Clique em botões para testar endpoints
```

### cURL (Terminal)
```bash
# Teste simples
curl http://localhost:3001/health

# Com dados POST
curl -X POST http://localhost:3001/api/user/sportsBet/info \
  -H "Content-Type: application/json" \
  -d '{"selections":[{"id":"o1","odds":2.10}],"stake":100}'
```

### Postman / Insomnia
Importe a URL base: `http://localhost:3001`

---

## 🔧 Solução de Problemas

### ❌ "Connection refused on localhost:3001"
```bash
# Certifique-se que o mock-server está rodando
cd mock-server
npm start
```

### ❌ "Port 3001 already in use"
```bash
# Mude de porta
PORT=3002 npm start
```

### ❌ "Dados iguais todas as vezes"
```bash
# Normal! Os dados são regenerados a cada requisição
# Odds sempre variam de ±0.3
```

### ❌ "CORS error"
```bash
# CORS já está habilitado no servidor
# Verifique a URL no arquivo environment.ts
```

---

## 📝 Fluxo de Desenvolvimento

### 1. Setup (Primeira Vez)
- Clone o repositório
- `cd mock-server && npm install`
- `cd mobile && npm install`

### 2. Desenvolvimento Diário
- Terminal 1: `cd mock-server && npm run dev`
- Terminal 2: `cd mobile && npm start`
- Abra http://localhost:3001/test.html para testar

### 3. Push para Produção
- Altere environment de 'mock' para 'production'
- Certifique-se de ter credenciais reais
- Faça build: `npm run build`

---

## 🎓 Aprenda Mais

**Estrutura de uma Requisição:**
```typescript
GET /api-v2/upcoming-events/m/1/trader123
    ├─ Endpoint: upcoming-events
    ├─ Device: m (mobile)
    ├─ Language: 1 (português)
    └─ Trader: 123 (ID do trader)
```

**Resposta Padrão:**
```json
{
  "success": true,
  "responseCodes": [],
  "data": {
    "events": [/* ... */]
  }
}
```

**Simular Aposta:**
```json
POST /api/user/sportsBet/info
{
  "selections": [
    {"id": "o1", "odds": 2.10},
    {"id": "o2", "odds": 3.50}
  ],
  "stake": 100
}
// Response: {"totalOdds": 7.35, "potentialWin": 735, "profit": 635}
```

---

## 🚀 Próximas Funcionalidades

- [ ] Autenticação com JWT
- [ ] WebSocket para odds em tempo real
- [ ] Histórico de apostas
- [ ] Notificações push
- [ ] Payment gateway
- [ ] Live streaming

---

## 📞 Dúvidas Frequentes

**P: Posso trabalhar em produção e mock simultaneamente?**
A: Sim! Use environment.ts para alternar.

**P: Como adicionar novo endpoint?**
A: Crie arquivo em `mock-server/routes/novo.js` e importe em `index.js`.

**P: Posso mudar as portas?**
A: Sim! Veja `mock-server/index.js` para port do servidor.

**P: Quanto tempo leva para setup?**
A: 5 minutos com `npm install` acelerado.

---

## ✅ Checklist de Setup

- [ ] Node.js instalado (`node -v`)
- [ ] Git clonado/aberto no VS Code
- [ ] Terminal 1: mock-server iniciado
- [ ] Terminal 2: mobile app iniciado
- [ ] Navegador: http://localhost:3001/test.html funciona
- [ ] Teste.html: Clique em um endpoint → recebe resposta

Se tudo marcado ✅, você está pronto para desenvolver!

---

**Última Atualização**: Janeiro/2024
**Status**: ✅ Pronto para Desenvolvimento
**Suporte**: Veja documentação em `mock-server/`
