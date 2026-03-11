const HealthTrendsChart: React.FC = () => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
    const bars = [40, 60, 45, 80, 55, 65]; // 6 months data

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-primary/5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Health Trends & Insights</h3>
                <div className="relative">
                    <select className="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-primary/50 transition-colors cursor-pointer">
                        <option>Last 6 Months</option>
                        <option>Year to Date</option>
                        <option>Last 12 Months</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-slate-400 pointer-events-none">expand_more</span>
                </div>
            </div>

            <div className="relative flex-1 w-full flex items-end justify-between gap-4 mt-auto">
                {bars.map((height, index) => (
                    <div
                        key={index}
                        className={`flex-1 rounded-t-lg relative transition-all duration-500 hover:opacity-80`}
                        style={{
                            height: `${height}%`,
                            backgroundColor: index === 3 ? 'var(--color-primary)' : `color-mix(in srgb, var(--color-primary) ${10 + (height / 100) * 50}%, transparent)`
                        }}
                    >
                        {index === 3 && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded">Peak</div>
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
