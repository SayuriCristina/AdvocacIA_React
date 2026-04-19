import type Usuario from "@/models/usuario";
import { User, Award, Mail, Save, X, Edit2, LockKeyhole } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { atualizar } from "@/services/auth.service";
import { ToastAlert } from "@/components/feedback/ToastAlert";

function Perfil() {
    const { usuario: usuarioLogado, setUsuario } = useContext(AuthContext);
    const [usuarioLocal, setUsuarioLocal] = useState<Usuario | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({ nome: '', usuario: '', senha: '' });

    useEffect(() => {
        if (usuarioLogado.id !== 0) {
            setUsuarioLocal(usuarioLogado);
            setEditedData({
                nome: usuarioLogado.nome,
                usuario: usuarioLogado.usuario,
                senha: ''
            });
        }
    }, [usuarioLogado]);

    const handleEditClick = () => {
        if (!usuarioLocal) return;
        setEditedData({
            nome: usuarioLocal.nome,
            usuario: usuarioLocal.usuario,
            senha: ''
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!usuarioLocal) return;

        try {
            const dadosParaEnviar = {
                id: usuarioLocal.id,
                nome: editedData.nome,
                usuario: editedData.usuario,
                senha: editedData.senha.trim() !== '' ? editedData.senha : usuarioLogado.senha
            };

            const header = {
                headers: {
                    Authorization: usuarioLogado.token
                },
            };

            await atualizar(`/usuarios/atualizar`, dadosParaEnviar, (data: any) => {
                setUsuarioLocal(prev => prev ? {
                    ...prev,
                    nome: data.nome || editedData.nome,
                    usuario: data.usuario || editedData.usuario,
                    senha: dadosParaEnviar.senha,
                    pontos: prev.pontos
                } : null);

                setUsuario(prev => ({
                    ...prev,
                    nome: data.nome || editedData.nome,
                    usuario: data.usuario || editedData.usuario,
                    senha: dadosParaEnviar.senha,
                }));
            }, header);

            setIsEditing(false);
            setEditedData(prev => ({ ...prev, senha: '' }));
            ToastAlert('Perfil atualizado com sucesso!', 'sucesso');
        } catch (error) {
            ToastAlert('Erro ao atualizar perfil!', 'erro');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (usuarioLocal) {
            setEditedData({
                nome: usuarioLocal.nome,
                usuario: usuarioLocal.usuario,
                senha: ''
            });
        }
    };

    return (
        <div className="bg-navy-950 flex items-center justify-center min-h-screen px-4 py-12 pt-20">
            <div className="relative w-full max-w-2xl">
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
                        <div className="relative inline-block mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-gold via-gold-light to-gold rounded-full flex items-center justify-center mx-auto">
                                <User className="w-12 h-12 text-navy-950" />
                            </div>
                            <div className="absolute bottom-2 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-navy-800"></div>
                        </div>
                        <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-3">
                            [ Meu Perfil ]
                        </span>
                        <h1 className="text-3xl font-bold text-white mb-2 font-title">
                            Meu Perfil
                        </h1>
                        <p className="text-steel font-sans text-sm">Gerencie suas informações</p>
                    </div>

                    {/* Pontos Badge */}
                    <div className="bg-gradient-to-r from-gold/20 to-gold-light/20 border border-gold/30 p-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gold text-xs font-mono uppercase tracking-widest mb-2">Total de Pontos</p>
                                <p className="text-5xl font-semibold font-title text-gold">{usuarioLogado.pontos}</p>
                            </div>
                            <div className="bg-gold/10 rounded-full p-4 flex items-center justify-center border border-gold/20">
                                <Award className="w-8 h-8 text-gold" />
                            </div>
                        </div>
                    </div>

                    {/* Informações do Usuário */}
                    <div className="space-y-5">
                        {/* Nome */}
                        <div className="bg-navy-900/50 border border-navy-700  p-4 hover:border-navy-600 transition-colors">
                            <label className="block text-xs font-mono text-gold uppercase tracking-widest mb-3">
                                Nome Completo
                            </label>
                            {isEditing ? (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gold" />
                                    </div>
                                    <input
                                        type="text"
                                        value={editedData.nome}
                                        onChange={(e) => setEditedData({ ...editedData, nome: e.target.value })}
                                        className="block w-full pl-10 pr-4 py-3 bg-navy-800/50 border border-navy-700 focus:border-gold focus:bg-gold/5 text-white placeholder-steel focus:outline-none font-sans transition-colors"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center text-white">
                                    <User className="h-5 w-5 text-gold mr-3" />
                                    <span className="text-lg">{usuarioLocal?.nome}</span>
                                </div>
                            )}
                        </div>

                        {/* E-mail/Usuário */}
                        <div className="bg-navy-900/50 border border-navy-700  p-4 hover:border-navy-600 transition-colors">
                            <label className="block text-xs font-mono text-gold uppercase tracking-widest mb-3">
                                E-mail
                            </label>
                            {isEditing ? (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gold" />
                                    </div>
                                    <input
                                        type="email"
                                        value={editedData.usuario}
                                        onChange={(e) => setEditedData({ ...editedData, usuario: e.target.value })}
                                        className="block w-full pl-10 pr-4 py-3 bg-navy-800/50 border border-navy-700 focus:border-gold focus:bg-gold/5 text-white placeholder-steel focus:outline-none font-sans transition-colors"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center text-white">
                                    <Mail className="h-5 w-5 text-gold mr-3" />
                                    <span className="text-lg">{usuarioLocal?.usuario}</span>
                                </div>
                            )}
                        </div>

                        {/* Senha do Usuário */}
                        <div className="bg-navy-900/50 border border-navy-700  p-4 hover:border-navy-600 transition-colors">
                            <label className="block text-xs font-mono text-gold uppercase tracking-widest mb-3">
                                Senha
                            </label>
                            {isEditing ? (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockKeyhole className="h-5 w-5 text-gold" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Deixe em branco para manter a atual"
                                        value={editedData.senha}
                                        onChange={(e) => setEditedData({ ...editedData, senha: e.target.value })}
                                        className="block w-full pl-10 pr-4 py-3 bg-navy-800/50 border border-navy-700 focus:border-gold focus:bg-gold/5 text-white placeholder-steel focus:outline-none font-sans transition-colors"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center text-white">
                                    <LockKeyhole className="h-5 w-5 text-gold mr-3" />
                                    <span className="text-lg text-steel italic">••••••••••••</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="mt-8 pt-6 border-t border-navy-700 flex gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 group relative px-6 py-3 bg-transparent border border-gold text-gold font-mono text-sm uppercase tracking-wider font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_4px_20px_rgba(201,168,76,0.4)] flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    <span className="relative z-10 group-hover:text-navy-950 transition-colors">Salvar</span>
                                    <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 group relative px-6 py-3 bg-transparent border border-steel text-steel font-mono text-sm uppercase tracking-wider font-medium overflow-hidden transition-all duration-300 hover:border-red-400 hover:text-red-400 flex items-center justify-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Cancelar</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEditClick}
                                className="w-full group relative px-8 py-3 bg-transparent border border-gold text-gold font-mono text-sm uppercase tracking-wider font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_4px_20px_rgba(201,168,76,0.4)] flex items-center justify-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span className="relative z-10 group-hover:text-navy-950 transition-colors">Editar Perfil</span>
                                <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Linha dourada inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent -mb-4" />
            </div>
        </div>
    );
}

export default Perfil;