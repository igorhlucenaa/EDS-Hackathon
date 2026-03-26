# SwiftBet Native

Projeto mobile-only em **React Native + Expo**.

## Estrutura

- `mobile/`: app React Native
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

```bash
npm run dev
```

Atalhos:

- `npm run android`
- `npm run ios`
- `npm run typecheck`

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
