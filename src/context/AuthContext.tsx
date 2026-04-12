import { ToastAlert } from "@/components/feedback/ToastAlert"
import type UsuarioLogin from "@/models/usuarioLogin"
import { login } from "@/services/auth.service"
import { createContext, type ReactNode, useState, useEffect } from "react"

interface AuthContextProps {
    usuario: UsuarioLogin
    setUsuario: React.Dispatch<React.SetStateAction<UsuarioLogin>>
    handleLogout(): void
    handleLogin(usuario: UsuarioLogin): Promise<void>
    isLoading: boolean
}

interface AuthProviderProps {
    children: ReactNode
}

const usuarioInicial: UsuarioLogin = {
    id: 0,
    nome: "",
    usuario: "",
    senha: "",
    pontos: 0,
    token: ""
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [usuario, setUsuario] = useState<UsuarioLogin>(usuarioInicial)

    useEffect(() => {
        try {
            const usuarioSalvo = localStorage.getItem('usuario')
            const tokenSalvo = localStorage.getItem('token')

            if (usuarioSalvo && tokenSalvo) {
                const usuarioData = JSON.parse(usuarioSalvo)
                const usuarioCompleto = {
                    ...usuarioData,
                    token: tokenSalvo
                }
                setUsuario(usuarioCompleto)
            }
        } catch (error) {
            localStorage.removeItem('usuario')
            localStorage.removeItem('token')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (usuario.id !== 0 && usuario.token) {
            localStorage.setItem('usuario', JSON.stringify(usuario))
            localStorage.setItem('token', usuario.token)
        }
    }, [usuario])

    async function handleLogin(usuarioLogin: UsuarioLogin) {
        try {
            const setUsuarioWrapper = (dados: UsuarioLogin) => {
                if (dados.token) {
                    localStorage.setItem('token', dados.token)
                    localStorage.setItem('usuario', JSON.stringify(dados))
                }
                setUsuario(dados)
            }

            await login(`/usuarios/logar`, usuarioLogin, setUsuarioWrapper)
            ToastAlert("O Usuário foi autenticado com sucesso!", 'sucesso')
        } catch (error) {
            ToastAlert("Os Dados do usuário estão inconsistentes!", 'erro')
            throw error
        }
    }

    function handleLogout() {
        setUsuario(usuarioInicial)

        localStorage.removeItem('usuario')
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ usuario, setUsuario, handleLogin, handleLogout, isLoading }}>
            {!isLoading ? children : <div>Carregando autenticação...</div>}
        </AuthContext.Provider>
    )
}