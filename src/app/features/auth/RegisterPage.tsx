import { useAuthStore } from '@/app/state/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuthenticated);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuth(true);
    toast.success('Conta criada (mock)');
    navigate('/onboarding');
  };

  return (
    <div className="min-h-[70vh] flex flex-col px-4 py-8 pb-24">
      <button type="button" onClick={() => navigate(-1)} className="self-start p-2 rounded-lg hover:bg-secondary mb-4">
        <ArrowLeft className="w-4 h-4" />
      </button>
      <h1 className="text-2xl font-display font-bold mb-1">Criar conta</h1>
      <p className="text-sm text-muted-foreground mb-6">Cadastro simplificado (mock).</p>

      <form onSubmit={submit} className="space-y-4 max-w-md w-full mx-auto">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">
          Continuar
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Já tem conta?{' '}
        <Link to="/auth/login" className="text-primary font-semibold">
          Entrar
        </Link>
      </p>
    </div>
  );
}
