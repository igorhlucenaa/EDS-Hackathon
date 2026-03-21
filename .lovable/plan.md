

# Esportes da Sorte — Refatoração Completa da Plataforma

## Diagnóstico do Produto Atual

O produto atual sofre de: sobrecarga visual extrema, hierarquia fraca, navegação confusa, zero personalização, cupom básico, experiência ao vivo genérica, e arquitetura de informação que prioriza volume sobre clareza.

## Visão da Nova Plataforma

Uma sportsbook premium, mobile-first, com inteligência contextual, que prioriza velocidade até a aposta, clareza absoluta e experiência ao vivo imersiva. Dois modos (Iniciante/Pro), home adaptativa, betslip inteligente e navegação por intenção.

## Fase 1 — Fundação (Este plano)

### 1. Design System & Tokens
- Paleta escura premium (deep navy/charcoal com acentos verdes energéticos)
- Typography scale, spacing, radius, elevation tokens
- Componentes base: Button, Card, OddsCell, Chip, Badge, Skeleton, BottomSheet, Input, Tabs, SegmentedControl

### 2. Arquitetura do Projeto
```
src/
  app/core/ (config, constants, utils)
  app/shared/ui/ (componentes genéricos)
  app/design-system/tokens/ (cores, tipografia, espaçamento)
  app/features/home/
  app/features/live/
  app/features/event/
  app/features/betslip/
  app/features/bets/
  app/features/sports/
  app/features/auth/
  app/features/account/
  app/features/wallet/
  app/features/favorites/
  app/features/promotions/
  app/data/mocks/ (dados realistas)
  app/data/models/ (interfaces TypeScript)
  app/state/ (stores com Context/Zustand)
  app/layouts/ (MainLayout, AuthLayout)
  app/routes/
```

### 3. Mock API Completa
- Dados realistas para: usuário, esportes, ligas, eventos (pré-jogo + ao vivo), odds, mercados, favoritos, apostas, saldo, transações, promoções, notificações
- Modelos TypeScript bem definidos
- Consistência entre entidades

### 4. Navegação Global
- Bottom nav mobile: Home, Ao Vivo, Explorar, Minhas Apostas, Conta
- Header inteligente com saldo, busca, notificações
- FAB do betslip com contador de seleções
- Busca universal com recentes, times, ligas, eventos

### 5. Telas Principais

**Home Adaptativa**
- Hero contextual com evento principal
- Quick Bet Strip (apostas rápidas)
- Seção "Ao Vivo Agora" com live snapshot cards
- "Começando em Breve" com countdown
- "Continue de onde parou"
- Ligas favoritas e recomendações
- Promoções contextuais

**Live Command Mode**
- Lista de eventos ao vivo com cards de snapshot (placar, tempo, momentum)
- Filtros por esporte
- Mercados rápidos inline
- Feedback visual de mudança de odds (verde sobe, vermelho desce)
- Animações suaves de atualização

**Match Hub Premium**
- Header do evento com placar/status
- Odds principais em destaque
- Tabs: Mercados, Estatísticas, Timeline
- Mercados agrupados por categoria com progressive disclosure
- Explicação humana de mercados (tooltip/expandível)
- Quick add ao cupom

**Smart Betslip**
- Drawer/bottom sheet persistente
- Modo simples e avançado
- Visualização clara de seleções, stake, retorno potencial
- Alertas de mudança de odds
- Indicador de risco
- Salvar rascunho, compartilhar, limpar com confirmação

**Minhas Apostas**
- Tabs: Abertas, Ao Vivo, Finalizadas
- Cards com status visual claro
- Cash out quando disponível
- Reentrada rápida no evento

**Conta & Carteira**
- Hub de controle: perfil, segurança, preferências, modo iniciante/pro
- Saldo com histórico de transações
- Fluxos de depósito/saque com estados claros

### 6. Features Inovadoras (Fase 1)
- **Quick Bet Strip**: apostas de 1 toque na home
- **Modo Iniciante/Pro**: toggle que ajusta densidade e explicações
- **Live Snapshot Cards**: estado do jogo em um card compacto
- **Explicação de Mercados**: linguagem simples para cada tipo
- **Descoberta por Intenção**: "Odds altas", "Jogos agora", "Aposta segura"
- **Volta Rápida**: ao abrir, mostrar o que importa baseado no contexto

### 7. Performance
- Lazy loading por rota (React.lazy + Suspense)
- Skeleton loaders em todas as áreas
- Virtualização de listas longas de odds
- Transições suaves com Framer Motion
- Estado do betslip persistido em localStorage

### 8. Roadmap
- **Fase 1** (este plano): Fundação, design system, home, live, match hub, betslip, minhas apostas, conta
- **Fase 2**: Cadastro/login/onboarding, favoritos inteligentes, wallet completa, promoções
- **Fase 3**: Bet builder guiado, alertas contextuais, personalização avançada, notificações
- **Fase 4**: Analytics, A/B testing, PWA, otimizações avançadas

