
import { GoogleGenAI, Type } from "@google/genai";
import type { StructuredReport } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const reportSchema = {
    type: Type.OBJECT,
    properties: {
        profileSummary: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                age: { type: Type.INTEGER },
                sex: { type: Type.STRING },
                height: { type: Type.STRING },
                currentWeight: { type: Type.NUMBER },
                targetWeight: { type: Type.NUMBER },
                bmi: { type: Type.NUMBER },
                bmiCategory: { type: Type.STRING },
            },
            required: ['name', 'age', 'sex', 'height', 'currentWeight', 'targetWeight', 'bmi', 'bmiCategory']
        },
        nutritionalAnalysis: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING },
                dailyMeals: { type: Type.INTEGER },
                waterIntake: { type: Type.STRING },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['summary', 'dailyMeals', 'waterIntake', 'recommendations']
        },
        physicalAnalysis: {
            type: Type.OBJECT,
            properties: {
                activityLevel: { type: Type.STRING },
                preferredActivities: { type: Type.STRING },
                sleepHours: { type: Type.NUMBER },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['activityLevel', 'preferredActivities', 'sleepHours', 'recommendations']
        },
        goalsAndMotivation: {
            type: Type.OBJECT,
            properties: {
                mainChallenge: { type: Type.STRING },
                mainMotivation: { type: Type.STRING },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['mainChallenge', 'mainMotivation', 'recommendations']
        },
        customPreferences: {
            type: Type.OBJECT,
            properties: {
                likedFoods: { type: Type.ARRAY, items: { type: Type.STRING } },
                foodsToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['likedFoods', 'foodsToAvoid']
        },
        actionPlan: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                introduction: { type: Type.STRING },
                dietarySteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                exerciseSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                lifestyleSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['title', 'introduction', 'dietarySteps', 'exerciseSteps', 'lifestyleSteps']
        },
        conclusion: {
            type: Type.OBJECT,
            properties: {
                finalMessage: { type: Type.STRING }
            },
            required: ['finalMessage']
        },
        charts: {
            type: Type.OBJECT,
            properties: {
                weightComparison: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            value: { type: Type.NUMBER },
                        }
                    }
                },
                activityDistribution: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            value: { type: Type.NUMBER },
                        }
                    }
                },
            },
            required: ['weightComparison', 'activityDistribution']
        }
    },
    required: ['profileSummary', 'nutritionalAnalysis', 'physicalAnalysis', 'goalsAndMotivation', 'customPreferences', 'actionPlan', 'conclusion', 'charts']
};


const formQuestions = [
  "1. Carimbo de data/hora", "2. Nome completo", "3. Idade", "4. Sexo", "5. Altura", "6. Peso atual", "7. Peso desejado ou meta", "8. Você possui alguma condição médica relevante?", "9. Está fazendo uso de algum medicamento atualmente?", "10. Já realizou algum acompanhamento nutricional ou de emagrecimento antes?", "11. Como você descreveria sua alimentação atual?", "12. Quantas refeições você faz por dia em média?", "13. Você tem restrições alimentares?", "14. Consumo de água diário", "15. Qual seu nível de atividade física atual?", "16. Que tipo de atividade física você prefere ou pode praticar?", "17. Quantas horas de sono você tem em média por noite?", "18. Qual seu maior desafio para emagrecer?", "19. Qual é a sua motivação principal para emagrecer?", "20. Qual formato de acompanhamento você prefere receber?", "21. Qual nível de personalização você deseja para o seu plano?", "22. Quais alimentos você gosta muito e não quer cortar?", "23. Quais alimentos você tem dificuldade de evitar?", "24. Você tem alguma alergia alimentar?", "25. Você possui algum equipamento ou espaço em casa para treinar?", "26. Qual o seu número de WhatsApp (com DDD)?"
].join("\n");


export const generateReport = async (rawData: string): Promise<StructuredReport> => {
    const prompt = `
        Você é um especialista de classe mundial em nutrição, saúde e fitness. Sua tarefa é transformar os seguintes dados brutos de um formulário em um RELATÓRIO PREMIUM PROFISSIONAL em formato JSON, seguindo estritamente o schema fornecido.

        Os dados brutos seguem esta ordem oficial de perguntas:
        ${formQuestions}

        Tarefa:
        1. Analise os dados brutos do usuário abaixo.
        2. Calcule o IMC (Índice de Massa Corporal) usando a fórmula peso(kg) / (altura(m) * altura(m)). Extraia os números de altura e peso para o cálculo. Classifique o IMC em: Abaixo do peso (<18.5), Peso normal (18.5-24.9), Sobrepeso (25-29.9), Obesidade Grau I (30-34.9), Obesidade Grau II (35-39.9), Obesidade Grau III (>=40).
        3. Preencha todos os campos do schema JSON com análises detalhadas, insights profissionais e recomendações personalizadas.
        4. Crie dados para os gráficos: 'weightComparison' deve conter dois objetos, um para o peso atual e outro para o peso meta. 'activityDistribution' deve representar o nível de atividade do usuário (ex: {name: 'Sedentário', value: 100}).
        5. Use uma linguagem clara, profissional, motivadora e empática.
        6. O idioma de todo o relatório, incluindo nomes de chaves nos dados do gráfico, deve ser Português do Brasil.

        Dados brutos do usuário:
        ---
        ${rawData}
        ---

        Gere a resposta JSON completa.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: reportSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText) as StructuredReport;
        return parsedJson;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Falha na comunicação com a IA para gerar o relatório.");
    }
};
