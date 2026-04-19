import { useContext, useEffect, useState } from 'react';
import { Brain, Trophy, Zap, ChevronRight, FileQuestionMark, ArrowRight, CheckCircle2, XCircle, BookMarked } from 'lucide-react';
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
        {/* ─── Hero Section ─── */}
        <section className="relative bg-navy-950 overflow-hidden min-h-screen flex items-center">
          {/* Background decorativo opcional */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/50 via-navy-950 to-navy-950" />

          <div className="relative w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Coluna Esquerda - Conteúdo */}
                <div className="lg:col-span-7 space-y-6 sm:space-y-8 lg:space-y-10">
                  {/* Número decorativo */}
                  <div className="flex items-center gap-4">
                    <span className="font-title text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-gold/10">
                      <BookMarked className="w-14 h-14" />
                    </span>
                    <div className="h-px flex-1 bg-gold/20" />
                  </div>

                  {/* Título com breakpoints responsivos */}
                  <h1 className="font-title leading-tight">
                    <span className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl">
                      Domine a{" "}
                      <span className="relative inline-block">
                        <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold text-5xl sm:text-6xl md:text-7xl">
                          OAB
                        </span>
                      </span>
                    </span>

                    <span className="text-silver block mt-2 sm:mt-3 lg:mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                      com Inteligência Artificial
                    </span>
                  </h1>

                  {/* Descrição */}
                  <p className="text-sm sm:text-base lg:text-lg text-steel max-w-md lg:max-w-lg font-sans leading-relaxed border-l-2 border-gold/30 pl-4 sm:pl-6">
                    Questões reais, feedback instantâneo e uma IA que entende
                    exatamente onde você precisa melhorar.
                  </p>

                  {/* CTAs */}
                  <div className="pt-4 sm:pt-6 lg:pt-8">
                    {!usuario.token ? (
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Link
                          to="/register"
                          className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-transparent border border-gold text-gold font-sans font-medium overflow-hidden text-center w-full sm:w-auto"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 transition-colors duration-300 group-hover:text-navy-950">
                            Criar conta
                            <span className="text-xl sm:text-2xl leading-none">
                              →
                            </span>
                          </span>

                          <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

                          <span className="absolute inset-0 flex items-center justify-center text-navy-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium gap-2 sm:gap-3">
                            Criar conta
                            <span className="text-xl sm:text-2xl leading-none">
                              →
                            </span>
                          </span>
                        </Link>

                        <Link
                          to="/login"
                          className="px-6 sm:px-8 py-3 sm:py-4 text-silver hover:text-white font-sans transition-colors flex items-center justify-center gap-2"
                        >
                          <Zap className="w-4 h-4" />
                          Entrar
                        </Link>
                      </div>
                    ) : (
                      <Link
                        to="/quizform"
                        className="group relative px-8 sm:px-10 py-3 sm:py-4 bg-transparent border border-gold text-gold font-sans font-medium overflow-hidden flex w-full sm:w-auto justify-center"
                      >
                        <span className="relative z-10 flex items-center gap-2 sm:gap-3 group-hover:opacity-0 transition-opacity duration-300">
                          <Zap className="w-4 h-4" />
                          Praticar agora
                          <span className="text-xl sm:text-2xl leading-none">
                            →
                          </span>
                        </span>
                        <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                        <span className="absolute inset-0 flex items-center justify-center text-navy-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium gap-2 sm:gap-3">
                          <Zap className="w-4 h-4" />
                          Praticar agora
                          <span className="text-xl sm:text-2xl leading-none">
                            →
                          </span>
                        </span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Coluna Direita - Card da Questão */}
                <div className="lg:col-span-5 mt-10 lg:mt-0">
                  <div className="relative">

                    {/* Card Principal */}
                    <div className="relative bg-navy-800/50 backdrop-blur-sm border-2 border-navy-700 p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl">
                      <div className="absolute top-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-l-2 border-gold/30 -translate-x-1 -translate-y-1" />
                      <div className="absolute bottom-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-r-2 border-gold/30 translate-x-1 translate-y-1" />

                      {/* Header do Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-navy-700 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gold">#</span>
                          <span className="font-title text-xs sm:text-sm text-white tracking-wider">
                            QUESTÃO DO DIA
                          </span>
                        </div>
                        <span className="text-xs font-mono text-steel uppercase truncate">
                          {questao?.assunto || "CONSTITUCIONAL"}
                        </span>
                      </div>

                      {/* Enunciado */}
                      <p className="text-white text-sm leading-relaxed mb-6 font-sans">
                        {questao?.enunciado ||
                          "Carregando enunciado da questão..."}
                      </p>

                      {/* Alternativas */}
                      <div className="space-y-2 mb-6">
                        {alternativas.map((alt) => (
                          <button
                            key={alt.letra}
                            onClick={() => handleSelectOption(alt.letra!)}
                            disabled={isAnswered}
                            className="w-full text-left group"
                          >
                            <div className="flex items-stretch">
                              {/* Letra */}
                              <div
                                className={`
                                                w-8 sm:w-10 flex-shrink-0 flex items-center justify-center font-mono text-xs sm:text-sm border transition-all duration-200
                                                ${
                                                  isAnswered &&
                                                  alt.letra ===
                                                    questao?.resposta
                                                    ? "bg-green-500/10 border-green-500/50 text-green-400"
                                                    : ""
                                                }
                                                ${
                                                  isAnswered &&
                                                  selectedOption ===
                                                    alt.letra &&
                                                  alt.letra !==
                                                    questao?.resposta
                                                    ? "bg-red-500/10 border-red-500/50 text-red-400"
                                                    : ""
                                                }
                                                ${
                                                  !isAnswered &&
                                                  selectedOption === alt.letra
                                                    ? "bg-gold/10 border-gold text-gold"
                                                    : "border-navy-700 text-steel group-hover:border-navy-600"
                                                }
                                            `}
                              >
                                {alt.letra}
                              </div>
                              {/* Texto */}
                              <div
                                className={`
                                                flex-1 min-w-0 p-2 sm:p-3 border-t border-r border-b border-navy-700 text-xs sm:text-sm transition-all duration-200
                                                ${isAnswered && alt.letra === questao?.resposta ? "bg-green-500/5" : ""}
                                                ${
                                                  isAnswered &&
                                                  selectedOption ===
                                                    alt.letra &&
                                                  alt.letra !==
                                                    questao?.resposta
                                                    ? "bg-red-500/5"
                                                    : ""
                                                }
                                                ${!isAnswered && selectedOption === alt.letra ? "bg-gold/5" : ""}
                                                ${!isAnswered && !selectedOption ? "group-hover:bg-navy-700/30" : ""}
                                            `}
                              >
                                <span
                                  className={`
                                                    ${isAnswered && alt.letra === questao?.resposta ? "text-green-400" : ""}
                                                    ${
                                                      isAnswered &&
                                                      selectedOption ===
                                                        alt.letra &&
                                                      alt.letra !==
                                                        questao?.resposta
                                                        ? "text-red-400"
                                                        : ""
                                                    }
                                                    ${!isAnswered && selectedOption === alt.letra ? "text-gold" : "text-silver"}
                                                `}
                                >
                                  {alt.texto}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Botão de Ação */}
                      {!isAnswered ? (
                        <button
                          onClick={handleSubmit}
                          disabled={!selectedOption}
                          className="w-full py-2.5 sm:py-3 font-mono text-xs uppercase tracking-widest border border-navy-600 text-silver hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          [ Confirmar resposta ]
                        </button>
                      ) : (
                        <div
                          className={`p-3 sm:p-4 border font-mono text-xs ${isCorrect ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}
                        >
                          <div className="flex items-start gap-3">
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className="text-white block mb-1 text-xs sm:text-sm">
                                {isCorrect
                                  ? "RESPOSTA CORRETA"
                                  : "RESPOSTA INCORRETA"}
                              </span>
                              <span className="text-silver text-xs">
                                {isCorrect
                                  ? "Excelente raciocínio."
                                  : `Resposta correta: ${questao?.resposta}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* AI Help */}
                      {showAIHelp && (
                        <div className="mt-4 p-3 sm:p-4 bg-navy-900/50 border border-gold/20 font-mono text-xs animate-fadeIn">
                          <div className="flex items-start gap-2">
                            <Brain className="w-3 h-3 text-gold mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-gold block mb-1 text-xs">
                                $ IA_
                                {aiHelpType === "concept"
                                  ? "explicacao_conceito"
                                  : "analise_erro"}{" "}
                                --
                              </span>
                              <span className="text-steel text-xs leading-relaxed">
                                {aiHelpType === "concept"
                                  ? "📚 Este tema aborda fundamentos constitucionais essenciais para sua preparação."
                                  : "💡 Dica: Revise a fundamentação teórica deste tópico para fixar melhor o conteúdo."}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Features Section ─── */}
        <section className="relative bg-navy-900 py-16 overflow-hidden">
          <div className="px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="grid lg:grid-cols-12 gap-8 mb-12 lg:mb-20">
                <div className="lg:col-span-4">
                  <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-4">
                    [ Funcionalidades ]
                  </span>
                  <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                    Tudo que você
                    <span className="text-gold block mt-2">precisa em</span>
                    um só lugar
                  </h2>
                </div>
                <div className="lg:col-span-5 lg:col-start-8">
                  <p className="text-steel text-base lg:text-lg font-sans leading-relaxed border-l-2 border-gold/30 pl-6">
                    Esqueça planilhas e marcações manuais. Nossa plataforma foi
                    desenhada para quem busca eficiência e resultados reais.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className="group cursor-pointer"
                      onMouseEnter={() => setActiveFeature(idx)}
                    >
                      <div className="relative bg-navy-800/30 border border-navy-700 p-6 lg:p-8 h-full hover:border-gold/30 transition-all duration-300">
                        <div className="absolute top-4 right-4 font-mono text-5xl lg:text-6xl text-navy-700/20 select-none pointer-events-none">
                          {String(idx + 1).padStart(2, "0")}
                        </div>

                        <div className="relative">
                          <div className="mb-6">
                            <Icon className="w-9 h-9 lg:w-10 lg:h-10 text-gold" />
                          </div>

                          <h3 className="font-title text-xl lg:text-2xl text-white mb-3">
                            {feature.title}
                          </h3>

                          <p className="text-silver font-sans text-sm leading-relaxed">
                            {feature.description}
                          </p>
                          
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA Section ─── */}
        <section className="relative bg-navy-950 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {!usuario.token ? (
              <div className="border-b-2 border-navy-800 py-14 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div>
                    <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-4 lg:mb-6">
                      [ Comece agora ]
                    </span>
                    <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white leading-tight">
                      Pronto para
                      <span className="text-gold block">revolucionar</span>
                      seus estudos?
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <p className="text-steel text-base lg:text-lg font-sans leading-relaxed">
                      Milhares de estudantes já estão usando IA para acelerar
                      sua aprovação. Não fique para trás.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                      <Link
                        to="/register"
                        className="group flex items-center justify-center gap-3 px-8 py-4 bg-gold text-navy-950 font-mono text-sm uppercase tracking-wider hover:bg-gold-light transition-colors"
                      >
                        Criar conta
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <Link
                        to="/login"
                        className="flex items-center justify-center px-8 py-4 border border-navy-700 text-silver font-mono text-sm uppercase tracking-wider hover:border-gold hover:text-gold transition-colors"
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-t-2 border-b-2 border-navy-800 py-14 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div>
                    <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-4 lg:mb-6">
                      [ Continue ]
                    </span>
                    <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white leading-tight">
                      Sua jornada
                      <span className="text-gold block">continua aqui</span>
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <p className="text-steel text-base lg:text-lg font-sans leading-relaxed">
                      Mantenha o ritmo e domine todas as áreas do direito com o
                      poder da IA.
                    </p>

                    <Link
                      to="/quizform"
                      className="group flex sm:inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold text-navy-950 font-mono text-sm uppercase tracking-wider hover:bg-gold-light transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                      Praticar agora
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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