import { Link } from "react-router";

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
        Bem-vindo à <span className="text-blue-600">SuaPousada</span>
      </h1>
      <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10">
        O lugar perfeito para relaxar e aproveitar momentos inesquecíveis. 
        Faça seu agendamento agora mesmo e garanta sua estadia!
      </p>
      <div className="flex gap-4">
        <Link 
          to="/login" 
          className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
        >
          Fazer Login / Agendar
        </Link>
      </div>
    </div>
  );
}