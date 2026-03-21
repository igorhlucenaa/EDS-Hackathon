import { mockUser, mockTransactions, mockNotifications } from '@/app/data/mocks/user';
import { useUserStore } from '@/app/state/userStore';
import { useAuthStore } from '@/app/state/authStore';
import { cn } from '@/lib/utils';
import { User, Wallet, Bell, Settings, Shield, HelpCircle, Moon, LogOut, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AccountPage() {
  const navigate = useNavigate();
  const { experienceMode, setExperienceMode } = useUserStore();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  const menuGroups = [
    {
      title: 'Financeiro',
      items: [
        { icon: Wallet, label: 'Carteira', subtitle: `R$${mockUser.balance.toFixed(2)}`, path: '/wallet' },
        { icon: Wallet, label: 'Depositar', subtitle: 'PIX, Cartão', path: '/wallet/deposit' },
        { icon: Wallet, label: 'Sacar', subtitle: 'PIX', path: '/wallet/withdraw' },
      ],
    },
    {
      title: 'Apostas & favoritos',
      items: [
        { icon: Bell, label: 'Notificações', subtitle: `${mockNotifications.filter((n) => !n.isRead).length} não lidas`, path: '/notifications' },
        { icon: Star, label: 'Favoritos', subtitle: 'Times e ligas', path: '/favorites' },
      ],
    },
    {
      title: 'Preferências',
      items: [
        { icon: Settings, label: 'Configurações', subtitle: 'Alertas e exibição', path: '/account/preferences' },
        { icon: Moon, label: 'Modo de Experiência', subtitle: experienceMode === 'pro' ? 'Pro' : 'Iniciante', path: '/account/preferences' },
      ],
    },
    {
      title: 'Segurança & Suporte',
      items: [
        { icon: Shield, label: 'Segurança', subtitle: 'Senha e dispositivos', path: '/help' },
        { icon: HelpCircle, label: 'Ajuda & Suporte', subtitle: 'FAQ e chat', path: '/help' },
      ],
    },
  ];

  return (
    <div className="space-y-6 py-4">
      <div className="px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold">{mockUser.name}</h1>
            <p className="text-xs text-muted-foreground">{mockUser.email}</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <button
          type="button"
          onClick={() => navigate('/wallet')}
          className="w-full text-left bg-gradient-to-r from-primary/15 to-card border border-primary/20 rounded-2xl p-4"
        >
          <div className="text-xs text-muted-foreground mb-1">Saldo Disponível</div>
          <div className="text-2xl font-display font-bold tabular-nums">R${mockUser.balance.toFixed(2)}</div>
          {mockUser.bonusBalance > 0 && (
            <div className="text-xs text-primary mt-1">+ R${mockUser.bonusBalance.toFixed(2)} em bônus</div>
          )}
          <div className="flex gap-2 mt-3">
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/wallet/deposit');
              }}
              className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-semibold text-center"
            >
              Depositar
            </span>
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/wallet/withdraw');
              }}
              className="flex-1 bg-secondary text-foreground rounded-lg py-2 text-sm font-semibold border border-border/50 text-center"
            >
              Sacar
            </span>
          </div>
        </button>
      </div>

      <div className="px-4">
        <h2 className="text-sm font-display font-bold mb-2">Transações Recentes</h2>
        <div className="space-y-1">
          {mockTransactions.slice(0, 3).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div>
                <div className="text-sm font-medium">{tx.description}</div>
                <div className="text-[10px] text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString('pt-BR')}</div>
              </div>
              <span className={cn('text-sm font-semibold tabular-nums', tx.amount > 0 ? 'text-primary' : 'text-foreground')}>
                {tx.amount > 0 ? '+' : ''}R${Math.abs(tx.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigate('/wallet')}
          className="text-xs text-primary font-medium mt-2 hover:underline"
        >
          Ver extrato completo
        </button>
      </div>

      {menuGroups.map((group) => (
        <div key={group.title} className="px-4">
          <h2 className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{group.title}</h2>
          <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
            {group.items.map((item, i) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if ('path' in item && item.path) navigate(item.path);
                }}
                className={cn('flex items-center gap-3 w-full px-3 py-3 hover:bg-secondary/50 transition-colors', i > 0 && 'border-t border-border/30')}
              >
                <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.subtitle && <span className="text-xs text-muted-foreground shrink-0">{item.subtitle}</span>}
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="px-4 pb-4 space-y-2">
        <button
          type="button"
          onClick={() => {
            setExperienceMode(experienceMode === 'pro' ? 'beginner' : 'pro');
          }}
          className="flex items-center justify-center gap-2 w-full py-3 text-sm border border-border/50 rounded-xl hover:bg-secondary/50"
        >
          <Moon className="w-4 h-4" />
          Alternar modo {experienceMode === 'pro' ? 'Iniciante' : 'Pro'}
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthenticated(false);
            navigate('/auth/login');
          }}
          className="flex items-center gap-2 w-full justify-center py-3 text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sair da Conta
        </button>
      </div>
    </div>
  );
}
