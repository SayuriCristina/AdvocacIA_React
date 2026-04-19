import OpenAI from 'openai';

export type AIHelpType = 'concept' | 'error' | 'essay';

export interface EssayValidationResult {
    isCorrect: boolean;
    score: number; // 0-100
    feedback: string;
    missingPoints: string[];
    unnecessaryPoints: string[];
    corrections: string;
}

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
        "X-Title": "AdvocacIA",
        "HTTP-Referer": window.location.origin,
    },
});

const SYSTEM_PROMPT = `Você é um especialista em Direito Brasileiro com ampla experiência no exame de Ordem dos Advogados do Brasil (OAB). 
Sua responsabilidade é:
1. Explicar conceitos jurídicos de forma clara e pedagógica, sem fornecer a resposta direta
2. Ajudar o estudante a compreender os fundamentos legais e jurisprudenciais
3. Validar respostas dissertativas com rigor, considerando:
   - Precisão jurídica
   - Conhecimento da Lei e jurisprudência relevante
   - Estrutura argumentativa
   - Completude da resposta esperada para nível OAB
4. Fornecer feedback construtivo e educativo

Sempre mantenha a linguagem formal e técnica apropriada ao Direito brasileiro. Seja justo na avaliação, reconhecendo respostas parcialmente corretas.`;

export async function getAIExplanation(
    question: any,
    selectedOption: string | null,
    helpType: AIHelpType,
    studentAnswer?: string
): Promise<string> {
    try {
        if (!question) {
            return 'Questão não disponível para análise.';
        }

        const assunto = question.assunto || 'Não especificado';
        const enunciado = question.enunciado || 'Enunciado não disponível';
        const respostaCorreta = question.resposta || 'Não especificada';

        let prompt = '';

        if (helpType === 'concept') {
            prompt = `Como especialista em OAB, explique o conceito jurídico fundamental necessário para resolver esta questão, SEM fornecer a resposta direta:

ÁREA DE DIREITO: ${assunto}
ENUNCIADO: ${enunciado}

Instruções:
- Explique o conceito teórico e legal relevante
- Mencione a base legal (LEI/artigos aplicáveis)
- Explique jurisprudência ou dourina relevante se aplicável
- Não mencione as alternativas de resposta
- Não revele qual é a resposta correta
- Use linguagem técnica apropriada ao Direito
- Estruture em 2-3 parágrafos bem desenvolvidos`;

        } else if (helpType === 'error') {
            prompt = `Como especialista em OAB, analise o erro jurídico cometido nesta questão:

ÁREA DE DIREITO: ${assunto}
ENUNCIADO: ${enunciado}
RESPOSTA DO ESTUDANTE: ${selectedOption || 'Não selecionada'}
RESPOSTA CORRETA: ${respostaCorreta}

Instruções:
- Identifique qual foi o erro jurídico
- Explique por que a resposta do estudante está incorreta
- Aponte qual é o conceito correto
- Mencione a base legal ou jurisprudência relevante
- Seja construtivo e educativo
- Use linguagem técnica apropriada
- Estruture em 2-3 parágrafos bem desenvolvidos`;

        } else if (helpType === 'essay') {
            prompt = `Como especialista em OAB, forneça uma análise aprofundada sobre a resposta dissertativa do estudante:

ÁREA DE DIREITO: ${assunto}
ENUNCIADO: ${enunciado}
RESPOSTA DO ESTUDANTE: "${studentAnswer || 'Resposta não disponível'}"

Instruções:
- Analise os pontos fortes da resposta
- Identifique conceitos jurídicos que deveriam ser melhor desenvolvidos
- Sugira como estruturar melhor a resposta
- Cite legislação ou jurisprudência relevante que enriqueceria a resposta
- Seja pedagógico e construtivo
- Forneça exemplos práticos se aplicável
- Estruture em 2-3 parágrafos bem desenvolvidos`;
        }

        const completion = await openai.chat.completions.create({
            model: "arcee-ai/trinity-large-preview:free",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 800,
            temperature: 0.3,
        });

        const choice = completion.choices[0];
        if (!choice) {
            return 'Não foi possível gerar uma resposta.';
        }

        let response = choice.message?.content || '';

        if (isResponseCutOff(response)) {
            return await getCompleteExplanation(question, helpType);
        }

        return response;

    } catch (error) {
        return 'Erro ao carregar a explicação. Tente novamente.';
    }
}

export async function validateEssayAnswer(
    question: any,
    studentAnswer: string
): Promise<EssayValidationResult> {
    try {
        if (!question || !studentAnswer.trim()) {
            return {
                isCorrect: false,
                score: 0,
                feedback: 'Resposta vazia ou questão não disponível.',
                missingPoints: [],
                unnecessaryPoints: [],
                corrections: 'Forneça uma resposta dissertativa completa.'
            };
        }

        const assunto = question.assunto || 'Não especificado';
        const enunciado = question.enunciado || 'Enunciado não disponível';
        const respostaCorreta = question.respostaEsperada || 'Não especificada';

        const prompt = `Como especialista em OAB, avalie a seguinte resposta dissertativa do estudante:

ÁREA DE DIREITO: ${assunto}
ENUNCIADO DA QUESTÃO: ${enunciado}
RESPOSTA DO ESTUDANTE: "${studentAnswer}"
RESPOSTA ESPERADA: ${respostaCorreta}

Você deve:
1. Avaliar se a resposta está CORRETA (corresponde aos pontos essenciais), PARCIALMENTE CORRETA (contém elementos corretos mas incompleta), ou INCORRETA
2. Atribuir uma pontuação de 0-100
3. Listar os pontos principais que FALTARAM na resposta
4. Listar conceitos ou informações DESNECESSÁRIAS ou INCORRETAS mencionados
5. Fornecer feedback educativo explicando o que deveria estar na resposta

Responda em JSON (sem markdown, apenas JSON válido) com esta estrutura exata:
{
    "isCorrect": true/false,
    "score": número,
    "feedback": "sua avaliação aqui",
    "missingPoints": ["ponto 1", "ponto 2"],
    "unnecessaryPoints": ["conceito desnecessário"],
    "corrections": "o que deveria estar na resposta"
}`;

        const completion = await openai.chat.completions.create({
            model: "arcee-ai/trinity-large-preview:free",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1000,
            temperature: 0.4,
        });

        const responseContent = completion.choices[0]?.message?.content || '';
        
        // Tenta fazer parse do JSON retornado
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return {
                isCorrect: false,
                score: 50,
                feedback: 'Não foi possível avaliar a resposta corretamente. Tente novamente.',
                missingPoints: [],
                unnecessaryPoints: [],
                corrections: 'Verifique a formatação da sua resposta.'
            };
        }

        const result = JSON.parse(jsonMatch[0]) as EssayValidationResult;
        
        // Validação dos dados retornados
        if (typeof result.score !== 'number' || result.score < 0 || result.score > 100) {
            result.score = Math.min(100, Math.max(0, result.score));
        }
        
        if (typeof result.isCorrect !== 'boolean') {
            result.isCorrect = result.score >= 70;
        }

        return result;

    } catch (error) {
        console.error('Erro ao validar resposta dissertativa:', error);
        return {
            isCorrect: false,
            score: 0,
            feedback: 'Erro ao processar a avaliação. Tente novamente.',
            missingPoints: [],
            unnecessaryPoints: [],
            corrections: 'Verifique sua conexão e tente novamente.'
        };
    }
}

function isResponseCutOff(response: string): boolean {
    if (!response) return false;

    const endsWithCutOff = /[^.!?]\s*$/.test(response.trim());
    const lastWord = response.trim().split(/\s+/).pop() || '';
    const hasCutWord = lastWord.length > 0 && lastWord.length < 3;
    const isTooShort = response.length < 150;

    return endsWithCutOff || hasCutWord || isTooShort;
}

async function getCompleteExplanation(
    question: any,
    helpType: AIHelpType
): Promise<string> {
    try {
        const assunto = question.assunto || 'Não especificado';
        
        let prompt = '';
        
        if (helpType === 'concept') {
            prompt = `Complete e expanda esta explicação jurídica sobre ${assunto}. Forneça uma resposta final bem estruturada e completa, com base legal e conceituação adequada ao nível do exame de OAB.`;
        } else {
            prompt = `Complete e expanda esta análise de erro jurídico sobre ${assunto}. Forneça uma resposta final bem estruturada e completa, explicando o conceito correto com base legal e doutrina relevante.`;
        }

        const completion = await openai.chat.completions.create({
            model: "arcee-ai/trinity-large-preview:free",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 800,
            temperature: 0.3,
        });

        return completion.choices[0]?.message?.content || 'Não foi possível completar a explicação.';
    } catch (error) {
        return 'Erro ao completar a explicação.';
    }
}