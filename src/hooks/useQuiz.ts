import { getAIExplanation, validateEssayAnswer, type AIHelpType, type EssayValidationResult } from '@/api/openRouter.api';
import { AuthContext } from '@/context/AuthContext';
import type Questao from '@/models/questao';
import { buscar, atualizar } from '@/services/auth.service';
import { useState, useContext, useCallback } from 'react';

// Mapeamento de IDs de categorias para nomes no banco de dados
const CATEGORIA_MAP: Record<string, string> = {
    CONSTITUCIONAL: 'Direito Constitucional',
    ADMINISTRATIVO: 'Direito Administrativo',
    CIVIL: 'Direito Civil',
    PENAL: 'Direito Penal',
    EMPRESARIAL: 'Direito Empresarial',
    TRABALHO: 'Direito do Trabalho',
    TRIBUTARIO: 'Direito Tributário',
};

export interface Alternativa {
    letra?: string;
    texto?: string;
}

export interface QuizFilters {
    faseOAB?: string;
    dificuldade?: string;
    questionsCount?: number | 'unlimited';
    categorias?: string[];
}

export interface QuizStats {
    questionsAnswered: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    accuracy: number;
}

export interface UseQuizReturn {
    questao: Questao | null;
    alternativas: Alternativa[];
    selectedOption: string | null;
    selectedTextAnswer: string;
    isAnswered: boolean;
    showAIHelp: boolean;
    aiHelpType: AIHelpType | null;
    aiExplanation: string;
    isLoadingAI: boolean;
    totalQuestoes: number;
    isLoading: boolean;
    currentQuestionIndex: number;
    stats: QuizStats;
    quizFinished: boolean;
    pontosGanhos: number;
    questionsLimit: number | 'unlimited';
    essayValidationResult: EssayValidationResult | null;
    isValidatingEssay: boolean;
    handleSelectOption: (letra: string) => void;
    handleSelectTextAnswer: (texto: string) => void;
    handleSubmit: () => void;
    handleNext: () => void;
    handleAIHelp: (type: 'concept' | 'error' | 'essay') => void;
    handleValidateEssay: () => void;
    carregarQuestoesComFiltros: (filters: QuizFilters) => void;
    resetQuiz: () => void;
}

export const useQuiz = (): UseQuizReturn => {
    const [questao, setQuestao] = useState<Questao | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedTextAnswer, setSelectedTextAnswer] = useState<string>('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [showAIHelp, setShowAIHelp] = useState(false);
    const [aiHelpType, setAiHelpType] = useState<AIHelpType | null>(null);
    const [aiExplanation, setAiExplanation] = useState('');
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [totalQuestoes, setTotalQuestoes] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questoesCarregadas, setQuestoesCarregadas] = useState<Questao[]>([]);
    const [filtersLoaded, setFiltersLoaded] = useState<string>('');
    const [questionsLimit, setQuestionsLimit] = useState<number | 'unlimited'>(10);
    const [quizFinished, setQuizFinished] = useState(false);
    const [pontosGanhos, setPontosGanhos] = useState(0);
    const [essayValidationResult, setEssayValidationResult] = useState<EssayValidationResult | null>(null);
    const [isValidatingEssay, setIsValidatingEssay] = useState(false);

    const [stats, setStats] = useState<QuizStats>({
        questionsAnswered: 0,
        correctAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
        accuracy: 0
    });

    const { usuario: usuarioLogado, setUsuario } = useContext(AuthContext);

    const atualizarPontosUsuario = useCallback(async (pontosParaAdicionar: number) => {
        try {
            await atualizar(
                `/usuarios/${usuarioLogado.id}/adicionar-pontos`,
                pontosParaAdicionar,
                (data: any) => {
                    const novosPontos = data.pontos || (usuarioLogado.pontos + pontosParaAdicionar);

                    setUsuario(prev => ({
                        ...prev,
                        pontos: novosPontos
                    }));

                    const usuarioAtual = JSON.parse(localStorage.getItem('usuario') || '{}');
                    localStorage.setItem('usuario', JSON.stringify({
                        ...usuarioAtual,
                        pontos: novosPontos
                    }));
                },
                {
                    headers: {
                        Authorization: usuarioLogado.token,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error) {
            const novosPontos = usuarioLogado.pontos + pontosParaAdicionar;

            setUsuario(prev => ({
                ...prev,
                pontos: novosPontos
            }));

            const usuarioAtual = JSON.parse(localStorage.getItem('usuario') || '{}');
            localStorage.setItem('usuario', JSON.stringify({
                ...usuarioAtual,
                pontos: novosPontos
            }));
        }
    }, [usuarioLogado.id, usuarioLogado.token, usuarioLogado.pontos, setUsuario]);

    const atualizarEstatisticas = useCallback((acertou: boolean, pontosAdicionar: number = 5) => {
        setStats(prev => {
            const newQuestionsAnswered = prev.questionsAnswered + 1;
            const newCorrectAnswers = prev.correctAnswers + (acertou ? 1 : 0);
            const newCurrentStreak = acertou ? prev.currentStreak + 1 : 0;
            const newBestStreak = Math.max(prev.bestStreak, newCurrentStreak);
            const newAccuracy = newQuestionsAnswered > 0 ? (newCorrectAnswers / newQuestionsAnswered) * 100 : 0;

            return {
                questionsAnswered: newQuestionsAnswered,
                correctAnswers: newCorrectAnswers,
                currentStreak: newCurrentStreak,
                bestStreak: newBestStreak,
                accuracy: newAccuracy
            };
        });

        if (acertou) {
            setPontosGanhos(prev => prev + pontosAdicionar);
            atualizarPontosUsuario(pontosAdicionar);
        }
    }, [atualizarPontosUsuario]);

    const embaralharArray = useCallback(<T>(array: T[]): T[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }, []);

    const carregarQuestoesComFiltros = useCallback(async (filters: QuizFilters) => {
        const filtersString = JSON.stringify(filters);

        if (filtersString === filtersLoaded) {
            return;
        }

        setIsLoading(true);
        setQuestionsLimit(filters.questionsCount || 10);

        setStats({
            questionsAnswered: 0,
            correctAnswers: 0,
            currentStreak: 0,
            bestStreak: 0,
            accuracy: 0
        });

        try {
            let endpoint = '/questao/all';

            await buscar(endpoint, (data: Questao[]) => {
                let filteredData = data;

                // Filter by faseOAB
                if (filters.faseOAB) {
                    filteredData = filteredData.filter(questao => questao.faseOAB === filters.faseOAB);
                }

                // Filter by dificuldade
                if (filters.dificuldade) {
                    filteredData = filteredData.filter(questao => questao.dificuldade === filters.dificuldade);
                }

                // Filter by categorias
                if (filters.categorias && filters.categorias.length > 0) {
                    const categoriasNormalizadas = filters.categorias.map(
                        cat => CATEGORIA_MAP[cat] || cat
                    );
                    filteredData = filteredData.filter(questao =>
                        categoriasNormalizadas.includes(questao.assunto)
                    );
                }

                const questoesEmbaralhadas = embaralharArray(filteredData);

                let questoesFinais = questoesEmbaralhadas;
                if (filters.questionsCount !== 'unlimited' && filters.questionsCount) {
                    questoesFinais = questoesEmbaralhadas.slice(0, filters.questionsCount);
                }

                setQuestoesCarregadas(questoesFinais);
                setTotalQuestoes(questoesFinais.length);
                setFiltersLoaded(filtersString);

                if (questoesFinais.length > 0) {
                    setQuestao(questoesFinais[0]);
                    setCurrentQuestionIndex(0);
                } else {
                    setQuestao(null);
                }
            }, {
                headers: { Authorization: usuarioLogado.token }
            });
        } catch (error) {
            setQuestoesCarregadas([]);
            setTotalQuestoes(0);
            setQuestao(null);
            setFiltersLoaded(filtersString);
        } finally {
            setIsLoading(false);
        }
    }, [filtersLoaded, usuarioLogado.token, embaralharArray]);

    const carregarProximaQuestao = useCallback(() => {
        if (questoesCarregadas.length === 0) return;

        const nextIndex = (currentQuestionIndex + 1) % questoesCarregadas.length;
        setCurrentQuestionIndex(nextIndex);
        setQuestao(questoesCarregadas[nextIndex]);
    }, [questoesCarregadas, currentQuestionIndex]);

    const alternativas: Alternativa[] = questao
        ? [
            { letra: 'A', texto: questao.alternativaA },
            { letra: 'B', texto: questao.alternativaB },
            { letra: 'C', texto: questao.alternativaC },
            { letra: 'D', texto: questao.alternativaD },
        ]
        : [];

    const handleSelectOption = useCallback((letra: string) => {
        if (!isAnswered) {
            setSelectedOption(letra);
        }
    }, [isAnswered]);

    const handleSelectTextAnswer = useCallback((texto: string) => {
        if (!isAnswered) {
            setSelectedTextAnswer(texto);
        }
    }, [isAnswered]);

    const handleSubmit = useCallback(() => {
        if (questao?.tipoQuestao === 'DISSERTATIVA') {
            if (selectedTextAnswer.trim()) {
                setIsAnswered(true);
                // Para dissertativas, a estatística já será contabilizada após validação
            }
        } else {
            if (selectedOption && questao) {
                setIsAnswered(true);
                const acertou = selectedOption === questao.resposta;
                atualizarEstatisticas(acertou);
            }
        }
    }, [selectedOption, selectedTextAnswer, questao, atualizarEstatisticas]);

    const handleNext = useCallback(() => {
        const isLastQuestion = currentQuestionIndex >= totalQuestoes - 1;

        if (isLastQuestion) {
            setQuizFinished(true);
            return;
        }

        setSelectedOption(null);
        setSelectedTextAnswer('');
        setIsAnswered(false);
        setShowAIHelp(false);
        setAiHelpType(null);
        carregarProximaQuestao();
    }, [carregarProximaQuestao, currentQuestionIndex, totalQuestoes]);

    const handleAIHelp = async (type: AIHelpType) => {
        if (!questao) {
            return;
        }

        setShowAIHelp(true);
        setAiHelpType(type);
        setIsLoadingAI(true);
        setAiExplanation('');

        try {
            const explanation = await getAIExplanation(
                questao, 
                selectedOption, 
                type,
                type === 'essay' ? selectedTextAnswer : undefined
            );
            setAiExplanation(explanation);
        } catch (error) {
            setAiExplanation('Erro ao carregar a explicação. Tente novamente.');
        } finally {
            setIsLoadingAI(false);
        }
    };

    const handleValidateEssay = async () => {
        if (!questao || !selectedTextAnswer.trim()) {
            return;
        }

        setIsValidatingEssay(true);
        setEssayValidationResult(null);

        try {
            const result = await validateEssayAnswer(questao, selectedTextAnswer);
            setEssayValidationResult(result);
            setIsAnswered(true);
            
            // Atualiza estatísticas com 10 pontos para dissertativas
            atualizarEstatisticas(result.isCorrect, 10);
        } catch (error) {
            setEssayValidationResult({
                isCorrect: false,
                score: 0,
                feedback: 'Erro ao validar a resposta.',
                missingPoints: [],
                unnecessaryPoints: [],
                corrections: 'Tente novamente.'
            });
            setIsAnswered(true);
        } finally {
            setIsValidatingEssay(false);
        }
    };

    const resetQuiz = useCallback(() => {
        setQuestao(null);
        setSelectedOption(null);
        setSelectedTextAnswer('');
        setIsAnswered(false);
        setShowAIHelp(false);
        setAiHelpType(null);
        setCurrentQuestionIndex(0);
        setQuestoesCarregadas([]);
        setFiltersLoaded('');
        setQuestionsLimit(10);
        setQuizFinished(false);
        setPontosGanhos(0);
        setEssayValidationResult(null);
        setIsValidatingEssay(false);
        setStats({
            questionsAnswered: 0,
            correctAnswers: 0,
            currentStreak: 0,
            bestStreak: 0,
            accuracy: 0
        });
    }, []);

    return {
        questao,
        alternativas,
        selectedOption,
        selectedTextAnswer,
        isAnswered,
        showAIHelp,
        aiHelpType,
        aiExplanation,
        isLoadingAI,
        totalQuestoes,
        isLoading,
        currentQuestionIndex,
        stats,
        quizFinished,
        pontosGanhos,
        questionsLimit,
        essayValidationResult,
        isValidatingEssay,
        handleSelectOption,
        handleSelectTextAnswer,
        handleSubmit,
        handleNext,
        handleAIHelp,
        handleValidateEssay,
        carregarQuestoesComFiltros,
        resetQuiz,
    };
};