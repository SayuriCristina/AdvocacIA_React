import {
  Brain,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ChevronRight,
  Sparkles,
  BookOpen,
  Flame,
  Home,
  Trophy,
  BotMessageSquare,
} from "lucide-react";
import { useQuiz } from "@/hooks/useQuiz";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const filters = location.state?.filters;
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const {
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
    // questionsLimit,
    essayValidationResult,
    isValidatingEssay,
    handleSelectOption,
    handleSelectTextAnswer,
    handleSubmit,
    handleNext,
    handleAIHelp,
    handleValidateEssay,
    carregarQuestoesComFiltros,
  } = useQuiz();

  const { usuario: usuarioLogado } = useContext(AuthContext);

  useEffect(() => {
    if (filters && !hasInitialized && usuarioLogado.token) {
      carregarQuestoesComFiltros(filters);
      setHasInitialized(true);
    }

    if (!filters && !hasInitialized) {
      navigate("/quizform");
    }
  }, [
    filters,
    hasInitialized,
    carregarQuestoesComFiltros,
    navigate,
    usuarioLogado.token,
  ]);

  useEffect(() => {
    if (quizFinished) {
      setShowFinishModal(true);
    }
  }, [quizFinished]);

  const getTotalQuestoesDisplay = () => {
    if (!filters?.questionsCount || filters.questionsCount === "unlimited") {
      return totalQuestoes;
    }
    return Math.min(filters.questionsCount, totalQuestoes);
  };

  const totalQuestoesDisplay = getTotalQuestoesDisplay();

  if (!filters) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <p className="text-steel">Redirecionando...</p>
      </div>
    );
  }

  if (isLoading && !questao) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <p className="text-steel">Carregando questões...</p>
      </div>
    );
  }

  if (!questao && !isLoading && hasInitialized) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Brain className="w-16 h-16 text-gold mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white font-title mb-2">
            Nenhuma questão encontrada
          </h3>
          <p className="text-steel mb-6">
            Não foram encontradas questões com os filtros selecionados. Tente
            alterar as configurações.
          </p>
          <button
            onClick={() => navigate("/quizform")}
            className="px-6 py-3 group relative bg-transparent border border-gold text-gold hover:bg-gold/10 transition-all font-title font-medium overflow-hidden"
          >
            <span className="relative z-10">Voltar ao Formulário</span>
          </button>
        </div>
      </div>
    );
  }

  if (!usuarioLogado.token) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-steel mb-4">
            Você precisa estar logado para acessar o quiz.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 group relative bg-transparent border border-gold text-gold hover:bg-gold/10 transition-all font-title font-medium overflow-hidden"
          >
            <span className="relative z-10">Fazer Login</span>
          </button>
        </div>
      </div>
    );
  }

  if (!questao) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <p className="text-steel">Carregando questão...</p>
      </div>
    );
  }

  const isCorrect =
    questao.tipoQuestao === "DISSERTATIVA"
      ? (essayValidationResult?.isCorrect ?? false)
      : selectedOption === questao.resposta;
  const currentQuestionNumber = currentQuestionIndex + 1;
  const progressPercentage =
    totalQuestoesDisplay > 0
      ? (currentQuestionNumber / totalQuestoesDisplay) * 100
      : 0;

  const isLastQuestion = currentQuestionIndex >= totalQuestoes - 1;

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl opacity-30 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl opacity-20 -z-10" />

      <header className="z-40 pt-20 pb-8 bg-gradient-to-b from-navy-950 via-navy-950 to-navy-950/95 border-b border-gold/20">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-title font-semibold text-white">
                Questão {currentQuestionNumber}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />
              <span className="text-xs font-mono text-gold/70">
                {totalQuestoes} questões
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-navy-800/80 border border-gold/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold via-gold-light to-gold shadow-lg transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs font-semibold text-gold min-w-12 text-right">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Section - Melhorado */}
            <div className="group">
              <div className="absolute top-0 left-0 w-1 h-8 bg-gradient-to-b from-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-navy-800/40 via-navy-900/30 to-navy-950/40 backdrop-blur-md border border-gold/20 p-8 transition-all duration-300 hover:border-gold/30">
                {/* Cantos Decorativos */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold/30" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold/30" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold/30" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold/30" />

                <div className="mb-6 flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-gold/70" />
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-semibold text-gold bg-gold/10 border border-gold/20">
                      {questao.assunto}
                    </span>
                    {questao.tipoQuestao === "DISSERTATIVA" && (
                      <span className="px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20">
                        Dissertativa
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-xl leading-relaxed text-white font-semibold mb-6">
                  {questao.enunciado}
                </h2>

              {questao.tipoQuestao === "DISSERTATIVA" ? (
                <>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 pt-6">
                    <Brain className="w-5 h-5 text-gold/70" />
                    Sua resposta
                  </h3>
                  <textarea
                    value={selectedTextAnswer}
                    onChange={(e) => handleSelectTextAnswer(e.target.value)}
                    disabled={isAnswered}
                    placeholder="Escreva aqui sua resposta..."
                    className={`w-full p-4 border resize-none focus:outline-none transition-all duration-300 font-sans ${
                      isAnswered
                        ? "border-navy-700 bg-navy-900/30 text-steel cursor-default"
                        : "border-gold/20 bg-navy-900/50 text-white placeholder-steel/50 focus:border-gold focus:bg-gold/5"
                    }`}
                    rows={6}
                  />
                </>
              ) : (
                // Seção para questões de múltipla escolha
                <>
                  <div className="space-y-3 pt-4">
                    {alternativas.map((alt) => (
                      <button
                        key={alt.letra}
                        onClick={() => handleSelectOption(alt.letra!)}
                        disabled={isAnswered}
                        className={`group w-full text-left p-4 border transition-all duration-200 ${
                          isAnswered && alt.letra === questao.resposta
                            ? "border-green-500/60 bg-gradient-to-r from-green-500/20 to-green-500/5 shadow-lg shadow-green-500/20"
                            : isAnswered &&
                                selectedOption === alt.letra &&
                                alt.letra !== questao.resposta
                              ? "border-red-500/60 bg-gradient-to-r from-red-500/20 to-red-500/5 shadow-lg shadow-red-500/20"
                              : selectedOption === alt.letra
                                ? "border-gold/70 bg-gradient-to-r from-gold/20 to-gold/5 shadow-lg shadow-gold/20 scale-105"
                                : "border-gold/30 bg-gradient-to-r from-navy-900/30 to-navy-950/30 hover:border-gold/60 hover:from-gold/10 hover:shadow-lg hover:shadow-gold/10"
                        } ${!isAnswered ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`rounded-full shrink-0 w-10 h-10 font-title flex items-center justify-center font-bold text-sm transition-all ${
                              isAnswered && alt.letra === questao.resposta
                                ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg"
                                : isAnswered &&
                                    selectedOption === alt.letra &&
                                    alt.letra !== questao.resposta
                                  ? "bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg"
                                  : selectedOption === alt.letra
                                    ? "bg-gradient-to-br from-gold to-gold-light text-navy-950 shadow-lg"
                                    : "bg-navy-800 border border-gold/30 text-steel group-hover:border-gold group-hover:text-gold"
                            }`}
                          >
                            {alt.letra}
                          </div>
                          <div className="flex-1 flex items-center justify-between">
                            <span
                              className={`font-medium transition-colors ${
                                isAnswered && alt.letra === questao.resposta
                                  ? "text-green-400"
                                  : isAnswered &&
                                      selectedOption === alt.letra &&
                                      alt.letra !== questao.resposta
                                    ? "text-red-400"
                                    : selectedOption === alt.letra
                                      ? "text-gold"
                                      : "text-silver group-hover:text-gold/80"
                              }`}
                            >
                              {alt.texto}
                            </span>
                            {isAnswered && alt.letra === questao.resposta && (
                              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                            )}
                            {isAnswered &&
                              selectedOption === alt.letra &&
                              alt.letra !== questao.resposta && (
                                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                              )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            </div>

            {/* Alternativas ou Campo de Resposta Dissertativa */}

            {/* Feedback após resposta */}
            {isAnswered && (
              <div
                className={`border p-6 transition-all backdrop-blur-sm ${
                  questao.tipoQuestao === "DISSERTATIVA"
                    ? essayValidationResult?.isCorrect
                      ? "bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30 shadow-lg shadow-green-500/20"
                      : "bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/30 shadow-lg shadow-red-500/20"
                    : isCorrect
                      ? "bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30 shadow-lg shadow-green-500/20"
                      : "bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/30 shadow-lg shadow-red-500/20"
                }`}
              >
                {questao.tipoQuestao === "DISSERTATIVA" ? (
                  essayValidationResult ? (
                    <>
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`p-2 shrink-0 ${
                            essayValidationResult.isCorrect
                              ? "bg-green-500/20 border border-green-500/30"
                              : "bg-red-500/20 border border-red-500/30"
                          }`}
                        >
                          {essayValidationResult.isCorrect ? (
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">
                            {essayValidationResult.isCorrect
                              ? "Resposta Correta!"
                              : "Resposta Incorreta"}
                          </h3>
                          <p
                            className={`text-sm ${essayValidationResult.isCorrect ? "text-green-400" : "text-red-400"}`}
                          >
                            Pontuação: {essayValidationResult.score}/100
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 text-sm text-steel">
                        <div>
                          <p className="font-semibold text-white mb-2">
                            Análise da IA:
                          </p>
                          <p className="leading-relaxed">
                            {essayValidationResult.feedback}
                          </p>
                        </div>

                        {essayValidationResult.missingPoints &&
                          essayValidationResult.missingPoints.length > 0 && (
                            <div className="pl-4 border-l-2 border-gold/30">
                              <p className="font-semibold text-gold mb-2">
                                Pontos que faltaram
                              </p>
                              <ul className="space-y-1">
                                {essayValidationResult.missingPoints.map(
                                  (point, idx) => (
                                    <li key={idx} className="text-steel">
                                      • {point}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}

                        {essayValidationResult.unnecessaryPoints &&
                          essayValidationResult.unnecessaryPoints.length >
                            0 && (
                            <div className="pl-4 border-l-2 border-red-500/30">
                              <p className="font-semibold text-red-400 mb-2">
                                Conceitos desnecessários
                              </p>
                              <ul className="space-y-1">
                                {essayValidationResult.unnecessaryPoints.map(
                                  (point, idx) => (
                                    <li key={idx} className="text-red-300">
                                      • {point}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}

                        {essayValidationResult.corrections && (
                          <div className="pl-4 border-l-2 border-blue-500/30">
                            <p className="font-semibold text-blue-400 mb-2">
                              O que deveria estar na resposta
                            </p>
                            <p className="leading-relaxed text-steel">
                              {essayValidationResult.corrections}
                            </p>
                          </div>
                        )}

                        {essayValidationResult.isCorrect && (
                          <p className="font-semibold text-green-400 pt-2">
                            ✓ Você ganhou +10 pontos!
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin h-5 w-5 border-b-2 border-gold"></div>
                      <p className="text-steel">Validando sua resposta...</p>
                    </div>
                  )
                ) : isCorrect ? (
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-500/20 border border-green-500/30 rounded-full shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Parabéns! Resposta correta!
                      </h3>
                      <p className="text-sm text-green-400 mt-1">
                        Você ganhou +5 pontos! Continue assim!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-500/20 border border-red-500/30  rounded-full shrink-0">
                      <XCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Resposta incorreta
                      </h3>
                      <p className="text-sm text-red-400 mt-1">
                        A resposta correta era a alternativa {questao.resposta}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {questao.tipoQuestao === "DISSERTATIVA" ? (
                // Para dissertativas
                <>
                  {!isAnswered ? (
                    <button
                      onClick={handleValidateEssay}
                      disabled={!selectedTextAnswer.trim() || isValidatingEssay}
                      className="flex-1 px-6 py-3 group relative bg-gradient-to-r from-gold/30 to-gold/15 border border-gold hover:border-gold-light text-gold font-semibold overflow-hidden transition-all flex items-center justify-center gap-2 hover:from-gold/40 hover:to-gold/25"
                    >
                      {isValidatingEssay ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-b-2 border-gold"></div>
                          <span className="relative z-10 text-sm">
                            Validando...
                          </span>
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 relative z-10" />
                          <span className="relative z-10 text-sm">
                            Validar com IA
                          </span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="flex-1 py-3 group relative bg-gradient-to-r from-gold/30 to-gold/15 border border-gold hover:border-gold-light text-gold font-semibold overflow-hidden transition-all hover:from-gold/40 hover:to-gold/25 flex items-center justify-center gap-2"
                    >
                      {isLastQuestion ? (
                        <>
                          <Trophy className="w-4 h-4 relative z-10" />
                          <span className="relative z-10">Finalizar</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10">Próxima</span>
                          <ChevronRight className="w-4 h-4 relative z-10" />
                        </>
                      )}
                    </button>
                  )}
                </>
              ) : (
                // Para múltipla escolha
                <>
                  {!isAnswered ? (
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedOption}
                      className={`flex-1 py-3 group relative font-semibold overflow-hidden transition-all text-sm ${
                        selectedOption
                          ? "bg-gradient-to-r from-gold/30 to-gold/15 border border-gold hover:border-gold-light text-gold hover:from-gold/40 hover:to-gold/25"
                          : "bg-transparent border border-steel/30 text-steel/50 cursor-not-allowed"
                      }`}
                    >
                      <span className="relative z-10">Confirmar</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="flex-1 py-3 group relative bg-gradient-to-r from-gold/30 to-gold/15 border border-gold hover:border-gold-light text-gold font-semibold overflow-hidden transition-all hover:from-gold/40 hover:to-gold/25 flex items-center justify-center gap-2 text-sm"
                    >
                      {isLastQuestion ? (
                        <>
                          <Trophy className="w-4 h-4 relative z-10" />
                          <span className="relative z-10">Finalizar</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10">Próxima</span>
                          <ChevronRight className="w-4 h-4 relative z-10" />
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant Card - Melhorado */}
            <div className="group relative">
              <div className="absolute top-0 left-0 w-1 h-8 bg-gradient-to-b from-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-navy-800/40 via-navy-900/30 to-navy-950/40 backdrop-blur-md border border-gold/20 p-6 transition-all duration-300 hover:border-gold/30">
                {/* Cantos Decorativos */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gold/30" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gold/30" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gold/30" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gold/30" />

                <div className="flex items-center gap-3 mb-5">
                  <BotMessageSquare className="w-5 h-5 text-gold/70" />
                  <h3 className="font-semibold text-white font-title">Assistente IA</h3>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleAIHelp("concept")}
                    className="w-full p-3 group relative bg-transparent border border-gold/40 hover:border-gold/70 transition-all overflow-hidden text-left"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent group-hover:from-gold/15 transition-all"></div>
                    <div className="flex items-center gap-2 relative z-10">
                      <BookOpen className="w-4 h-4 text-gold/70 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-gold/90">
                          Explicar conceito
                        </div>
                        <div className="text-xs text-steel/70">Entenda o tema</div>
                      </div>
                    </div>
                  </button>

                  {isAnswered &&
                    !isCorrect &&
                    questao.tipoQuestao !== "DISSERTATIVA" && (
                      <button
                        onClick={() => handleAIHelp("error")}
                        className="w-full p-3 group relative bg-transparent border border-red-500/40 hover:border-red-500/70 transition-all overflow-hidden text-left"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent group-hover:from-red-500/15 transition-all"></div>
                        <div className="flex items-center gap-2 relative z-10">
                          <Lightbulb className="w-4 h-4 text-red-400/70 shrink-0" />
                          <div>
                            <div className="text-sm font-semibold text-red-400/90">
                              Onde errei?
                            </div>
                            <div className="text-xs text-steel/70">
                              Analise seu erro
                            </div>
                          </div>
                        </div>
                      </button>
                    )}
                </div>

                {/* AI Response */}
                {showAIHelp && (
                  <div className="mt-4 p-4 bg-navy-900/70 border border-gold/30 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-gold/70 shrink-0 mt-0.5" />
                      <div className="text-sm text-white flex-1 space-y-2">
                        {isLoadingAI ? (
                          <div className="flex items-center gap-2">
                            <span className="text-steel">Analisando...</span>
                            <div className="animate-spin h-4 w-4 border-b-2 border-gold"></div>
                          </div>
                        ) : (
                          <>
                            <p className="font-semibold text-gold text-xs">
                              {aiHelpType === "concept"
                                ? "📚 Conceito"
                                : "💡 Análise"}
                            </p>
                            <div className="text-steel text-xs leading-relaxed">
                              {aiExplanation ? (
                                aiExplanation
                                  .split("\n")
                                  .map((paragraph, index) => (
                                    <p key={index} className="mb-2 last:mb-0">
                                      {paragraph}
                                    </p>
                                  ))
                              ) : (
                                <p>Nenhuma explicação disponível.</p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Card - Melhorado */}
            <div className="group relative">
              <div className="absolute top-0 right-0 w-1 h-8 bg-gradient-to-b from-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-navy-800/40 via-navy-900/30 to-navy-950/40 backdrop-blur-md border border-gold/20 p-6 transition-all duration-300 hover:border-gold/30">
                {/* Cantos Decorativos */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gold/30" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gold/30" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gold/30" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gold/30" />

                <h3 className="font-semibold text-white mb-4 flex items-center gap-2 font-title">
                  <Trophy className="w-5 h-5 text-gold/70" />
                  Seu Desempenho
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gold/30 to-transparent border border-gold/20 transition-all hover:border-gold/40">
                    <span className="text-xs text-steel/80 font-medium">Pontos ganhos</span>
                    <span className="font-semibold text-gold">
                      +{pontosGanhos} pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 transition-all hover:border-gold/40">
                    <span className="text-xs text-steel/80 font-medium">Respondidas</span>
                    <span className="font-semibold text-gold">
                      {stats.questionsAnswered}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 transition-all hover:border-gold/40">
                    <span className="text-xs text-steel/80 font-medium">Taxa de acerto</span>
                    <span className="font-semibold text-gold">
                      {Math.round(stats.accuracy)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 transition-all hover:border-gold/40">
                    <span className="text-xs text-steel/80 font-medium">Sequência</span>
                    <span className="font-semibold text-gold flex gap-1 items-center">
                      <Flame className="h-4 w-4" />
                      {stats.currentStreak}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 transition-all hover:border-gold/40">
                    <span className="text-xs text-steel/80 font-medium">Melhor sequência</span>
                    <span className="font-semibold text-gold">
                      {stats.bestStreak}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Quiz Finalizado */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-navy-900 via-navy-950 to-navy-950 shadow-2xl shadow-gold/20 p-8 max-w-md w-full mx-4 border border-gold/30 overflow-hidden relative">
            {/* Cantos Decorativos */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold/40" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold/40" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold/40" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold/40" />

            <div className="text-center space-y-6">
              {/* Icon and Title */}
              <div className="inline-flex p-4 bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/40 rounded-lg shadow-lg shadow-gold/20">
                <Trophy className="w-10 h-10 text-gold" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-title font-bold bg-gradient-to-r from-gold via-gold-light to-gold text-transparent bg-clip-text">
                  Quiz Completo!
                </h2>
                <p className="text-sm text-steel/80">
                  Parabéns por terminar todas as questões!
                </p>
              </div>

              {/* Stats Summary */}
              <div className="bg-gradient-to-br from-navy-800/40 to-navy-900/40 border border-gold/20 p-5 space-y-3 backdrop-blur-sm">
                <div className="flex items-center justify-between pb-3 border-b border-gold/10">
                  <span className="text-sm text-steel/80 font-medium">Respondidas:</span>
                  <span className="font-semibold text-gold text-lg">
                    {stats.questionsAnswered}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gold/10">
                  <span className="text-sm text-steel/80 font-medium">Taxa de acerto:</span>
                  <span className="font-semibold text-green-400 text-lg">
                    {Math.round(stats.accuracy)}%
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-steel/80 font-medium">Pontos ganhos:</span>
                  <span className="font-title font-bold text-2xl text-gold">
                    +{pontosGanhos} pts
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <Link
                  to="/quizform"
                  className="w-full py-3 group relative bg-gradient-to-r from-gold/30 to-gold/15 border border-gold hover:border-gold-light text-gold font-semibold text-sm hover:from-gold/40 hover:to-gold/25 transition-all flex items-center justify-center gap-2 overflow-hidden"
                >
                  <Sparkles className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Praticar novamente</span>
                </Link>

                <Link
                  to="/"
                  className="w-full py-3 group relative bg-transparent border border-gold/40 hover:border-gold/70 text-gold/80 hover:text-gold font-semibold text-sm transition-all flex items-center justify-center gap-2 overflow-hidden"
                >
                  <Home className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Voltar ao início</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
