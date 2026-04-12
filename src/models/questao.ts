type Resposta = "A" | "B" | "C" | "D";

type FaseOAB = "PRIMEIRA_FASE" | "SEGUNDA_FASE";

type Dificuldade = "FACIL" | "MEDIO" | "DIFICIL";

type TipoQuestao = "MULTIPLA_ESCOLHA" | "DISSERTATIVA";

export default interface Questao {
    id: number;
    enunciado: string;
    alternativaA?: string;
    alternativaB?: string;
    alternativaC?: string;
    alternativaD?: string;
    resposta?: Resposta;
    respostaCerta?: string;
    assunto: string;
    faseOAB: FaseOAB;
    dificuldade: Dificuldade;
    tipoQuestao: TipoQuestao;
}