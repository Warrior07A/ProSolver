import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import logoImg from "../components/ui/Images/image2.png";
import Toast from "../components/ui/Toast";

export default function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const navigate = useNavigate();

    async function handleSignin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:3001/login", {
                email,
                password
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                setToast({ message: "Welcome back!", type: "success" });
                setTimeout(() => navigate("/dashboard"), 1000);
            } else {
                setToast({ message: "No token received from server.", type: "error" });
            }
        } catch (err: any) {
            setToast({ message: err.response?.data?.error || "Invalid email or password.", type: "error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center p-4 transition-colors duration-300">
            {/* Logo and Branding */}
            <div className="flex items-center gap-3 mb-8 text-center bg-gray-50/50 dark:bg-gray-950/50 p-3 rounded-2xl">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                    100<span className="text-blue-600 dark:text-blue-400">x</span>School
                </h1>
            </div>

            {/* Signin Card */}
            <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
                <div className="p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-500 dark:text-gray-400">Sign in to continue your journey.</p>
                    </div>

                    <form onSubmit={handleSignin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <a href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <p className="mt-8 text-sm text-gray-500 dark:text-gray-600">
                &copy; 2026 ProSolver. All rights reserved.
            </p>
        </div>
    );
}
