import { Link } from "react-router";
import { AlertCircle, Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-white dark:bg-neutral-900 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8 relative">
          <div className="text-[200px] font-black leading-none text-black dark:text-neutral-100 opacity-10">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertCircle className="w-32 h-32 text-orange-500" />
          </div>
        </div>
        <h1 className="text-5xl font-black mb-4">PÁGINA NÃO ENCONTRADA</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Ops! Parece que este quadro está faltando em nossa coleção.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-black dark:bg-neutral-100 dark:text-black text-white px-8 py-4 font-black hover:bg-gray-800 dark:hover:bg-neutral-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            VOLTAR AO INÍCIO
          </Link>
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 bg-blue-500 dark:bg-blue-600 text-white px-8 py-4 font-black hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            VER CRÍTICAS
          </Link>
        </div>
      </div>
    </div>
  );
}