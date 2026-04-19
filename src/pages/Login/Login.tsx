import {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Mail, EyeOff, Eye, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import type UsuarioLogin from "@/models/usuarioLogin";

interface FormErrors {
  usuario?: string;
  senha?: string;
}

function Login() {
  const navigate = useNavigate();
  const { usuario, handleLogin } = useContext(AuthContext);

  const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin>(
    {} as UsuarioLogin,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (usuario.token) {
      navigate("/home");
    }
  }, [usuario.token, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuarioLogin((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!usuarioLogin.usuario?.trim()) {
      newErrors.usuario = "E-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(usuarioLogin.usuario)) {
      newErrors.usuario = "E-mail inválido";
    }

    if (!usuarioLogin.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (usuarioLogin.senha.length < 6) {
      newErrors.senha = "Senha deve ter no mínimo 6 caracteres";
    }

    return newErrors;
  };

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      handleLogin(usuarioLogin);
    } else {
      setErrors(newErrors);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <>
      <div className="flex flex-col grow bg-navy-950 items-center justify-center min-h-screen px-4 py-12 pt-20">
        {/* Container com decorações */}
        <div className="relative w-full max-w-md">
          {/* Linha dourada superior */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent" />

          {/* Card Principal */}
          <div className="relative bg-navy-800/50 backdrop-blur-sm border-2 border-navy-700 p-8 mt-4">
            {/* Cantos decorativos */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold/30 -translate-x-1 -translate-y-1" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold/30 translate-x-1 -translate-y-1" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold/30 -translate-x-1 translate-y-1" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold/30 translate-x-1 translate-y-1" />

            {/* Header */}
            <div className="text-center mb-8 pb-6 border-b border-navy-700">
              <h1 className="text-3xl font-bold text-white mb-2 font-title">
                Bem-vindo de volta
              </h1>
              <p className="text-steel font-sans text-sm">
                Entre com suas credenciais
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* E-mail */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-mono text-gold uppercase tracking-widest mb-2"
                >
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gold" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="usuario"
                    value={usuarioLogin.usuario || ""}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className={`block w-full pl-10 pr-4 py-3 bg-navy-900/50 border font-sans transition-colors duration-200 ${
                      errors.usuario
                        ? "border-red-500/50 focus:border-red-500 focus:bg-red-500/5"
                        : "border-navy-700 hover:border-navy-600 focus:border-gold focus:bg-gold/5"
                    } text-white placeholder-steel focus:outline-none`}
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.usuario && (
                  <p className="mt-1 text-xs text-red-400">{errors.usuario}</p>
                )}
              </div>

              {/* Senha */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-mono text-gold uppercase tracking-widest mb-2"
                >
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gold" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="senha"
                    value={usuarioLogin.senha || ""}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className={`block w-full pl-10 pr-10 py-3 bg-navy-900/50 border font-sans transition-colors duration-200 ${
                      errors.senha
                        ? "border-red-500/50 focus:border-red-500 focus:bg-red-500/5"
                        : "border-navy-700 hover:border-navy-600 focus:border-gold focus:bg-gold/5"
                    } text-white placeholder-steel focus:outline-none`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-steel hover:text-gold transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.senha && (
                  <p className="mt-1 text-xs text-red-400">{errors.senha}</p>
                )}
              </div>

              {/* Esqueci minha senha */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-gold hover:text-gold-light font-mono uppercase tracking-widest transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                className="w-full group relative px-8 py-3 bg-transparent border border-gold text-gold font-mono text-sm uppercase tracking-wider font-medium overflow-hidden mt-6 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(201,168,76,0.4)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-navy-950 transition-colors">
                  Entrar
                  <span className="text-lg leading-none">→</span>
                </span>
                <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                <span className="absolute inset-0 flex items-center justify-center text-navy-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono text-sm uppercase tracking-wider gap-2">
                  Entrar
                  <span className="text-lg leading-none">→</span>
                </span>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-navy-700 text-center">
              <p className="text-sm text-steel font-sans">
                Não tem uma conta?{" "}
                <Link
                  to="/register"
                  className="text-gold font-medium hover:text-gold-light transition-colors"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </div>

          {/* Linha dourada inferior */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent -mb-4" />
        </div>
      </div>
    </>
  );
}

export default Login;
