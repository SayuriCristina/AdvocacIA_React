import { useEffect, useState, type ChangeEvent, type KeyboardEvent, type FormEvent } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type Usuario from '@/models/usuario';
import { postUsuario } from '@/services/auth.service';
import { ToastAlert } from '@/components/feedback/ToastAlert';

type FormErrors = Partial<Record<keyof Usuario | 'confirmSenha', string>>;

function Register() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<Usuario>({
        id: 0,
        nome: '',
        usuario: '',
        senha: '',
        pontos: 0,
    });

    const [showSenha, setShowSenha] = useState(false);
    const [confirmSenha, setConfirmSenha] = useState('');
    const [showConfirmSenha, setShowConfirmSenha] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (usuario.id !== 0) {
            navigate('/');
        }
    }, [usuario.id, navigate]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'confirmSenha') {
            setConfirmSenha(value);
        } else {
            setUsuario((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!usuario.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        }

        if (!usuario.usuario.trim()) {
            newErrors.usuario = 'E-mail é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(usuario.usuario)) {
            newErrors.usuario = 'E-mail inválido';
        }

        if (!usuario.senha) {
            newErrors.senha = 'Senha é obrigatória';
        } else if (usuario.senha.length < 8) {
            newErrors.senha = 'Senha deve ter no mínimo 8 caracteres';
        }

        if (!confirmSenha) {
            newErrors.confirmSenha = 'Confirmação de senha é obrigatória';
        } else if (usuario.senha !== confirmSenha) {
            newErrors.confirmSenha = 'As senhas não coincidem';
        }

        return newErrors;
    };


    const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();

        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            try {
                await postUsuario('/usuarios/cadastrar', usuario, setUsuario);
                ToastAlert('Usuário cadastrado com sucesso!', 'sucesso');
            } catch {
                ToastAlert('Erro ao cadastrar o usuário!', 'erro');
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSubmit();
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
                                Criar Conta
                            </h1>
                            <p className="text-steel font-sans text-sm">Junte-se à comunidade de estudantes</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Nome */}
                            <div>
                                <label htmlFor="nome" className="block text-xs font-mono text-gold uppercase tracking-widest mb-2">
                                    Nome Completo
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gold" />
                                    </div>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        value={usuario.nome}
                                        onChange={handleChange}
                                        onKeyPress={handleKeyPress}
                                        className={`block w-full pl-10 pr-4 py-3 bg-navy-900/50 border font-sans transition-colors duration-200 ${
                                            errors.nome
                                                ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/5'
                                                : 'border-navy-700 hover:border-navy-600 focus:border-gold focus:bg-gold/5'
                                        } text-white placeholder-steel focus:outline-none`}
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                                {errors.nome && <p className="mt-1 text-xs text-red-400">{errors.nome}</p>}
                            </div>

                            {/* E-mail */}
                            <div>
                                <label htmlFor="usuario" className="block text-xs font-mono text-gold uppercase tracking-widest mb-2">
                                    E-mail
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gold" />
                                    </div>
                                    <input
                                        type="email"
                                        id="usuario"
                                        name="usuario"
                                        value={usuario.usuario}
                                        onChange={handleChange}
                                        onKeyPress={handleKeyPress}
                                        className={`block w-full pl-10 pr-4 py-3 bg-navy-900/50 border font-sans transition-colors duration-200 ${
                                            errors.usuario
                                                ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/5'
                                                : 'border-navy-700 hover:border-navy-600 focus:border-gold focus:bg-gold/5'
                                        } text-white placeholder-steel focus:outline-none`}
                                        placeholder="seu@email.com"
                                    />
                                </div>
                                {errors.usuario && <p className="mt-1 text-xs text-red-400">{errors.usuario}</p>}
                            </div>

                            {/* Linha separadora */}
                            <div className="h-px bg-gradient-to-r from-transparent via-navy-700 to-transparent my-2" />

                            {/* Senha */}
                            <div>
                                <label htmlFor="senha" className="block text-xs font-mono text-gold uppercase tracking-widest mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gold" />
                                    </div>
                                    <input
                                        type={showSenha ? 'text' : 'password'}
                                        id="senha"
                                        name="senha"
                                        value={usuario.senha}
                                        onChange={handleChange}
                                        onKeyPress={handleKeyPress}
                                        className={`block w-full pl-10 pr-10 py-3 bg-navy-900/50 border font-sans transition-colors duration-200 ${
                                            errors.senha
                                                ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/5'
                                                : 'border-navy-700 hover:border-navy-600 focus:border-gold focus:bg-gold/5'
                                        } text-white placeholder-steel focus:outline-none`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSenha((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-steel hover:text-gold transition-colors"
                                    >
                                        {showSenha ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.senha && <p className="mt-1 text-xs text-red-400">{errors.senha}</p>}
                            </div>

                            {/* Confirmar Senha */}
                            <div>
                                <label htmlFor="confirmSenha" className="block text-xs font-mono text-gold uppercase tracking-widest mb-2">
                                    Confirmar Senha
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gold" />
                                    </div>
                                    <input
                                        type={showConfirmSenha ? 'text' : 'password'}
                                        id="confirmSenha"
                                        name="confirmSenha"
                                        value={confirmSenha}
                                        onChange={handleChange}
                                        onKeyPress={handleKeyPress}
                                        className={`block w-full pl-10 pr-10 py-3 bg-navy-900/50 border font-sans transition-colors duration-200 ${
                                            errors.confirmSenha
                                                ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/5'
                                                : 'border-navy-700 hover:border-navy-600 focus:border-gold focus:bg-gold/5'
                                        } text-white placeholder-steel focus:outline-none`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmSenha((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-steel hover:text-gold transition-colors"
                                    >
                                        {showConfirmSenha ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmSenha && <p className="mt-1 text-xs text-red-400">{errors.confirmSenha}</p>}
                            </div>

                            {/* Botão Criar Conta */}
                            <button
                                type="submit"
                                className="w-full group relative px-8 py-3 bg-transparent border border-gold text-gold font-mono text-sm uppercase tracking-wider font-medium overflow-hidden mt-6 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(201,168,76,0.4)]"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-navy-950 transition-colors">
                                    Criar Conta
                                    <span className="text-lg leading-none">→</span>
                                </span>
                                <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                                <span className="absolute inset-0 flex items-center justify-center text-navy-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono text-sm uppercase tracking-wider gap-2">
                                    Criar Conta
                                    <span className="text-lg leading-none">→</span>
                                </span>
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-navy-700 text-center">
                            <p className="text-sm text-steel font-sans">
                                Já tem uma conta?{' '}
                                <Link to='/login' className="text-gold font-medium hover:text-gold-light transition-colors">
                                    Fazer login
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

export default Register;
