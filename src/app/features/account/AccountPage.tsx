import { mockUser, mockTransactions, mockNotifications } from '@/app/data/mocks/user';
import { useUserStore } from '@/app/state/userStore';
import { cn } from '@/lib/utils';
import { User, Wallet, Bell, Settings, Shield, HelpCircle, Moon, LogOut, ChevronRight } from 'lucide-react';

export default function AccountPage() {
  const { experienceMode, setExperienceMode } = useUserStore();

  const menuGroups = [
    {
      title: 'Financeiro',
      items: [
        { icon: Wallet, label: 'Carteira', subtitle: `R$${mockUser.balance.toFixed(2)}`, action: '#' },
        { icon: Wallet, label: 'Depositar', subtitle: 'PIX, Cartão', action: '#' },
        { icon: Wallet, label: 'Sacar', subtitle: '', action: '#' },
      ],
    },
    {
      title: 'Preferências',
      items: [
        { icon: Settings, label: 'Configurações', subtitle: '', action: '#' },
        { icon: Bell, label: 'Notificações', subtitle: `${mockNotifications.filter(n => !n.isRead).length} não lidas`, action: '#' },
        { icon: Moon, label: 'Modo de Experiência', subtitle: experienceMode === 'pro' ? 'Pro' : 'Iniciante', action: 'toggle-mode' },
      ],
    },
    {
      title: 'Segurança & Suporte',
      items: [
        { icon: Shield, label: 'Segurança', subtitle: '', action: '#' },
        { icon: HelpCircle, label: 'Ajuda & Suporte', subtitle: '', action: '#' },
      ],
    },
  ];

  return (
    <div className="space-y-6 py-4">
      {/* Profile Header */}
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

      {/* Balance Card */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-primary/15 to-card border border-primary/20 rounded-2xl p-4">
          <div className="text-xs text-muted-foreground mb-1">Saldo Disponível</div>
          <div className="text-2xl font-display font-bold tabular-nums">R${mockUser.balance.toFixed(2)}</div>
          {mockUser.bonusBalance > 0 && (
            <div className="text-xs text-primary mt-1">+ R${mockUser.bonusBalance.toFixed(2)} em bônus</div>
          )}
          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-semibold">Depositar</button>
            <button className="flex-1 bg-secondary text-foreground rounded-lg py-2 text-sm font-semibold border border-border/50">Sacar</button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4">
        <h2 className="text-sm font-display font-bold mb-2">Transações Recentes</h2>
        <div className="space-y-1">
          {mockTransactions.slice(0, 3).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div>
                <div className="text-sm font-medium">{tx.description}</div>
                <div className="text-[10px] text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString('pt-BR')}</div>
              </div>
              <span className={cn('text-sm font-semibold tabular-nums', tx.amount > 0 ? 'text-success' : 'text-foreground')}>
                {tx.amount > 0 ? '+' : ''}R${Math.abs(tx.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Groups */}
      {menuGroups.map((group) => (
        <div key={group.title} className="px-4">
          <h2 className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{group.title}</h2>
          <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
            {group.items.map((item, i) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.action === 'toggle-mode') {
                    setExperienceMode(experienceMode === 'pro' ? 'beginner' : 'pro');
                  }
                }}
                className={cn('flex items-center gap-3 w-full px-3 py-3 hover:bg-secondary/50 transition-colors', i > 0 && 'border-t border-border/30')}
              >
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.subtitle && <span className="text-xs text-muted-foreground">{item.subtitle}</span>}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <div className="px-4 pb-4">
        <button className="flex items-center gap-2 w-full justify-center py-3 text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
          <LogOut className="w-4 h-4" /> Sair da Conta
        </button>
      </div>
    </div>
  );
}
