import { AuthContext } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastAlert } from "../feedback/ToastAlert";

function Navbar() {
    const navigate = useNavigate();
    const { usuario, handleLogout } = useContext(AuthContext);
    const [scrolled, setScrolled] = useState(false);

    function logout() {
        handleLogout();
        ToastAlert('O usuário foi desconectado.', 'info');
        navigate('/');
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 font-sans
            ${scrolled
                ? 'bg-navy-950 border-b border-gold/20 shadow-[0_4px_40px_rgba(0,0,0,0.4)]'
                : 'bg-gradient-to-b from-navy-950 to-navy-950/90'
            }`}
        >
            {/* Linha dourada no topo */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/">
                        <div className="flex flex-col gap-[2px]">
                            <span className="font-title font-bold text-[1.3rem] tracking-[0.18em] uppercase text-gold leading-none">
                                Advocac<span className="text-gold-light italic">IA</span>
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-2">
                        {usuario.token ? (
                            <>
                                <Link
                                    to="/perfil"
                                    className="group relative flex items-center gap-[0.4rem]
                                        px-[1.1rem] py-2 text-[0.68rem] font-medium tracking-[0.2em]
                                        uppercase text-silver hover:text-gold transition-colors duration-300"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Perfil</span>
                                    <span className="absolute bottom-0 left-[1.1rem] right-[1.1rem] h-[1px]
                                        bg-gold scale-x-0 origin-left
                                        transition-transform duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                                        group-hover:scale-x-100" />
                                </Link>

                                <div className="w-px h-5 bg-gradient-to-b from-transparent via-navy-700 to-transparent mx-1" />

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-[0.4rem] px-[1.1rem] py-2
                                        text-[0.68rem] font-medium tracking-[0.2em] uppercase
                                        text-steel hover:text-red-400 transition-colors duration-300"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sair</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="group relative flex items-center
                                        px-[1.1rem] py-2 text-[0.68rem] font-medium tracking-[0.2em]
                                        uppercase text-silver hover:text-gold transition-colors duration-300"
                                >
                                    <span>Entrar</span>
                                    <span className="absolute bottom-0 left-[1.1rem] right-[1.1rem] h-[1px]
                                        bg-gold scale-x-0 origin-left
                                        transition-transform duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                                        group-hover:scale-x-100" />
                                </Link>

                                <div className="w-px h-5 bg-gradient-to-b from-transparent via-navy-700 to-transparent mx-2" />

                                <Link
                                    to="/register"
                                    className="[clip-path:var(--clip-chamfer)] inline-flex items-center
                                        px-6 py-[0.55rem] text-[0.66rem] font-medium tracking-[0.22em]
                                        uppercase text-navy-950
                                        bg-gradient-to-r from-gold via-gold-light to-gold bg-[length:200%_auto]
                                        hover:bg-right
                                        hover:shadow-[0_4px_20px_rgba(201,168,76,0.4)]
                                        transition-all duration-300"
                                >
                                    Criar Conta
                                </Link>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;