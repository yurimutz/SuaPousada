import { Link, useNavigate } from "react-router";

export function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent, role: 'admin' | 'cliente') => {
    e.preventDefault();
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/cliente');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md space-y-8 bg-card p-10 rounded-xl shadow-lg border border-border">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Acesse sua conta</h2>
          <p className="mt-2 text-sm text-muted-foreground">Para clientes e administradores</p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Endereço de Email</label>
              <input 
                id="email-address" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                className="relative block w-full rounded-t-md border-0 py-2.5 px-3 text-foreground ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-background" 
                placeholder="Endereço de Email" 
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="current-password" 
                required 
                className="relative block w-full rounded-b-md border-0 py-2.5 px-3 text-foreground ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-background" 
                placeholder="Senha" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={(e) => handleLogin(e, 'cliente')}
              className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Entrar como Cliente
            </button>
            <button 
              onClick={(e) => handleLogin(e, 'admin')}
              className="group relative flex w-full justify-center rounded-md bg-secondary px-3 py-2.5 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            >
              Entrar como Administrador
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          Ainda não tem conta? <Link to="/register" className="font-semibold leading-6 text-primary hover:text-primary/90">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
