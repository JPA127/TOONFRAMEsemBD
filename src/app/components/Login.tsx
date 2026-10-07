import image_1ba80251e8ea2c34fff3d0d20e4e25d0ab65c1fa from 'figma:asset/1ba80251e8ea2c34fff3d0d20e4e25d0ab65c1fa.png'
import { Star, MessageCircle, TrendingUp, Users, Film, Award, User, Lock, X } from "lucide-react";
import { useNavigate } from "react-router";
import logo from "figma:asset/2560e76fddd46bdbab71e80153b9d81fc9b7d5e8.png";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    try {
      const success = await login(formData.username, formData.password);

      if (success) {
        navigate("/home");
      } else {
        setError("Nome de usuário ou senha incorretos");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login";
      setError(errorMessage);
    }
  };

  const handleShowLogin = () => {
    setShowLoginForm(true);
  };

  const handleCreateAccount = () => {
    navigate("/create-profile");
  };

  const benefits = [
    {
      icon: Star,
      title: "Avalie & Critique",
      description: "Compartilhe suas opiniões sobre animações e construa sua reputação como crítico",
      color: "yellow",
    },
    {
      icon: MessageCircle,
      title: "Conecte-se",
      description: "Encontre amigos com gostos similares e discuta suas animações favoritas",
      color: "blue",
    },
    {
      icon: TrendingUp,
      title: "Descubra Novidades",
      description: "Fique por dentro das últimas notícias e lançamentos do mundo da animação",
      color: "orange",
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Junte-se a milhares de fãs apaixonados por animação",
      color: "blue",
    },
    {
      icon: Film,
      title: "Biblioteca Completa",
      description: "Acesse críticas de milhares de animações, filmes e séries",
      color: "yellow",
    },
    {
      icon: Award,
      title: "Reconhecimento",
      description: "Ganhe badges e reconhecimento por suas contribuições à comunidade",
      color: "orange",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-orange-600/20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Logo/Title */}
          <div className="mb-8">
            <img 
              src={image_1ba80251e8ea2c34fff3d0d20e4e25d0ab65c1fa} 
              alt="TOONFRAME" 
              className="w-full max-w-2xl mx-auto h-auto mb-4"
            />
            <div className="flex items-center justify-center gap-2 text-xl">
              <div className="w-12 h-1 bg-blue-500"></div>
              <p className="font-black text-gray-300">SUA COMUNIDADE DE ANIMAÇÃO</p>
              <div className="w-12 h-1 bg-orange-500"></div>
            </div>
          </div>

          {/* Main Tagline */}
          <p className="text-2xl sm:text-3xl font-black text-gray-200 mb-12 max-w-3xl mx-auto leading-tight">
            CRITIQUE, DESCUBRA E CONECTE-SE COM FÃNS DE ANIMAÇÃO DO MUNDO TODO
          </p>

          {/* CTA Button - Main Focus */}
          <div className="mb-8">
            <button
              onClick={handleShowLogin}
              className="inline-block bg-yellow-400 text-black px-16 py-6 font-black text-2xl hover:bg-yellow-300 transition-all hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] border-4 border-black"
            >
              ENTRAR AGORA
            </button>
          </div>

          <p className="text-gray-400 text-sm font-black">
            É rápido, grátis e você não vai precisar de cartão de crédito
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-orange-500"></div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">POR QUE O TOONFRAME?</h2>
            <p className="text-xl text-gray-600 font-black">
              Tudo que você precisa para mergulhar no universo da animação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const colorClasses = {
                blue: "bg-blue-500",
                yellow: "bg-yellow-400",
                orange: "bg-orange-500",
              };

              return (
                <div
                  key={index}
                  className={`bg-white border-4 border-black p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group`}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${colorClasses[benefit.color as keyof typeof colorClasses]} border-4 border-black mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="border-4 border-white p-8">
              <div className="text-5xl font-black text-yellow-400 mb-2">50K+</div>
              <p className="text-xl font-black">MEMBROS ATIVOS</p>
            </div>
            <div className="border-4 border-white p-8">
              <div className="text-5xl font-black text-blue-400 mb-2">10K+</div>
              <p className="text-xl font-black">CRÍTICAS PUBLICADAS</p>
            </div>
            <div className="border-4 border-white p-8">
              <div className="text-5xl font-black text-orange-400 mb-2">5K+</div>
              <p className="text-xl font-black">ANIMAÇÕES CATALOGADAS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500 via-purple-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
            PRONTO PARA COMEÇAR SUA JORNADA?
          </h2>
          <p className="text-xl mb-10 font-black text-white/90">
            Junte-se a nós e faça parte da maior comunidade de animação do Brasil
          </p>
          <button
            onClick={handleCreateAccount}
            className="inline-block bg-white text-black px-16 py-6 font-black text-2xl hover:bg-yellow-400 transition-all hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.3)] border-4 border-black"
          >
            CRIAR CONTA GRÁTIS
          </button>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-8 bg-black text-center">
        <p className="text-gray-400 text-sm">
          Já tem uma conta?{" "}
          <button onClick={handleShowLogin} className="text-yellow-400 font-black hover:underline">
            Entrar aqui
          </button>
        </p>
      </section>

      {/* Login Modal */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md relative">
            {/* Close button */}
            <button
              onClick={() => setShowLoginForm(false)}
              className="absolute -top-2 -right-2 bg-red-500 text-white w-10 h-10 flex items-center justify-center border-4 border-black hover:bg-red-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              <h2 className="text-3xl font-black mb-6 text-center">ENTRAR</h2>

              {error && (
                <div className="bg-red-500 text-white p-4 mb-6 border-4 border-black font-black text-center text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit}>
                <div className="space-y-6">
                  {/* Username */}
                  <div>
                    <label className="block font-black mb-2 text-sm">
                      NOME DE USUÁRIO
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="seunome"
                        className="w-full pl-12 pr-4 py-4 border-4 border-black focus:outline-none focus:border-blue-500 font-black"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block font-black mb-2 text-sm">
                      SENHA
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 border-4 border-black focus:outline-none focus:border-blue-500 font-black"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-black px-6 py-4 font-black text-xl hover:bg-yellow-300 transition-colors border-4 border-black mt-6"
                >
                  ENTRAR
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <button
                    onClick={handleCreateAccount}
                    className="text-blue-500 font-black hover:underline"
                  >
                    Criar agora
                  </button>
                </p>
              </div>

              {/* Helper text */}
              <div className="mt-6 bg-yellow-50 border-4 border-yellow-400 p-4">
                <p className="text-xs font-black text-yellow-900 text-center">
                  💡 Não tem uma conta? Clique em "Criar agora" abaixo para se registrar gratuitamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}