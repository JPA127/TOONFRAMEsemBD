import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Film, Star, Newspaper, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../../assets/toonframe-logo.png";

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, currentProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirecionar para login se não estiver logado
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => {
    if (path === "/home") {
      return location.pathname === "/home";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#00000000]">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/home" className="flex items-center group" onClick={() => setMobileMenuOpen(false)}>
              <img
                src={logo}
                alt="TOONFRAME - Críticas e notícias de animação"
                className="h-9 sm:h-12 w-auto"
              />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-1 items-center">
              <Link
                to="/home"
                className={`flex items-center gap-2 px-6 py-3 transition-colors ${
                  isActive("/home") && location.pathname === "/home"
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <Film className="w-5 h-5" />
                <span className="font-bold">INÍCIO</span>
              </Link>
              <Link
                to="/reviews"
                className={`flex items-center gap-2 px-6 py-3 transition-colors ${
                  isActive("/reviews")
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <Star className="w-5 h-5" />
                <span className="font-bold">CRÍTICAS</span>
              </Link>
              <Link
                to="/news"
                className={`flex items-center gap-2 px-6 py-3 transition-colors ${
                  isActive("/news")
                    ? "bg-orange-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <Newspaper className="w-5 h-5" />
                <span className="font-bold">NOTÍCIAS</span>
              </Link>
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-6 py-3 transition-colors ${
                  isActive("/profile")
                    ? "bg-yellow-400 text-black"
                    : "hover:bg-gray-100"
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-bold">PERFIL</span>
              </Link>
              
              {/* User Info */}
              <div className="ml-2 px-4 py-2 bg-gray-100 border-2 border-black">
                <p className="text-xs text-gray-600">Logado como</p>
                <p className="font-black text-sm">{currentProfile?.profile.name}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 transition-colors hover:bg-red-50 text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-bold">SAIR</span>
              </button>
            </nav>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden border-t-2 border-black py-2">
              <Link
                to="/home"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isActive("/home") && location.pathname === "/home"
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <Film className="w-5 h-5" />
                <span className="font-bold">INÍCIO</span>
              </Link>
              <Link
                to="/reviews"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isActive("/reviews")
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <Star className="w-5 h-5" />
                <span className="font-bold">CRÍTICAS</span>
              </Link>
              <Link
                to="/news"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isActive("/news")
                    ? "bg-orange-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <Newspaper className="w-5 h-5" />
                <span className="font-bold">NOTÍCIAS</span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isActive("/profile")
                    ? "bg-yellow-400 text-black"
                    : "hover:bg-gray-100"
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-bold">PERFIL</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-bold">SAIR</span>
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-5rem)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Film className="w-8 h-8" />
                <h3 className="text-2xl font-black">TOONFRAME</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Seu destino definitivo para críticas, notícias e insights do mundo da animação.
              </p>
            </div>
            <div>
              <h4 className="font-black mb-4 text-yellow-400">LINKS RÁPIDOS</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-yellow-400 transition-colors">Início</Link></li>
                <li><Link to="/reviews" className="hover:text-blue-400 transition-colors">Críticas</Link></li>
                <li><Link to="/news" className="hover:text-orange-400 transition-colors">Notícias</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 text-blue-400">SOBRE</h4>
              <p className="text-gray-300 text-sm">
                TOONFRAME é dedicado a celebrar a arte da animação em todos os gêneros e estilos.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © 2026 TOONFRAME. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}