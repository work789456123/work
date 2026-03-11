import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const data = await login(username, password);
            localStorage.setItem('token', data.access_token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side: Branding & Hero */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center bg-primary/10 p-12 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary/50 blur-3xl"></div>
                </div>
                <div className="relative z-10 max-w-lg text-center">
                    <div className="flex items-center justify-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
                                <path clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-primary tracking-tight">PashuVaani</h1>
                    </div>
                    <div className="mb-8 flex justify-center">
                        <div
                            className="w-64 h-64 bg-contain bg-no-repeat bg-center"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD1BT_oEVLPRqGTKA9ET3NlarRlE8-Ujg28eRzPW4BWWVFXxT7D0abXbudrYqQ9c6Uemuu4seoa27hp-yFTkVsUFb5Szt0LyFujQoyMkSBVLwmGC1-tsx0_nEb1UTStKxJ6sH3JXdV5hddpV-LvefvR4lEkNCfi-9ZfbVKwQ8u8yGSNbLxBFCYQBbVTmbOJjkbDMkMXVDaACZV7gYti6jO7B3AoThrmrbnGnWql03iU4-zAcc6CGU6zT-pnyuoCrMHrr6d8ZlumaKs')" }}
                            aria-label="Blue cute creature character Gopu AI waving friendly"
                        ></div>
                    </div>
                    <h2 className="text-4xl font-black mb-4 leading-tight">Welcome back, Admin.</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                        Let's care for them together. Gopu AI is here to help you manage animal health efficiently.
                    </p>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white dark:bg-background-dark">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>pets</span>
                        </div>
                        <h1 className="text-2xl font-black text-primary tracking-tight">PashuVaani</h1>
                    </div>
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold mb-2">Admin Sign In</h2>
                        <p className="text-slate-500 dark:text-slate-400">Please enter your credentials to access the dashboard.</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-lg border border-red-200 dark:border-red-800">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="username">
                                Username / Email Address
                            </label>
                            <input
                                className="w-full h-14 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                id="username"
                                name="username"
                                placeholder="admin"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">
                                    Password
                                </label>
                                <a className="text-sm font-semibold text-primary hover:underline transition-all" href="#">
                                    Forgot Password?
                                </a>
                            </div>
                            <div className="relative group">
                                <input
                                    className="w-full h-14 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors" type="button">
                                    <span className="material-symbols-outlined">visibility</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                                id="remember"
                                type="checkbox"
                            />
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400" htmlFor="remember">
                                Keep me signed in for 30 days
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/20 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                            {!isLoading && <span className="material-symbols-outlined">arrow_forward</span>}
                        </button>
                    </form>
                    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-slate-600 dark:text-slate-400">
                            New to PashuVaani?
                            <Link to="/signup" className="font-bold text-primary hover:underline ml-1">
                                Create an Admin Account
                            </Link>
                        </p>
                    </div>
                    {/* Accessibility Footer */}
                    <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-slate-400 uppercase tracking-widest font-bold">
                        <a className="hover:text-primary transition-colors" href="#">Help Center</a>
                        <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
