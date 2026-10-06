import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { User, Lock, Image, Type, FileText, Upload } from "lucide-react";
import logo from "figma:asset/2560e76fddd46bdbab71e80153b9d81fc9b7d5e8.png";

export function CreateProfile() {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    profileImage: "",
    coverImage: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.username.length < 3) {
      setError("O nome de usuário deve ter pelo menos 3 caracteres");
      return;
    }

    if (formData.password.length < 4) {
      setError("A senha deve ter pelo menos 4 caracteres");
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(formData.username, formData.password, {
        name: profileData.name || formData.username,
        bio: profileData.bio,
        profileImage: profileData.profileImage,
        coverImage: profileData.coverImage,
      });
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar perfil");
      setStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-orange-500 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logo} alt="TOONFRAME" className="w-full max-w-md mx-auto h-auto mb-4" />
          <p className="text-white font-black text-xl">CRIAR NOVA CONTA</p>
        </div>

        {/* Indicador de etapas */}
        <div className="flex justify-center gap-4 mb-8">
          <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-black ${step >= 1 ? "bg-yellow-400 border-black text-black" : "bg-white/20 border-white text-white"}`}>
            1
          </div>
          <div className="flex items-center">
            <div className={`w-20 h-1 ${step >= 2 ? "bg-yellow-400" : "bg-white/30"}`}></div>
          </div>
          <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-black ${step >= 2 ? "bg-yellow-400 border-black text-black" : "bg-white/20 border-white text-white"}`}>
            2
          </div>
        </div>

        {/* Card do formulário */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          {step === 1 ? (
            <form onSubmit={handleStep1Submit}>
              <h2 className="text-3xl font-black mb-6 text-center">CREDENCIAIS DE ACESSO</h2>
              
              {error && (
                <div className="bg-red-500 text-white p-4 mb-6 border-4 border-black font-black text-center">
                  {error}
                </div>
              )}

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
                  <p className="text-xs text-gray-600 mt-1">
                    Este será seu nome de login (mínimo 3 caracteres)
                  </p>
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
                  <p className="text-xs text-gray-600 mt-1">
                    Mínimo 4 caracteres
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block font-black mb-2 text-sm">
                    CONFIRMAR SENHA
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 border-4 border-black focus:outline-none focus:border-blue-500 font-black"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex-1 bg-gray-300 text-black px-6 py-4 font-black hover:bg-gray-400 transition-colors border-4 border-black"
                >
                  VOLTAR
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white px-6 py-4 font-black hover:bg-blue-600 transition-colors border-4 border-black"
                >
                  PRÓXIMO
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleFinalSubmit}>
              <h2 className="text-3xl font-black mb-6 text-center">INFORMAÇÕES DO PERFIL</h2>
              
              <p className="text-center text-gray-600 mb-6">
                Personalize seu perfil (você poderá editar depois)
              </p>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block font-black mb-2 text-sm">
                    NOME DE EXIBIÇÃO (OPCIONAL)
                  </label>
                  <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      placeholder={formData.username}
                      className="w-full pl-12 pr-4 py-4 border-4 border-black focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block font-black mb-2 text-sm">
                    BIO (OPCIONAL)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      placeholder="Conte um pouco sobre você..."
                      rows={3}
                      className="w-full pl-12 pr-4 py-4 border-4 border-black focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* Profile Image URL */}
                <div>
                  <label className="block font-black mb-2 text-sm">
                    URL DA FOTO DE PERFIL (OPCIONAL)
                  </label>
                  <div className="relative">
                    <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="profileImage"
                      value={profileData.profileImage}
                      onChange={handleProfileChange}
                      placeholder="https://..."
                      className="w-full pl-12 pr-4 py-4 border-4 border-black focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Cover Image URL */}
                <div>
                  <label className="block font-black mb-2 text-sm">
                    URL DA CAPA (OPCIONAL)
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="coverImage"
                      value={profileData.coverImage}
                      onChange={handleProfileChange}
                      placeholder="https://..."
                      className="w-full pl-12 pr-4 py-4 border-4 border-black focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-400 border-4 border-black p-4 mt-6">
                <p className="text-xs font-black text-center">
                  💡 DICA: Você poderá personalizar completamente seu perfil depois de criá-lo!
                </p>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-300 text-black px-6 py-4 font-black hover:bg-gray-400 transition-colors border-4 border-black"
                >
                  VOLTAR
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-yellow-400 text-black px-6 py-4 font-black hover:bg-yellow-300 transition-colors border-4 border-black"
                >
                  CRIAR PERFIL
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Link para voltar */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-white font-black hover:underline"
          >
            ← VOLTAR PARA LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}