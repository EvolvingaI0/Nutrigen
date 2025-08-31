
import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Analisando seu perfil...",
    "Calculando suas necessidades calóricas...",
    "Consultando as melhores práticas de nutrição...",
    "Elaborando seu plano de ação personalizado...",
    "Desenhando seus gráficos de progresso...",
    "Quase pronto! Finalizando seu relatório premium..."
];

const Loader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-slate-300 font-semibold text-center transition-opacity duration-500">
                {loadingMessages[messageIndex]}
            </p>
        </div>
    );
};

export default Loader;
