import { ToastAlert } from '@/components/feedback/ToastAlert';
import { AuthContext } from '@/context/AuthContext';
import type Questao from '@/models/questao';
import { buscar } from '@/services/auth.service';
import { useState, useEffect, useContext } from 'react';

export interface Alternativa {
    letra?: string;
    texto?: string;
}

export interface UseQuestaoReturn {
    questao: Questao | null;
    alternativas: Alternativa[];
    selectedOption: string | null;
    isAnswered: boolean;
    showAIHelp: boolean;
    aiHelpType: 'concept' | 'error' | null;
    totalQuestoes: number;
    isLoading: boolean;
    handleSelectOption: (letra: string) => void;
    handleSubmit: () => void;
    handleNext: () => void;
    handleAIHelp: (type: 'concept' | 'error') => void;
    carregarQuestaoAleatoria: () => void;
}

export const useQuestao = (maxCaracteres?: number): UseQuestaoReturn => {
    const [questao, setQuestao] = useState<Questao | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showAIHelp, setShowAIHelp] = useState(false);
    const [aiHelpType, setAIHelpType] = useState<'concept' | 'error' | null>(null);
    const [totalQuestoes, setTotalQuestoes] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [questoesFiltradas, setQuestoesFiltradas] = useState<number[]>([]);

    const { usuario: usuarioLogado } = useContext(AuthContext);

    useEffect(() => {
        const carregarTotalQuestoes = async () => {
            try {
                await buscar('/questao/all', (data: Questao[]) => {
                    if (maxCaracteres) {
                        const idsFiltrados = data
                            .filter(q => q.enunciado && q.enunciado.length <= maxCaracteres)
                            .map(q => q.id);
                        setQuestoesFiltradas(idsFiltrados);
                        setTotalQuestoes(idsFiltrados.length);
                    } else {
                        setTotalQuestoes(data.length);
                    }
                }, {
                    headers: { Authorization: usuarioLogado.token }
                });
            } catch (error) {
                setTotalQuestoes(10);
            }
        };

        carregarTotalQuestoes();
    }, [usuarioLogado.token, maxCaracteres]);

    const gerarIdAleatorio = () => {
        if (maxCaracteres && questoesFiltradas.length > 0) {
            const indice = Math.floor(Math.random() * questoesFiltradas.length);
            return questoesFiltradas[indice];
        }

        if (totalQuestoes > 0) {
            return Math.floor(Math.random() * totalQuestoes) + 1;
        }
        return Math.floor(Math.random() * 100) + 1;
    };

    const carregarQuestaoAleatoria = async () => {
        setIsLoading(true);
        const id = gerarIdAleatorio();

        try {
            await buscar(`/questao/${id}`, setQuestao, {
                headers: { Authorization: usuarioLogado.token }
            });
        } catch (error) {
            ToastAlert('Erro ao carregar questão', 'erro')
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (totalQuestoes > 0) {
            carregarQuestaoAleatoria();
        }
    }, [totalQuestoes]);

    const alternativas: Alternativa[] = questao
        ? [
            { letra: 'A', texto: questao.alternativaA },
            { letra: 'B', texto: questao.alternativaB },
            { letra: 'C', texto: questao.alternativaC },
            { letra: 'D', texto: questao.alternativaD },
        ]
        : [];

    const handleSelectOption = (letra: string) => {
        if (!isAnswered) {
            setSelectedOption(letra);
        }
    };

    const handleSubmit = () => {
        if (selectedOption) {
            setIsAnswered(true);
        }
    };

    const handleNext = () => {
        setSelectedOption(null);
        setIsAnswered(false);
        setShowAIHelp(false);
        setAIHelpType(null);
        carregarQuestaoAleatoria();
    };

    const handleAIHelp = (type: 'concept' | 'error') => {
        setAIHelpType(type);
        setShowAIHelp(true);
    };

    return {
        questao,
        alternativas,
        selectedOption,
        isAnswered,
        showAIHelp,
        aiHelpType,
        totalQuestoes,
        isLoading,
        handleSelectOption,
        handleSubmit,
        handleNext,
        handleAIHelp,
        carregarQuestaoAleatoria,
    };
};