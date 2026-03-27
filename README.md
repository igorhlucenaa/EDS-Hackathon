# 🎲 SwiftBet Platform

Projeto mobile-only em **React Native + Expo** com **Mock Server Express.js** para desenvolvimento.

> **NEW**: Mock server totalmente implementado com 23 endpoints! 🚀

## Estrutura

- `mobile/`: app React Native
- `mock-server/`: ⭐ Servidor mock Express (novo!)
- `shared/`: tipos, mocks e utilitarios compartilhados

## Requisitos

- Node.js `20.19.4` ou superior
- Android Studio para emulador Android
- macOS + Xcode para simulador iOS
- Ou celular fisico com Expo Go

## Instalacao

```bash
npm run setup
```

Esse comando instala as dependencias do app em `mobile/`.

## Rodando

### App Mobile

```bash
npm run dev
```

Atalhos:

- `npm run android`
- `npm run ios`
- `npm run typecheck`

### 🚀 Mock Server (Novo!)

Para desenvolvimento local com dados simulados:

**Terminal 1 - Mock Server:**
```bash
cd mock-server
npm install  # Primeira vez apenas
npm start    # Inicia em localhost:3001
```

**Terminal 2 - App Mobile:**
```bash
npm run dev
```

**Teste os Endpoints:**
Abra http://localhost:3001/test.html no navegador

Para mais detalhes, veja:
- [QUICK_START.md](./mock-server/QUICK_START.md) - Guia rápido (5 min)
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Guia para devs (10 min)
- [MOCK_SERVER_SETUP.md](./MOCK_SERVER_SETUP.md) - Integração com app (15 min)
- [TABLE_OF_CONTENTS.md](./TABLE_OF_CONTENTS.md) - Índice completo

## Observacoes

- O projeto nao possui mais app web, Vite ou Capacitor.
- O codigo de produto esta no app Expo em `mobile/`.
- A camada de API publica (sem login) fica em `mobile/src/api/`.

## API (sem login)

Basepath padrao configurado:

- `https://esportesdasorte.bet.br/api`

Variaveis opcionais para ajustar runtime no Expo:

- `EXPO_PUBLIC_API_BASEPATH`
- `EXPO_PUBLIC_API_V2_BASEURL`
- `EXPO_PUBLIC_API_DOMAIN`
- `EXPO_PUBLIC_API_DEVICE`
- `EXPO_PUBLIC_API_LANGUAGE_CODE`
- `EXPO_PUBLIC_API_LANGUAGE_ID`
- `EXPO_PUBLIC_API_TRADER_ID`
- `EXPO_PUBLIC_API_REFERER`
- `EXPO_PUBLIC_API_CUSTOM_ORIGIN`
- `EXPO_PUBLIC_API_BRAGI_URL`
- `EXPO_PUBLIC_API_TIMEOUT_MS`

Endpoints de autenticacao/login nao foram conectados ainda, por solicitacao.
