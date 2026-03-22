import React from 'react';

const HealthTrendsChart = () => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const bars = [40, 60, 45, 70, 85, 55, 30, 65, 40, 80, 50, 55];

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-brand-primary/5 h-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Health Trends & AI Insights</h3>
                <div className="flex gap-2">
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="size-2 rounded-full bg-brand-primary"></span> Consultations
                    </span>
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="size-2 rounded-full bg-brand-primary/30"></span> AI Detections
                    </span>
                </div>
            </div>

            <div className="relative h-64 w-full flex items-end justify-between gap-2">
                {bars.map((height, index) => (
                    <div
                        key={index}
                        className={`flex-1 rounded-t-lg relative transition-all duration-500 hover:opacity-80`}
                        style={{
                            height: `${height}%`,
                            backgroundColor: index === 4 ? '#1c5f21' : `color-mix(in srgb, #1c5f21 ${10 + (height / 100) * 50}%, transparent)`
                        }}
                    >
                        {index === 4 && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-md z-10">Peak</div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-between text-[11px] text-slate-400 font-bold px-2">
                {months.map(month => <span key={month}>{month}</span>)}
            </div>
        </div>
    );
};

export default HealthTrendsChart;
