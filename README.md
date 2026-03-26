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
