
import React, { useState, useCallback } from 'react';
import { generateReport } from './services/geminiService';
import type { StructuredReport } from './types';
import Report from './components/Report';
import Loader from './components/Loader';

const App: React.FC = () => {
    const [rawData, setRawData] = useState<string>('');
    const [reportData, setReportData] = useState<StructuredReport | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateReport = useCallback(async () => {
        if (!rawData.trim()) {
            setError('Por favor, cole os dados do formulário na área de texto.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setReportData(null);

        try {
            const report = await generateReport(rawData);
            setReportData(report);
        } catch (err) {
            console.error(err);
            setError('Ocorreu um erro ao gerar o relatório. Verifique os dados e tente novamente. Detalhe: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setIsLoading(false);
        }
    }, [rawData]);

    const placeholderText = `Cole aqui os dados brutos do formulário, separados por quebras de linha.
Exemplo:
10/07/2024 10:30:15
João da Silva
35
Masculino
1.80m
95kg
80kg
Nenhuma
Não
Sim, com nutricionista
Considero regular, com muitos industrializados
3
Lactose
Cerca de 1.5L
Sedentário
Caminhada e musculação
6 horas
Falta de tempo e organização
Melhorar a saúde e disposição
Plano detalhado por e-mail
Alto
Churrasco e massas
Doces e refrigerantes
Nenhuma
Sim, halteres e elásticos
(11) 98765-4321
`;

    return (
        <div className="min-h-screen bg-slate-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse">
                        NutriGen AI
                    </h1>
                    <p className="text-lg text-slate-400 mt-2">Seu Relatório de Saúde e Fitness Premium, Gerado por IA</p>
                </header>

                <main>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-cyan-300">1. Insira os Dados do Formulário</h2>
                        <textarea
                            value={rawData}
                            onChange={(e) => setRawData(e.target.value)}
                            placeholder={placeholderText}
                            className="w-full h-64 p-4 bg-slate-900 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 text-slate-300 resize-none"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleGenerateReport}
                            disabled={isLoading}
                            className="mt-6 w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? 'Gerando Relatório...' : 'Gerar Relatório Premium'}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-8" role="alert">
                            <strong className="font-bold">Erro! </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {isLoading && <Loader />}

                    {reportData && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-bold text-center mb-6 text-cyan-300">2. Seu Relatório Personalizado</h2>
                            <Report data={reportData} />
                        </div>
                    )}
                </main>
                <footer className="text-center mt-12 text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} NutriGen AI. Todos os direitos reservados.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
