import { AuthContext } from "@/context/AuthContext";
import { Brain, LogOut, User } from "lucide-react";
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
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-white shadow-md' 
                : 'bg-gradient-to-b from-white/95 to-white/80'
        }`}>
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between font-title">
                    <Link to='/' className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 p-2 rounded-lg">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
                                ADVOCACIA
                            
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-2">
                        {usuario.token ? (
                            <>
                                <Link
                                    to="/perfil"
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:text-indigo-600 transition-colors duration-200 relative group"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Perfil</span>
                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                                </Link>

                                <div className="h-6 w-px bg-gray-200"></div>

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sair</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-5 py-2 text-gray-700 font-medium hover:text-indigo-600 transition-colors duration-200 relative group"
                                >
                                    <span>Entrar</span>
                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transform hover:scale-105 transition-all duration-200"
                                >
                                    Criar Conta
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
