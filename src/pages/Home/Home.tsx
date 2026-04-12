import { useContext, useEffect, useState } from 'react';
import { Brain, Trophy, Zap, ChevronRight, Sparkles, FileQuestionMark, ArrowRight, BookOpen, Target, ChartNoAxesCombined, CheckCircle2, XCircle } from 'lucide-react';
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

    const getOptionStyle = (letra: string) => {
        if (!isAnswered) {
            return selectedOption === letra
                ? 'border-prussian-blue-600 bg-prussian-blue-50'
                : 'border-gray-200 hover:border-prussian-blue-500 hover:bg-prussian-blue-50';
        }

        if (letra === questao?.resposta) {
            return 'border-green-500 bg-green-50';
        }

        if (selectedOption === letra && letra !== questao?.resposta) {
            return 'border-red-500 bg-red-50';
        }

        return 'border-gray-200 bg-gray-50 opacity-60';
    };

    return (
        <>
            {/* Hero Section */}
            <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-0 flex items-center justify-center">
                <div className="w-full flex flex-col">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-prussian-blue-100 rounded-full text-prussian-blue-700 text-xs sm:text-sm font-medium font-title">
                                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Powered by DeepSeek</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-[650] leading-tight font-title">
                                <span className="text-gray-900">Prepare-se para o </span>
                                <span className="bg-linear-to-r from-prussian-blue-600 to-prussian-blue-800 bg-clip-text text-transparent">
                                    exame da OAB
                                </span>
                                <span className="text-gray-900"> de forma mais inteligente!</span>
                            </h1>

                            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Estude com questões reais da OAB, receba feedback personalizado de nossa IA e acompanhe seu progresso.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm sm:text-base pt-2 font-title">
                                {!usuario.token ? (
                                    <>
                                        <Link to='/register' className="group px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-prussian-blue-600 to-prussian-blue-700 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-prussian-blue-200 transform hover:scale-105 transition-all flex items-center justify-center gap-2">
                                            Criar Conta
                                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                        <Link to='/login' className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-prussian-blue-600 font-semibold rounded-xl border-2 border-prussian-blue-600 hover:bg-prussian-blue-50 transition-all flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-prussian-blue-200 transform hover:scale-105">
                                            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="hidden sm:inline">Entrar e Começar a praticar</span>
                                            <span className="sm:hidden">Entrar</span>
                                        </Link>
                                    </>
                                ) : (
                                    <Link to="/quizform" className="group px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-prussian-blue-600 to-prussian-blue-700 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-prussian-blue-200 transform hover:scale-105 transition-all flex items-center justify-center gap-2">
                                        <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Começar a praticar
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Hero Board/Animation */}
                        <div className="relative mt-8 lg:mt-0">
                            <div className="absolute inset-0 bg-linear-to-br from-prussian-blue-400 to-prussian-blue-600 rounded-2xl sm:rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <span className="text-xs sm:text-sm font-medium text-gray-500 font-title">Questão Rápida</span>
                                    <span className="px-2 py-0.5 bg-prussian-blue-100 text-prussian-blue-700 text-xs font-semibold rounded-full font-title">
                                        {questao?.assunto || 'ASSUNTO'}
                                    </span>
                                </div>

                                <p className="text-sm sm:text-base text-gray-800 leading-snug">{questao?.enunciado}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {alternativas.map((alt) => (
                                        <button
                                            key={alt.letra}
                                            onClick={() => handleSelectOption(alt.letra)}
                                            disabled={isAnswered}
                                            className={`p-2.5 sm:p-3 border-2 rounded-lg transition-all text-left text-sm sm:text-base ${getOptionStyle(alt.letra)} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 ${isAnswered && alt.letra === questao?.resposta
                                                        ? 'bg-green-500 text-white'
                                                        : isAnswered && selectedOption === alt.letra && alt.letra !== questao?.resposta
                                                            ? 'bg-red-500 text-white'
                                                            : selectedOption === alt.letra
                                                                ? 'bg-prussian-blue-600 text-white'
                                                                : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    {alt.letra}
                                                </span>
                                                <span className="text-gray-700 leading-tight">{alt.texto}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {!isAnswered && (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!selectedOption}
                                        className={`w-full py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all ${selectedOption
                                            ? 'bg-prussian-blue-600 text-white hover:bg-prussian-blue-700'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        Confirmar Resposta
                                    </button>
                                )}

                                {isAnswered && (
                                    <div
                                        className={`p-2.5 rounded-lg border-2 ${isCorrect
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-red-50 border-red-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isCorrect ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                                            )}
                                            <div className="text-xs sm:text-sm leading-tight">
                                                <span
                                                    className={`font-semibold font-title ${isCorrect ? 'text-green-800' : 'text-red-800'}`}
                                                >
                                                    {isCorrect ? 'Parabéns!' : 'Incorreta'}
                                                </span>
                                                <span
                                                    className={`ml-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}
                                                >
                                                    {isCorrect ? 'Continue assim!' : `Resposta: ${questao?.resposta}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {showAIHelp && (
                                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-700 leading-snug">
                                        <div className="flex items-start gap-2">
                                            <Brain className="w-4 h-4 text-prussian-blue-600 shrink-0 mt-0.5" />
                                            {aiHelpType === 'concept' ? (
                                                <p>
                                                    <span className="font-semibold text-gray-900">Conceito:</span> A IA explica o conceito relacionado a esta questão.
                                                </p>
                                            ) : (
                                                <p>
                                                    <span className="font-semibold text-gray-900">Análise do erro:</span> A IA mostra onde você errou e como melhorar.
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
                        <h2 className="text-5xl font-semibold text-gray-900 font-title">
                            Por que escolher o <span className="text-prussian-blue-600">AdvocacIA</span>?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                                    className={`relative p-8 rounded-2xl transition-all duration-400 cursor-pointer ${isActive
                                        ? 'bg-prussian-blue-600 shadow-2xl shadow-prussian-blue-500/50 scale-102'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                    onMouseEnter={() => setActiveFeature(idx)}
                                >
                                    <div className={`p-3 rounded-xl inline-block mb-6 ${isActive ? 'bg-white/20' : 'bg-prussian-blue-100'
                                        }`}>
                                        <Icon className={`w-8 h-8 ${isActive ? 'text-white' : 'text-prussian-blue-600'}`} />
                                    </div>

                                    <h3 className={`text-2xl font-semibold font-title mb-3 ${isActive ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {feature.title}
                                    </h3>

                                    <p className={`text-lg leading-relaxed ${isActive ? 'text-blue-50' : 'text-gray-600'
                                        }`}>
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
                        <>
                            <div className="relative overflow-hidden bg-linear-to-br from-prussian-blue-600 to-prussian-blue-950 rounded-3xl p-12 flex-1">
                                <div className="relative text-center space-y-6">
                                    <h2 className="text-4xl font-title font-semibold text-white">
                                        Pronto para começar sua jornada?
                                    </h2>
                                    <p className="text-xl text-prussian-blue-100 max-w-2xl mx-auto">
                                        Junte-se a outros estudantes que já estão aproveitando o poder da Inteligência Artificial para estudar melhor!
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                                        <div className="flex items-center gap-2 text-prussian-blue-100">
                                            <BookOpen className="w-5 h-5" />
                                            <span className="text-sm">Estude com IA</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-prussian-blue-100">
                                            <Target className="w-5 h-5" />
                                            <span className="text-sm">Alcance suas metas</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-prussian-blue-100">
                                            <ChartNoAxesCombined className="w-5 h-5" />
                                            <span className="text-sm">Resultados reais</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 text-lg font-title">
                                        <Link to='/register' className="px-8 py-4  bg-blue-600 text-white font-[650] rounded-xl hover:bg-blue-500 hover:shadow-2xl transform hover:scale-105 transition-all">
                                            CRIAR CONTA
                                        </Link>
                                        <Link to='/login' className="px-8 py-4 hover:shadow-2xl  bg-white text-blue-600 font-[650] rounded-xl hover:bg-blue-50  transform hover:scale-105 transition-all">
                                            JÁ TENHO CONTA
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="relative overflow-hidden bg-linear-to-br from-blue-600 to-blue-950 rounded-3xl p-12 flex-1">
                                <div className="relative text-center space-y-4">
                                    <div className="text-blue-100 inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/30">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-md font-medium">
                                            Bem-vindo de volta!
                                        </span>
                                    </div>
                                    <h2 className="text-4xl font-title font-semibold text-white">
                                        Continue sua jornada de aprendizado
                                    </h2>
                                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                                        Aproveite ao máximo a IA para turbinar seus estudos. Pratique agora e alcance seus objetivos!
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                                        <div className="flex items-center gap-2 text-blue-100">
                                            <BookOpen className="w-5 h-5" />
                                            <span className="text-sm">Estude com IA</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-100">
                                            <Target className="w-5 h-5" />
                                            <span className="text-sm">Alcance suas metas</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-100">
                                            <ChartNoAxesCombined className="w-5 h-5" />
                                            <span className="text-sm">Resultados reais</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                        <Link to='/quizform'
                                            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-title font-[650] text-lg rounded-xl hover:bg-blue-50 hover:shadow-2xl transform hover:scale-105 transition-all"
                                        >
                                            COMEÇAR A PRATICAR
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>



        </>
    );
};

export default Home;