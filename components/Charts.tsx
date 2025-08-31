
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import type { ChartDataPoint } from '../types';

interface ChartProps {
    data: ChartDataPoint[];
}

const COLORS = ['#06b6d4', '#6366f1', '#ec4899', '#f97316'];

export const WeightChart: React.FC<ChartProps> = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" label={{ value: 'kg', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            borderColor: '#334155',
                            color: '#e2e8f0'
                        }}
                    />
                    <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                    <Bar dataKey="value" name="Peso" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};


export const ActivityChart: React.FC<ChartProps> = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            borderColor: '#334155',
                            color: '#e2e8f0'
                        }}
                    />
                    <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
