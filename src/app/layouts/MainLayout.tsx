import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ClipboardList, Home, Receipt, Search, User, Wallet, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import brandLogo from '@/assets/esportes-da-sorte-logo.svg?url';
import { useBetslipStore } from '@/app/state/betslipStore';
import { mockUser, mockNotifications } from '@/app/data/mocks/user';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/live', label: 'Ao Vivo', icon: Zap },
  { path: '/explore', label: 'Explorar', icon: Search },
  { path: '/bets', label: 'Apostas', icon: ClipboardList },
  { path: '/account', label: 'Conta', icon: User },
];

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const selections = useBetslipStore((s) => s.selections);
  const setOpen = useBetslipStore((s) => s.setOpen);
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-dvh-safe bg-background flex flex-col overflow-x-hidden">
      {/* fixed: sticky falha se algum ancestral tiver overflow/transform; garante barra sempre visível */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full max-w-[100vw] glass-surface border-b border-border/50 pt-safe">
        <div className="mx-auto flex h-14 w-full max-w-[100vw] items-center justify-between px-4">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 min-w-0"
              aria-label="Ir para início"
            >
              <img
                src={brandLogo}
                alt="Esportes da Sorte"
                className="h-7 w-auto max-w-[min(100%,220px)] object-contain object-left shrink-0"
                width={220}
                height={76}
              />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Busca"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/wallet')}
              className="bg-secondary rounded-lg px-2 sm:px-3 py-1.5 flex items-center gap-1 sm:gap-1.5 max-w-[120px] sm:max-w-none"
            >
              <Wallet className="w-3.5 h-3.5 text-muted-foreground shrink-0 hidden sm:inline" />
              <span className="text-xs text-muted-foreground hidden sm:inline">R$</span>
              <span className="text-xs sm:text-sm font-semibold tabular-nums truncate">{mockUser.balance.toFixed(2)}</span>
            </button>

            <button
              type="button"
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 rounded-full bg-live-pulse text-[9px] font-bold flex items-center justify-center text-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[100vw] pb-main-with-nav pt-[calc(env(safe-area-inset-top,0px)+3.5rem)]">
        <Outlet />
      </main>

      {selections.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            navigate('/betslip');
          }}
          className="fab-pop-in fixed z-[60] bg-primary text-primary-foreground rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-primary/30 bottom-[calc(6rem+env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`Abrir cupom com ${selections.length} seleção(ões)`}
        >
          <Receipt className="w-5 h-5" aria-hidden />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-live-pulse text-[10px] font-bold flex items-center justify-center text-foreground">
            {selections.length}
          </span>
        </button>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-[100vw] glass-surface border-t border-border/50 pb-safe">
        <div className="relative flex h-16 w-full items-center justify-around px-safe-min">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
            return (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 py-1 px-2 sm:px-3 rounded-lg transition-colors min-w-[52px] sm:min-w-[56px]',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
                {path === '/live' && (
                  <span className="absolute top-1.5 ml-5 w-1.5 h-1.5 rounded-full bg-live-pulse live-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
