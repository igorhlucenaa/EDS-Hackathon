import type { Notification, NotificationCategory, NotificationPriority } from '../../mobile/src/stores/notificationStore';

export const mockNotifications: Notification[] = [
  // LIVE - Jogos ao vivo e cashout
  {
    id: 'live-1',
    title: 'Flamengo x Palmeiras está ao vivo',
    message: 'Sua aposta está em andamento. Acompanhe o jogo!',
    category: 'live' as NotificationCategory,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    isRead: false,
    actionType: 'navigate',
    actionPayload: { screen: 'Live' },
    priority: 'high' as NotificationPriority,
  },
  {
    id: 'live-2',
    title: 'Cashout disponível',
    message: 'Você pode fazer cashout da sua aposta no jogo do Flamengo.',
    category: 'live' as NotificationCategory,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    isRead: false,
    actionType: 'navigate',
    actionPayload: { screen: 'Bets', params: { tab: 'open' } },
    priority: 'high' as NotificationPriority,
  },
  {
    id: 'live-3',
    title: 'Faltam 10 minutos para começar',
    message: 'Bayern x PSG começa em breve. Não perca!',
    category: 'live' as NotificationCategory,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: true,
    actionType: 'navigate',
    actionPayload: { screen: 'Explore' },
    priority: 'medium' as NotificationPriority,
  },

  // MISSIONS - Missões e recompensas
  {
    id: 'mission-1',
    title: 'Nova missão diária disponível',
    message: 'Faça 1 aposta ao vivo e ganhe 50 XP.',
    category: 'missions' as NotificationCategory,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    isRead: false,
    actionType: 'navigate',
    actionPayload: { screen: 'Home', params: { showMissions: true } },
    priority: 'medium' as NotificationPriority,
  },
  {
    id: 'mission-2',
    title: 'Você está quase lá!',
    message: 'Falta apenas 1 ação para concluir sua missão de hoje.',
    category: 'missions' as NotificationCategory,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    isRead: false,
    actionType: 'navigate',
    actionPayload: { screen: 'Home', params: { showMissions: true } },
    priority: 'medium' as NotificationPriority,
  },
  {
    id: 'mission-3',
    title: 'Recompensa desbloqueada',
    message: 'Boost de odds liberado para usar hoje!',
    category: 'missions' as NotificationCategory,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
    actionType: 'navigate',
    actionPayload: { screen: 'Home', params: { showRewards: true } },
    priority: 'high' as NotificationPriority,
  },

  // SUGGESTIONS - Apostas prontas e sugestões
  {
    id: 'suggest-1',
    title: 'Aposta pronta para você',
    message: 'Criamos uma aposta especial para o jogo do seu time.',
    category: 'suggestions' as NotificationCategory,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
    isRead: false,
    actionType: 'navigate',
    actionPayload: { screen: 'Home', params: { showGuidedBet: true } },
    priority: 'medium' as NotificationPriority,
  },
  {
    id: 'suggest-2',
    title: 'Sua aposta quase bateu!',
    message: 'Veja uma versão mais equilibrada da sua última aposta.',
    category: 'suggestions' as NotificationCategory,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    isRead: true,
    actionType: 'navigate',
    actionPayload: { screen: 'Bets', params: { tab: 'closed', showAlternative: true } },
    priority: 'low' as NotificationPriority,
  },
  {
    id: 'suggest-3',
    title: 'Múltipla rápida disponível',
    message: 'Confira nossa seleção de hoje com odds aumentadas.',
    category: 'suggestions' as NotificationCategory,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    isRead: true,
    actionType: 'navigate',
    actionPayload: { screen: 'Explore' },
    priority: 'low' as NotificationPriority,
  },

  // ACCOUNT - Conta e preferências
  {
    id: 'account-1',
    title: 'Preferências salvas',
    message: 'Suas preferências de alerta foram atualizadas com sucesso.',
    category: 'account' as NotificationCategory,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    isRead: true,
    actionType: 'none',
    priority: 'low' as NotificationPriority,
  },
  {
    id: 'account-2',
    title: 'Recompensa da jornada',
    message: 'Você recebeu um bônus por completar sua jornada semanal.',
    category: 'account' as NotificationCategory,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    isRead: false,
    actionType: 'navigate',
    actionPayload: { screen: 'Home', params: { showRewards: true } },
    priority: 'high' as NotificationPriority,
  },
  {
    id: 'account-3',
    title: 'Nível 2 alcançado!',
    message: 'Parabéns! Seu nível subiu. Novos benefícios disponíveis.',
    category: 'account' as NotificationCategory,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true,
    actionType: 'navigate',
    actionPayload: { screen: 'Home', params: { showJourney: true } },
    priority: 'high' as NotificationPriority,
  },
];

// Função para gerar novas notificações mockadas
export function generateMockNotification(
  category: NotificationCategory,
  overrides?: Partial<Notification>
): Notification {
  const templates: Record<NotificationCategory, { title: string; message: string; priority: NotificationPriority }[]> = {
    live: [
      { title: 'Jogo começando', message: 'Um dos seus favoritos está prestes a começar.', priority: 'medium' },
      { title: 'Gol!', message: 'Aconteceu um gol no jogo que você acompanha.', priority: 'high' },
    ],
    missions: [
      { title: 'Missão concluída!', message: 'Você completou uma missão e ganhou XP.', priority: 'high' },
      { title: 'Nova missão', message: 'Uma nova missão está disponível para você.', priority: 'medium' },
    ],
    suggestions: [
      { title: 'Dica do dia', message: 'Confira esta oportunidade especial para hoje.', priority: 'low' },
      { title: 'Odds aumentadas', message: 'Aproveite odds especiais por tempo limitado.', priority: 'medium' },
    ],
    account: [
      { title: 'Atualização de conta', message: 'Seus dados foram atualizados com sucesso.', priority: 'low' },
      { title: 'Bônus creditado', message: 'Um bônus foi adicionado à sua conta.', priority: 'high' },
    ],
  };

  const template = templates[category][Math.floor(Math.random() * templates[category].length)];
  const id = `${category}-${Date.now()}`;

  return {
    id,
    title: template.title,
    message: template.message,
    category,
    createdAt: new Date().toISOString(),
    isRead: false,
    actionType: 'navigate',
    actionPayload: { screen: 'Home' },
    priority: template.priority,
    ...overrides,
  };
}
