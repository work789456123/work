import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { fetchBlogs } from '../services/api';

const KnowledgeBasePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [articles, setArticles] = useState<any[]>([]);

    const categories = ['All', 'Disease Management', 'Nutrition', 'AI Guides', 'Govt Schemes'];

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                const data = await fetchBlogs();
                const mappedArticles = data.map((blog: any) => ({
                    title: blog.title,
                    category: blog.description || 'General',
                    readTime: '5 min read',
                    icon: blog.description?.includes('AI') ? 'memory' : 'auto_stories',
                    color: blog.description?.includes('AI') ? 'text-blue-500' : 'text-primary',
                    bg: blog.description?.includes('AI') ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-primary/5',
                    content: blog.content
                }));
                setArticles(mappedArticles);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };
        loadBlogs();
    }, []);

    const filteredArticles = articles.filter(article => {
        const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark relative">
                <Header />

                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-1/2 h-96 bg-primary/5 rounded-bl-[100%] pointer-events-none"></div>

                <div className="flex-1 overflow-y-auto p-8 relative z-10">
                    <div className="max-w-6xl mx-auto space-y-8">

                        {/* Hero Search Section */}
                        <div className="text-center py-8 space-y-6 max-w-2xl mx-auto">
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">How can we help you today?</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">Search our comprehensive library of veterinary best practices, farming guidelines, and AI system tutorials.</p>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-800 border-2 border-primary/10 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white text-lg focus:ring-0 focus:border-primary transition-colors shadow-sm"
                                    placeholder="Search for diseases, symptoms, or guides..."
                                />
                                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                                    <button className="bg-primary hover:bg-primary-dark transition-colors text-white px-6 py-2 rounded-xl font-bold text-sm shadow-sm active:scale-95">Search</button>
                                </div>
                            </div>
                        </div>

                        {/* Category Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeCategory === category
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-primary/10 hover:border-primary/30 hover:shadow-sm'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Articles Grid */}
                        <div className="pt-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {activeCategory === 'All' ? 'Latest Resources' : `${activeCategory} Resources`}
                                </h3>
                                <span className="text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                    {filteredArticles.length} Articles
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredArticles.map((article, index) => (
                                    <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-primary/10 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`size-12 rounded-xl flex items-center justify-center ${article.bg} ${article.color}`}>
                                                <span className="material-symbols-outlined text-2xl">{article.icon}</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-md">{article.category}</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h4>
                                        <div className="mt-auto pt-6 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                {article.readTime}
                                            </span>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors group-hover:translate-x-1">arrow_forward</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredArticles.length === 0 && (
                                <div className="text-center py-16 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-primary/20">
                                    <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">search_off</span>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No articles found</h3>
                                    <p className="text-slate-500">Try adjusting your search or category filter.</p>
                                    <button
                                        onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                                        className="mt-6 text-primary font-bold hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default KnowledgeBasePage;
