import { mockNotifications } from '@/app/data/mocks/user';
import { cn } from '@/lib/utils';
import { ArrowLeft, Bell } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(mockNotifications);

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <div className="space-y-4 py-4 pb-24">
      <div className="px-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-display font-bold">Notificações</h1>
        </div>
      </div>

      <div className="px-4 space-y-2">
        {items.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => {
              markRead(n.id);
              if (n.actionUrl) navigate(n.actionUrl);
            }}
            className={cn(
              'w-full text-left rounded-xl border p-3 transition-colors',
              n.isRead ? 'border-border/40 bg-card/50' : 'border-primary/30 bg-primary/5'
            )}
          >
            <p className="text-sm font-semibold">{n.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {new Date(n.createdAt).toLocaleString('pt-BR')}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
