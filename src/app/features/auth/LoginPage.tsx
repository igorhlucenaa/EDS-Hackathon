import { useAuthStore } from '@/app/state/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuthenticated);
  const [email, setEmail] = useState('lucas.silva@email.com');
  const [password, setPassword] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuth(true);
    toast.success('Sessão iniciada (mock)');
    navigate('/');
  };

  return (
    <div className="min-h-[70vh] flex flex-col px-4 py-8 pb-24">
      <button type="button" onClick={() => navigate(-1)} className="self-start p-2 rounded-lg hover:bg-secondary mb-4">
        <ArrowLeft className="w-4 h-4" />
      </button>
      <h1 className="text-2xl font-display font-bold mb-1">Entrar</h1>
      <p className="text-sm text-muted-foreground mb-6">Acesse sua conta EDS (fluxo mock).</p>

      <form onSubmit={submit} className="space-y-4 max-w-md w-full mx-auto">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" className="w-full">
          Continuar
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Não tem conta?{' '}
        <Link to="/auth/register" className="text-primary font-semibold">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
