import { Brain } from "lucide-react"
import SpotlightCard from "../common/SpotlightCard"

function Footer() {

    const data = new Date().getFullYear()

    return (
        <>
            <footer className="text-white shadow-xl mt-16">
                <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(25, 60, 184, 0.7)">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-linear-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                                    <Brain className="w-6 h-6 text-white z-100" />
                                </div>
                                <span className="text-xl font-semibold font-title">AdvocacIA</span>
                            </div>

                            <div className="text-gray-300 text-sm flex flex-col">
                                <p className="flex justify-center">© {data} AdvocacIA. Preparando futuros profissionais para a OAB.</p>
                                <p className="flex justify-center">Projeto realizado como forma de Projeto Integrador para a Universidade Virtual do Estado de São Paulo (UNIVESP)</p>
                            </div>

                            <div className="flex gap-6 text-sm text-gray-300">
                                <a href="#" className="hover:text-white transition-colors">Sobre</a>
                                <a href="https://github.com/ProjetoVestIA/VestIA_Front-end" target="_blank" className="hover:text-white transition-colors">Repositório</a>
                            </div>
                        </div>
                    </div>
                </SpotlightCard>
            </footer>
        </>
    )
}

export default Footer