import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Zap, Search, ClipboardList, User, Receipt, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import brandLogo from '@/assets/esportes-da-sorte-logo.svg?url';
import { useBetslipStore } from '@/app/state/betslipStore';
import { mockUser, mockNotifications } from '@/app/data/mocks/user';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';

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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 glass-surface border-b border-border/50">
        <div className="container flex items-center justify-between h-14 px-4">
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

      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      <AnimatePresence>
        {selections.length > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
              setOpen(true);
              navigate('/betslip');
            }}
            className="fixed bottom-24 right-4 z-50 bg-primary text-primary-foreground rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-primary/30"
          >
            <Receipt className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-live-pulse text-[10px] font-bold flex items-center justify-center text-foreground">
              {selections.length}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-surface border-t border-border/50">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto relative">
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
