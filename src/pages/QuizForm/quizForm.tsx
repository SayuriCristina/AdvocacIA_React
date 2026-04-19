import { useState } from "react";
import {
  Target,
  Zap,
  ChevronRight,
  Sparkles,
  Clock,
  Landmark,
  Infinity,
  Flame,
  Dumbbell,
  Award,
  TrendingUp,
  Shuffle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function QuizForm() {
  const [selectedFase, setSelectedFase] = useState<string>("MISTA");
  const [selectedDificuldade, setSelectedDificuldade] =
    useState<string>("MISTA");
  const [questionsCount, setQuestionsCount] = useState<number | "unlimited">(
    10,
  );
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
  const navigate = useNavigate();

  const faseOptions = [
    {
      id: "MISTA",
      name: "Mista",
      IconComponent: Shuffle,
      color: "purple",
    },
    {
      id: "PRIMEIRA_FASE",
      name: "Primeira Fase",
      IconComponent: Award,
      color: "blue",
    },
    {
      id: "SEGUNDA_FASE",
      name: "Segunda Fase",
      IconComponent: TrendingUp,
      color: "green",
    },
  ];

  const dificuldadeOptions = [
    {
      id: "MISTA",
      name: "Mista",
      IconComponent: Shuffle,
      color: "purple",
      recommended: true,
    },
    { id: "FACIL", name: "Fácil", IconComponent: Zap, color: "green" },
    { id: "MEDIO", name: "Médio", IconComponent: Target, color: "yellow" },
    { id: "DIFICIL", name: "Difícil", IconComponent: Flame, color: "red" },
  ];

  const categoriasJuridicas = [
    { id: "CONSTITUCIONAL", name: "Constitucional" },
    { id: "ADMINISTRATIVO", name: "Administrativo" },
    { id: "CIVIL", name: "Civil" },
    { id: "PENAL", name: "Penal" },
    { id: "EMPRESARIAL", name: "Empresarial" },
    { id: "TRABALHO", name: "do Trabalho" },
    { id: "TRIBUTARIO", name: "Tributário" },
  ];

  const questionOptions = [
    { value: 5, label: "5 questões", time: "~10 min", IconComponent: Zap },
    {
      value: 10,
      label: "10 questões",
      time: "~20 min",
      IconComponent: Target,
      recommended: true,
    },
    { value: 20, label: "20 questões", time: "~40 min", IconComponent: Flame },
    {
      value: 50,
      label: "50 questões",
      time: "~100 min",
      IconComponent: Dumbbell,
    },
    {
      value: "unlimited" as const,
      label: "Ilimitado",
      time: "Sem limite",
      IconComponent: Infinity,
    },
  ];

  const handleStart = () => {
    if (
      (selectedFase === "SEGUNDA_FASE" || selectedFase === "MISTA") &&
      selectedCategorias.length === 0
    ) {
      alert(
        "Por favor, selecione pelo menos uma categoria jurídica para a Segunda Fase",
      );
      return;
    }

    const filters: any = {
      questionsCount: questionsCount,
    };

    if (selectedFase !== "MISTA") {
      filters.faseOAB = selectedFase;
    }

    if (selectedDificuldade !== "MISTA") {
      filters.dificuldade = selectedDificuldade;
    }

    if (selectedCategorias.length > 0) {
      filters.categorias = selectedCategorias;
    }

    navigate("/quiz", { state: { filters } });
  };

  const handleCategoriaToggle = (categoriaId: string) => {
    setSelectedCategorias((prev) =>
      prev.includes(categoriaId)
        ? prev.filter((c) => c !== categoriaId)
        : [...prev, categoriaId],
    );
  };

  const shouldShowCategorias =
    selectedFase === "SEGUNDA_FASE" || selectedFase === "MISTA";

  return (
    <>
      <div className="min-h-screen bg-navy-950 px-4 py-12 pt-20">
        <div className="max-w-5xl mx-auto">
          {/* Título */}
          <div className="text-center mb-12 space-y-4">
            <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-4">
              [ Configure sua sessão de estudos ]
            </span>
            <h1 className="font-title text-5xl font-bold text-white">
              Vamos começar!
            </h1>
            <p className="text-lg text-steel max-w-2xl mx-auto font-sans">
              Personalize sua experiência de estudos escolhendo as opções abaixo
            </p>
          </div>

          <div className="space-y-8">
            {/* Quantidade de Questões */}
            <div className="relative bg-navy-800/50 backdrop-blur-sm border-2 border-navy-700 p-8">
              {/* Cantos decorativos */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold/30 -translate-x-1 -translate-y-1" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold/30 translate-x-1 -translate-y-1" />

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gold/10 border border-gold/20 ">
                  <Target className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-title">
                    Quantas questões?
                  </h2>
                  <p className="text-sm text-steel">
                    Escolha a quantidade ideal para sua sessão
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {questionOptions.map((option) => {
                  const Icon = option.IconComponent;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setQuestionsCount(option.value)}
                      className={`relative p-6  border-2 transition-all duration-300 ${
                        questionsCount === option.value
                          ? "border-gold bg-gold/10 shadow-[0_4px_20px_rgba(201,168,76,0.3)] scale-105"
                          : "border-navy-700 bg-navy-900/50 hover:border-navy-600 hover:bg-navy-900"
                      }`}
                    >
                      {option.recommended && (
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-gold via-gold-light to-gold text-navy-950 text-xs font-bold px-3 py-1  shadow-lg font-mono">
                          Recomendado
                        </div>
                      )}
                      <div className="flex justify-center mb-3">
                        <Icon
                          className={`w-10 h-10 ${questionsCount === option.value ? "text-gold" : "text-steel"}`}
                        />
                      </div>
                      <div
                        className={`font-bold mb-1 ${
                          questionsCount === option.value
                            ? "text-gold"
                            : "text-silver"
                        }`}
                      >
                        {option.label}
                      </div>
                      <div
                        className={`text-sm flex items-center justify-center gap-1 ${
                          questionsCount === option.value
                            ? "text-gold"
                            : "text-steel"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {option.time}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fase OAB */}
            <div className="relative bg-navy-800/50 backdrop-blur-sm border-2 border-navy-700 p-8">
              {/* Cantos decorativos */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold/30 -translate-x-1 -translate-y-1" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold/30 translate-x-1 -translate-y-1" />

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gold/10 border border-gold/20 ">
                  <Award className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-title">
                    Qual fase da OAB?
                  </h2>
                  <p className="text-sm text-steel">
                    Escolha a fase que deseja praticar
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {faseOptions.map((fase) => {
                  const Icon = fase.IconComponent;
                  const isSelected = selectedFase === fase.id;
                  return (
                    <button
                      key={fase.id}
                      onClick={() => setSelectedFase(fase.id)}
                      className={`p-4  border-2 transition-all duration-300 ${
                        isSelected
                          ? "border-gold bg-gold/10 scale-105 shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                          : "border-navy-700 bg-navy-900/50 hover:border-navy-600"
                      }`}
                    >
                      <div className="flex justify-center mb-2">
                        <Icon
                          className={`w-8 h-8 ${isSelected ? "text-gold" : "text-steel"}`}
                        />
                      </div>
                      <div
                        className={`font-semibold text-sm ${isSelected ? "text-gold" : "text-silver"}`}
                      >
                        {fase.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dificuldade */}
            <div className="relative bg-navy-800/50 backdrop-blur-sm border-2 border-navy-700 p-8">
              {/* Cantos decorativos */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold/30 -translate-x-1 -translate-y-1" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold/30 translate-x-1 -translate-y-1" />

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gold/10 border border-gold/20 ">
                  <TrendingUp className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-title">
                    Nível de dificuldade
                  </h2>
                  <p className="text-sm text-steel">
                    Selecione o nível que combina com seu preparo
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {dificuldadeOptions.map((dificuldade) => {
                  const Icon = dificuldade.IconComponent;
                  const isSelected = selectedDificuldade === dificuldade.id;
                  return (
                    <button
                      key={dificuldade.id}
                      onClick={() => setSelectedDificuldade(dificuldade.id)}
                      className={`relative p-4  border-2 transition-all duration-300 ${
                        isSelected
                          ? "border-gold bg-gold/10 scale-105 shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                          : "border-navy-700 bg-navy-900/50 hover:border-navy-600"
                      }`}
                    >
                      {dificuldade.recommended && (
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-gold via-gold-light to-gold text-navy-950 text-xs font-bold px-3 py-1  shadow-lg font-mono">
                          Recomendado
                        </div>
                      )}
                      <div className="flex justify-center mb-2">
                        <Icon
                          className={`w-8 h-8 ${isSelected ? "text-gold" : "text-steel"}`}
                        />
                      </div>
                      <div
                        className={`font-semibold text-sm ${isSelected ? "text-gold" : "text-silver"}`}
                      >
                        {dificuldade.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categorias Jurídicas - Segunda Fase */}
            {shouldShowCategorias && (
              <div className="relative bg-navy-800/50 backdrop-blur-sm border-2 border-gold/30 p-8">
                {/* Cantos decorativos */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold/30 -translate-x-1 -translate-y-1" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold/30 translate-x-1 -translate-y-1" />

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gold/10 border border-gold/20 ">
                    <Landmark className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-title">
                      Categorias Jurídicas
                    </h2>
                    <p className="text-sm text-steel">
                      Selecione uma ou mais categorias para a Segunda Fase
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categoriasJuridicas.map((categoria) => (
                    <button
                      key={categoria.id}
                      onClick={() => handleCategoriaToggle(categoria.id)}
                      className={`p-4  border-2 transition-all duration-300 ${
                        selectedCategorias.includes(categoria.id)
                          ? "bg-gold/10 text-gold border-gold scale-105 shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                          : "bg-navy-900/50 text-silver border-navy-700 hover:border-navy-600 hover:bg-navy-900"
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        Direito {categoria.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resumo e Botão Iniciar */}
            <div className="relative bg-gradient-to-r from-gold/20 to-gold-light/20 border-2 border-gold/30 p-8 overflow-hidden">
              {/* Cantos decorativos */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold -translate-x-1 -translate-y-1" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold translate-x-1 -translate-y-1" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold -translate-x-1 translate-y-1" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold translate-x-1 translate-y-1" />

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gold mb-4 font-title">
                    Sua sessão de estudos
                  </h3>
                  <div className="space-y-2 text-gold/80">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      <span className="font-sans">
                        {questionsCount === "unlimited"
                          ? "Modo ilimitado"
                          : `${questionsCount} questões`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      <span className="font-sans">
                        {faseOptions.find((f) => f.id === selectedFase)?.name ||
                          "Primeira Fase"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-sans">
                        {dificuldadeOptions.find(
                          (d) => d.id === selectedDificuldade,
                        )?.name || "Médio"}
                      </span>
                    </div>
                    {shouldShowCategorias && selectedCategorias.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Landmark className="w-5 h-5" />
                        <span className="font-sans">
                          {selectedCategorias
                            .map(
                              (id) =>
                                categoriasJuridicas.find((c) => c.id === id)
                                  ?.name,
                            )
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  className="group relative px-10 py-5 bg-transparent border border-gold text-gold font-mono text-sm uppercase tracking-wider font-bold overflow-hidden transition-all duration-300 hover:shadow-[0_4px_20px_rgba(201,168,76,0.4)] flex items-center gap-3"
                >
                  <span className="relative z-10 flex items-center gap-3 group-hover:text-navy-950 transition-colors">
                    <Zap className="w-5 h-5" />
                    Começar Agora
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuizForm;
