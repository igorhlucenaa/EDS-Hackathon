# Features — Hackathon Esportes da Sorte

Este documento descreve as funcionalidades que diferenciam a plataforma de um sportsbook convencional: curadoria inteligente, experiência adaptativa e fluxos orientados à decisão do apostador.

---

## 1. Módulos Premium (Inteligência)

### 1.1 Radar de Oportunidade

**O que é:** Carrossel de oportunidades curadas em tempo real — jogos que começam em breve, momentos decisivos ao vivo, alta movimentação de linhas ou contexto com favoritos do usuário.

**Por que é diferente:** Em vez de listar todos os eventos, o radar prioriza **por relevância** e **urgencia** (critical, high, medium). Cada card exibe um motivo de destaque (`highlightReason`) e, quando aplicável, notas de movimento de odds ou contexto de favoritos.

**Onde:** Home (seção premium), rota `/intencoes` (link). Implementado em `src/app/premium/opportunity/OpportunityRadarSection.tsx`.

**Tipos de oportunidade:**
- `starting_soon` — Jogo começando em breve
- `decisive_moment` — Momento decisivo ao vivo
- `high_movement` — Linhas movendo forte
- `favorite_context` — Time ou liga favorita

---

### 1.2 Cupom Co-piloto (Betslip Copilot)

**O que é:** Análise em tempo real do cupom de apostas: tom de risco (baixo, moderado, elevado, alto), sugestão de stake por perfil (conservador, equilibrado, agressivo), alertas de dependências entre seleções e incompatibilidades (mercados repetidos no mesmo evento).

**Por que é diferente:** O apostador recebe **feedback estruturado** antes de enviar, em vez de depender só da intuição. O Copilot detecta:
- Correlação entre seleções no mesmo jogo
- Cadeia de dependência em múltiplas
- Mudanças de odds (flash) que merecem confirmação

**Onde:** Betslip (`/betslip`). Implementado em `src/app/premium/copilot/BetslipCopilot.tsx` e lógica em `copilotLogic.ts`.

**Extras:** Compartilhar cupom (Web Share API ou clipboard) e salvar rascunho.

---

### 1.3 Retomada Inteligente

**O que é:** Seção na Home que resume “o que mudou desde sua última visita”: apostas abertas, rascunhos salvos, jogos recentes visitados, próximos dos favoritos, além de indicadores como “X linhas mexeram” e “Y jogos em destaque”.

**Por que é diferente:** O usuário volta direto ao que importa, sem percorrer listas genéricas. A retomada é **ancorada em `lastVisitAt`** e usa favoritos/times para priorizar conteúdo.

**Onde:** Home (primeira seção premium). Implementado em `src/app/premium/resume/SmartResumeSection.tsx`.

---

### 1.4 Apostar por Intenção

**O que é:** Fluxo guiado por **intenções** (ex.: “Quero jogar seguro”, “Quero maximizar retorno”). Cada intenção tem trilhas (`IntentTrail`) com justificativa, eventos sugeridos e odds rápidas — o usuário escolhe por objetivo, não por lista de jogos.

**Por que é diferente:** A navegação sai do “escolher jogo → escolher mercado” e passa a ser “escolher objetivo → ver sugestões”. Menos ruído, mais foco em decisão.

**Onde:** Rota `/intencoes`, atalho na Home e no banner de boas-vindas. Implementado em `src/app/premium/intentions/IntentExplorePage.tsx`.

---

### 1.5 Pressão do Jogo

**O que é:** Cards de eventos ao vivo com métricas de **fase** (morna, aquecendo, momento quente, decisivo) e **dominância** (qual time está comandando). Ajuda o apostador a ler o momento do jogo além do placar.

**Por que é diferente:** Mostra contexto de dinâmica de jogo (intensidade, dominância) em vez de apenas odds e placar.

**Onde:** Aba Ao vivo (`/live`). Implementado em `src/app/premium/pressure/GamePressureCard.tsx`.

---

### 1.6 Explorador de Mercados

**O que é:** Visualização **por mercado** (Principal, Gols, etc.) em vez de por evento. O usuário vê todos os “Resultado Final”, “Mais/Menos X gols”, “Ambos Marcam” de vários jogos em uma única tela, com explicação do mercado e odds rápidas.

**Por que é diferente:** Facilita apostadores que pensam primeiro no tipo de aposta e depois escolhem o jogo.

**Onde:** Rota `/market-explorer`, chip “Mercados” nas apostas rápidas. Implementado em `src/app/features/market/MarketExplorerPage.tsx`.

---

## 2. Experiência Adaptativa

### 2.1 Modo Pro vs Iniciante

**O que é:** Dois modos de experiência (persistidos em `userStore`):
- **Iniciante:** Mais explicações, guias e ordem de blocos mais didática.
- **Pro:** Layout mais denso, foco em Radar e Retomada, menos texto auxiliar.

**Por que é diferente:** O mesmo produto se adapta ao nível de maturidade do apostador, sem precisar de perfis separados.

**Onde:** Conta e Preferências; a Home reordena blocos conforme `experienceMode`. Implementado em `src/app/state/userStore.ts`, `AccountPage`, `PreferencesPage`, `HomePage`.

---

### 2.2 Banner de Boas-vindas (Primeira Visita)

**O que é:** Banner exibido na Home para usuários que ainda não o dispensaram. Oferece atalhos para Explorar eventos e Apostar por intenção, além de “Entendi” para dispensar.

**Por que é diferente:** Onboarding leve, sem wizard pesado. O usuário escolhe o próximo passo.

**Onde:** Home. Persistido em `visitStore.homeWelcomeDismissed`. Implementado em `src/app/features/home/HomeWelcomeBanner.tsx`.

---

### 2.3 Hero Dinâmico (Maior Audiência)

**O que é:** O destaque da Home não é um evento fixo — é o **ao vivo com maior audiência** no momento (`viewerCount`), escolhido por `pickHeroLiveEvent()`.

**Por que é diferente:** O foco visual acompanha o que a audiência está assistindo, aumentando relevância.

**Onde:** Home, card “Destaque da home”. Implementado em `src/app/data/mocks/events.ts` (`pickHeroLiveEvent`) e `HomePage.tsx` (`HeroFeaturedCard`).

---

## 3. Fluxos e Engajamento

### 3.1 Apostas Rápidas (Quick Chips)

**O que é:** Chips roláveis na Home com atalhos por objetivo: Odds altas, Ao vivo, Começando, Mercados, Favoritos. Reduz o número de toques para alcançar o conteúdo desejado.

**Onde:** Home. Implementado em `HomePage.tsx` com `HorizontalScrollRow`.

---

### 3.2 Rascunhos de Cupom

**O que é:** Salvar cupom em andamento como rascunho, com label e timestamp. Até 8 rascunhos, persistidos em `betslipDraftStore`. Os rascunhos aparecem na Retomada Inteligente para retomar rapidamente.

**Por que é diferente:** O usuário não perde o trabalho ao sair da tela ou fechar o app.

**Onde:** Cupom Co-piloto (botão Salvar rascunho), Retomada Inteligente. Implementado em `src/app/state/betslipDraftStore.ts`.

---

### 3.3 Compartilhar Cupom

**O que é:** Botão no Co-piloto que usa **Web Share API** (quando disponível) ou copia o cupom formatado para a área de transferência.

**Por que é diferente:** Facilita compartilhar estratégia com amigos ou em grupos.

**Onde:** Betslip, dentro do Cupom Co-piloto.

---

## 4. Design e Acessibilidade

### 4.1 Odds Rápidas Consistentes

**O que é:** Sistema de classes (`oddsQuickStyles.ts`) para botões de odd **fora** do `OddsCell`: mesmo visual do CTA “Rápido” quando a seleção está no cupom. Usado em Radar, Intenções, Explorador, EventCard, LiveSnapshotCard.

**Por que é diferente:** Consistência visual em toda a plataforma — o usuário reconhece imediatamente o que está no cupom.

**Onde:** `src/lib/oddsQuickStyles.ts`. Usado em vários componentes premium e compartilhados.

---

### 4.2 HorizontalScrollRow com Affordance

**O que é:** Componente de rolagem horizontal com dica “Deslize para o lado para ver mais” em mobile, gradiente à direita para indicar mais conteúdo e `aria-label` para leitores de tela.

**Por que é diferente:** Melhora a descoberta de conteúdo rolável e a acessibilidade.

**Onde:** Home (chips, esportes, promoções), outros carrosséis. Implementado em `src/app/shared/ui/HorizontalScrollRow.tsx`.

---

### 4.3 Trust Microcopy

**O que é:** Mensagem curta em pontos sensíveis (ex.: odds) reforçando que “Odds podem mudar até o envio — sempre confirme no cupom”.

**Por que é diferente:** Transparência e redução de expectativas equivocadas.

**Onde:** `src/app/shared/ui/TrustMicrocopy.tsx` — componente reutilizável.

---

### 4.4 Safe Areas e Responsividade

**O que é:** Suporte a `viewport-fit=cover`, `safe-area-inset` (notch, home indicator), `dvh` (dynamic viewport height), padding seguro em header e navegação inferior.

**Por que é diferente:** Experiência correta em iPhones e dispositivos com bordas arredondadas.

**Onde:** `src/index.css` (utilitários), `MainLayout.tsx`, `BetslipPage`.

---

## 5. Infraestrutura Premium

### 5.1 FeatureStateBoundary

**O que é:** Componente que centraliza os estados **loading**, **empty** e **error** das features premium. Evita lógica repetida e garante UX consistente (skeleton, mensagem vazia, botão de retry).

**Onde:** Radar, Retomada, Intenções. Implementado em `src/app/premium/ui/FeatureStateBoundary.tsx`.

---

### 5.2 useSimulatedFetch

**O que é:** Hook que simula latência de API (`latencyMs`) para testes e demos. Facilita testar loading e transições sem backend real.

**Onde:** Radar, Retomada, Intenções. Implementado em `src/app/premium/hooks/useSimulatedFetch.ts`.

---

## 6. App Nativo e Performance

### 6.1 Capacitor (Web → Nativo)

**O que é:** Build do mesmo código React para **Android** e **iOS** via Capacitor. Um único código base, deploy web e nas lojas.

**Onde:** Pastas `android/` e `ios/`, `capacitor.config.ts`, scripts `cap:sync`, `cap:open:android`, `cap:open:ios`.

---

### 6.2 Lazy Loading de Seções Premium

**O que é:** Radar e Retomada carregados com `React.lazy` + `Suspense` na Home. Reduz o bundle inicial e melhora FCP/LCP.

**Onde:** `HomePage.tsx` — `OpportunityRadarSection` e `SmartResumeSection` lazy.

---

### 6.3 Histórico de Visitas

**O que é:** `visitStore` guarda `lastVisitAt`, `recentEventIds` e `homeWelcomeDismissed`. Usado pela Retomada (“desde sua última visita”) e para priorizar eventos recentes.

**Onde:** `src/app/state/visitStore.ts`.

---

## Resumo Visual

| Feature | Diferencial |
|--------|-------------|
| Radar de Oportunidade | Curadoria em tempo real por relevância e urgência |
| Cupom Co-piloto | Análise de risco, dependências e sugestão de stake |
| Retomada Inteligente | Resumo “desde a última visita” |
| Apostar por Intenção | Navegação por objetivo em vez de lista |
| Pressão do Jogo | Fase e dominância em jogos ao vivo |
| Explorador de Mercados | Busca por tipo de mercado |
| Modo Pro/Iniciante | Experiência adaptada ao perfil |
| Hero Dinâmico | Destaque = jogo com mais audiência |
| Rascunhos | Salvar e retomar cupons |
| Compartilhar cupom | Web Share API / clipboard |
