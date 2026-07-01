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
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Acesse sua conta</h2>
          <p className="mt-2 text-sm text-slate-600">Para clientes e administradores</p>
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
                className="relative block w-full rounded-t-md border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" 
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
                className="relative block w-full rounded-b-md border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" 
                placeholder="Senha" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={(e) => handleLogin(e, 'cliente')}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Entrar como Cliente
            </button>
            <button 
              onClick={(e) => handleLogin(e, 'admin')}
              className="group relative flex w-full justify-center rounded-md bg-slate-800 px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
            >
              Entrar como Administrador
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm text-slate-500 mt-4">
          Ainda não tem conta? <Link to="/register" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
