
import React from 'react';
import type { StructuredReport, TableRow } from '../types';
import { WeightChart, ActivityChart } from './Charts';

interface ReportProps {
    data: StructuredReport;
}

const ReportSection: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1">
        <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center">
            {icon && <span className="mr-3">{icon}</span>}
            {title}
        </h3>
        <div className="space-y-4 text-slate-300">{children}</div>
    </div>
);

const InfoCard: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
    <div className="bg-slate-900 p-4 rounded-lg text-center">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-cyan-300">
            {value} <span className="text-lg text-slate-400">{unit}</span>
        </p>
    </div>
);

const CheckListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>{children}</span>
    </li>
);

const Report: React.FC<ReportProps> = ({ data }) => {

    const preferenceTableData: TableRow[] = [];
    const maxLength = Math.max(data.customPreferences.likedFoods.length, data.customPreferences.foodsToAvoid.length);
    for(let i=0; i<maxLength; i++) {
        preferenceTableData.push({
            liked: data.customPreferences.likedFoods[i] || '-',
            avoid: data.customPreferences.foodsToAvoid[i] || '-'
        });
    }

    return (
        <div className="space-y-8">
            {/* Profile Summary */}
            <ReportSection title="Resumo do Perfil" icon={<UserIcon />}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoCard label="Nome" value={data.profileSummary.name} />
                    <InfoCard label="Idade" value={data.profileSummary.age} unit="anos" />
                    <InfoCard label="Altura" value={data.profileSummary.height} />
                    <InfoCard label="Sexo" value={data.profileSummary.sex} />
                    <InfoCard label="Peso Atual" value={data.profileSummary.currentWeight} unit="kg" />
                    <InfoCard label="Peso Meta" value={data.profileSummary.targetWeight} unit="kg" />
                    <InfoCard label="IMC" value={data.profileSummary.bmi.toFixed(1)} />
                    <InfoCard label="Categoria IMC" value={data.profileSummary.bmiCategory} />
                </div>
            </ReportSection>

            {/* Visualizations */}
            <ReportSection title="Visualizações Gráficas" icon={<ChartIcon />}>
                 <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h4 className="text-xl font-semibold text-center mb-2 text-slate-200">Peso Atual vs. Meta</h4>
                        <WeightChart data={data.charts.weightComparison} />
                    </div>
                    <div>
                         <h4 className="text-xl font-semibold text-center mb-2 text-slate-200">Nível de Atividade Física</h4>
                        <ActivityChart data={data.charts.activityDistribution} />
                    </div>
                </div>
            </ReportSection>
            
            {/* Nutritional & Physical Analysis */}
            <div className="grid lg:grid-cols-2 gap-8">
                <ReportSection title="Análise Nutricional" icon={<NutritionIcon />}>
                    <p className="italic">"{data.nutritionalAnalysis.summary}"</p>
                    <ul className="space-y-2 list-inside">
                        <CheckListItem>Refeições por dia: <span className="font-bold">{data.nutritionalAnalysis.dailyMeals}</span></CheckListItem>
                        <CheckListItem>Consumo de água: <span className="font-bold">{data.nutritionalAnalysis.waterIntake}</span></CheckListItem>
                    </ul>
                    <h4 className="font-semibold text-lg mt-4 text-slate-100">Recomendações:</h4>
                    <ul className="space-y-2 list-disc list-inside pl-2">
                        {data.nutritionalAnalysis.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                </ReportSection>
                <ReportSection title="Análise Física" icon={<FitnessIcon />}>
                    <p>Nível de atividade atual: <span className="font-bold">{data.physicalAnalysis.activityLevel}</span>.</p>
                    <p>Horas de sono: <span className="font-bold">{data.physicalAnalysis.sleepHours}h por noite</span>.</p>
                     <h4 className="font-semibold text-lg mt-4 text-slate-100">Recomendações:</h4>
                    <ul className="space-y-2 list-disc list-inside pl-2">
                         {data.physicalAnalysis.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                </ReportSection>
            </div>
            
             {/* Goals and Preferences */}
            <div className="grid lg:grid-cols-2 gap-8">
                <ReportSection title="Objetivos e Motivação" icon={<TargetIcon />}>
                    <p><span className="font-semibold text-slate-100">Maior Desafio:</span> {data.goalsAndMotivation.mainChallenge}</p>
                    <p><span className="font-semibold text-slate-100">Principal Motivação:</span> {data.goalsAndMotivation.mainMotivation}</p>
                    <h4 className="font-semibold text-lg mt-4 text-slate-100">Recomendações:</h4>
                    <ul className="space-y-2 list-disc list-inside pl-2">
                        {data.goalsAndMotivation.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                </ReportSection>
                 <ReportSection title="Preferências Alimentares" icon={<FoodIcon />}>
                   <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    <th className="p-3 font-semibold text-green-400">Alimentos que Gosta</th>
                                    <th className="p-3 font-semibold text-red-400">Difíceis de Evitar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {preferenceTableData.map((row, i) => (
                                    <tr key={i} className="border-b border-slate-700">
                                        <td className="p-3">{row.liked}</td>
                                        <td className="p-3">{row.avoid}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                   </div>
                </ReportSection>
            </div>

            {/* Action Plan */}
            <ReportSection title={data.actionPlan.title} icon={<PlanIcon />}>
                <p>{data.actionPlan.introduction}</p>
                <div>
                    <h4 className="font-semibold text-lg mt-4 text-slate-100">Estratégia Nutricional:</h4>
                    <ul className="space-y-2 list-decimal list-inside pl-2">
                        {data.actionPlan.dietarySteps.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-lg mt-4 text-slate-100">Plano de Atividade Física:</h4>
                    <ul className="space-y-2 list-decimal list-inside pl-2">
                        {data.actionPlan.exerciseSteps.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-lg mt-4 text-slate-100">Ajustes no Estilo de Vida:</h4>
                    <ul className="space-y-2 list-decimal list-inside pl-2">
                        {data.actionPlan.lifestyleSteps.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                </div>
            </ReportSection>

            {/* Conclusion */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 rounded-xl shadow-lg text-white text-center">
                 <h3 className="text-2xl font-bold mb-2">Conclusão Premium</h3>
                 <p className="text-lg">{data.conclusion.finalMessage}</p>
            </div>
        </div>
    );
};

// SVG Icons
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;
const NutritionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 4v4m-2-2h4M17 3v4m-2-2h4M5 21v-4m-2 2h4m5-4v4m-2-2h4" /></svg>;
const FitnessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const FoodIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PlanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;

export default Report;
