import { useContext, useEffect, useState } from 'react';
import { Brain, Trophy, Zap, ChevronRight, Sparkles, FileQuestionMark, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { useQuestao } from '@/hooks/useQuestao';

function Home() {
    const {
        questao,
        alternativas,
        selectedOption,
        isAnswered,
        showAIHelp,
        aiHelpType,
        handleSelectOption,
        handleSubmit,
    } = useQuestao(650);

    const { usuario } = useContext(AuthContext);

    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: Brain,
            title: 'IA Personalizada',
            description: 'Assistente inteligente que explica conceitos e analisa seus erros em tempo real'
        },
        {
            icon: FileQuestionMark,
            title: 'Questões Reais',
            description: 'Banco completo com questões do exame da Ordem dos Advogados do Brasil'
        },
        {
            icon: Trophy,
            title: 'Gamificação',
            description: 'Sistema de pontos para manter você motivado'
        }
    ];

    const isCorrect = selectedOption === questao?.resposta;

    // const getOptionStyle = (letra: string) => {
    //     if (!isAnswered) {
    //         return selectedOption === letra
    //             ? 'border-navy-600 bg-navy-50'
    //             : 'border-gray-200 hover:border-navy-500 hover:bg-navy-50';
    //     }

    //     if (letra === questao?.resposta) {
    //         return 'border-green-500 bg-green-50';
    //     }

    //     if (selectedOption === letra && letra !== questao?.resposta) {
    //         return 'border-red-500 bg-red-50';
    //     }

    //     return 'border-gray-200 bg-gray-50 opacity-60';
    // };

    return (
    <>
            {/* Hero Section */}
            <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-0 flex items-center justify-center">
                <div className="w-full flex flex-col">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium font-title">
                                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Powered by DeepSeek</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-[650] leading-tight font-title">
                                <span>Prepare-se para o </span>
                                <span>
                                    exame da OAB
                                </span>
                                <span> de forma mais inteligente!</span>
                            </h1>

                            <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Estude com questões reais da OAB, receba feedback personalizado de nossa IA e acompanhe seu progresso.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm sm:text-base pt-2 font-title">
                                {!usuario.token ? (
                                    <>
                                        <Link to='/register' className="group px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2">
                                            Criar Conta
                                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                        <Link to='/login' className="px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-xl border-2 transition-all flex items-center justify-center gap-2 transform hover:scale-105">
                                            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="hidden sm:inline">Entrar e Começar a praticar</span>
                                            <span className="sm:hidden">Entrar</span>
                                        </Link>
                                    </>
                                ) : (
                                    <Link to="/quizform" className="group px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2">
                                        <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Começar a praticar
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Hero Board */}
                        <div className="relative mt-8 lg:mt-0">
                            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                            <div className="relative rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <span className="text-xs sm:text-sm font-medium font-title">Questão Rápida</span>
                                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full font-title">
                                        {questao?.assunto || 'ASSUNTO'}
                                    </span>
                                </div>

                                <p className="text-sm sm:text-base leading-snug">{questao?.enunciado}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {alternativas.map((alt) => (
                                        <button
                                            key={alt.letra}
                                            onClick={() => handleSelectOption(alt.letra!)}
                                            disabled={isAnswered}
                                            className={`p-2.5 sm:p-3 border-2 rounded-lg transition-all text-left text-sm sm:text-base ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0">
                                                    {alt.letra}
                                                </span>
                                                <span className="leading-tight">{alt.texto}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {!isAnswered && (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!selectedOption}
                                        className="w-full py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all"
                                    >
                                        Confirmar Resposta
                                    </button>
                                )}

                                {isAnswered && (
                                    <div className="p-2.5 rounded-lg border-2">
                                        <div className="flex items-center gap-2">
                                            {isCorrect ? (
                                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                            ) : (
                                                <XCircle className="w-4 h-4 shrink-0" />
                                            )}
                                            <div className="text-xs sm:text-sm leading-tight">
                                                <span className="font-semibold font-title">
                                                    {isCorrect ? 'Parabéns!' : 'Incorreta'}
                                                </span>
                                                <span className="ml-1">
                                                    {isCorrect ? 'Continue assim!' : `Resposta: ${questao?.resposta}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {showAIHelp && (
                                    <div className="p-2.5 rounded-lg border text-xs leading-snug">
                                        <div className="flex items-start gap-2">
                                            <Brain className="w-4 h-4 shrink-0 mt-0.5" />
                                            {aiHelpType === 'concept' ? (
                                                <p>
                                                    <span className="font-semibold">Conceito:</span> A IA explica o conceito relacionado a esta questão.
                                                </p>
                                            ) : (
                                                <p>
                                                    <span className="font-semibold">Análise do erro:</span> A IA mostra onde você errou e como melhorar.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-5xl font-semibold font-title">
                            Por que escolher o <span>AdvocacIA</span>?
                        </h2>
                        <p className="text-xl max-w-2xl mx-auto">
                            Uma plataforma completa que une tecnologia e educação para turbinar seus estudos.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            const isActive = activeFeature === idx;

                            return (
                                <div
                                    key={idx}
                                    className={`relative p-8 rounded-2xl transition-all duration-400 cursor-pointer ${isActive ? 'scale-102' : ''}`}
                                    onMouseEnter={() => setActiveFeature(idx)}
                                >
                                    <div className="p-3 rounded-xl inline-block mb-6">
                                        <Icon className="w-8 h-8" />
                                    </div>

                                    <h3 className="text-2xl font-semibold font-title mb-3">
                                        {feature.title}
                                    </h3>

                                    <p className="text-lg leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="pt-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    {!usuario.token ? (
                        <div className="relative overflow-hidden rounded-3xl p-12 flex-1">
                            <div className="relative text-center space-y-6">
                                <h2 className="text-4xl font-title font-semibold">
                                    Pronto para começar sua jornada?
                                </h2>
                                <p className="text-xl max-w-2xl mx-auto">
                                    Junte-se a outros estudantes que já estão aproveitando o poder da Inteligência Artificial para estudar melhor!
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 text-lg font-title">
                                    <Link to='/register' className="px-8 py-4 font-[650] rounded-xl transform hover:scale-105 transition-all">
                                        CRIAR CONTA
                                    </Link>
                                    <Link to='/login' className="px-8 py-4 font-[650] rounded-xl transform hover:scale-105 transition-all">
                                        JÁ TENHO CONTA
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-3xl p-12 flex-1">
                            <div className="relative text-center space-y-4">
                                <h2 className="text-4xl font-title font-semibold">
                                    Continue sua jornada de aprendizado
                                </h2>
                                <p className="text-xl max-w-2xl mx-auto">
                                    Aproveite ao máximo a IA para turbinar seus estudos. Pratique agora e alcance seus objetivos!
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                    <Link
                                        to='/quizform'
                                        className="group inline-flex items-center justify-center gap-2 px-8 py-4 font-title font-[650] text-lg rounded-xl transform hover:scale-105 transition-all"
                                    >
                                        COMEÇAR A PRATICAR
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Home;