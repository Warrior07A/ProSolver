import CreatePostDialog from "../components/ui/CreatePostDialog";
import { ProblemCard } from "../components/ui/ProblemCard";
import Sidebar from "../components/ui/Sidebar";
import { SearchBar } from "../components/ui/SearchBar";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { Plus, Search, ArrowUpDown, Clock, ArrowDownAZ, ArrowUpAZ, History, Moon, Sun, LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import logoImg from "../components/ui/Images/image.png";
import { useNavigate } from "react-router-dom";

type SortOrder = "latest" | "oldest" | "a-z" | "z-a";

const SORT_OPTIONS: { value: SortOrder; label: string; icon: React.ReactNode }[] = [
    { value: "latest", label: "Latest Updated", icon: <Clock size={15} /> },
    { value: "oldest", label: "Oldest First", icon: <History size={15} /> },
    { value: "a-z", label: "Title A → Z", icon: <ArrowDownAZ size={15} /> },
    { value: "z-a", label: "Title Z → A", icon: <ArrowUpAZ size={15} /> },
];

function applySorting(arr: any[], order: SortOrder): any[] {
    const copy = [...arr];
    switch (order) {
        case "latest":
            return copy;
        case "oldest":
            return copy.reverse();
        case "a-z":
            return copy.sort((a, b) =>
                (a.title || "").toLowerCase().localeCompare((b.title || "").toLowerCase())
            );
        case "z-a":
            return copy.sort((a, b) =>
                (b.title || "").toLowerCase().localeCompare((a.title || "").toLowerCase())
            );
        default:
            return copy;
    }
}

export default function Dashboard() {

    const [allProblems, setAllProblems] = useState<any[]>([]);
    const [problems, setProblems] = useState<any[]>([]);

    const [open, setOpen] = useState(false);
    const [searchTags, setSearchTags] = useState<string[]>([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
    const [sortOpen, setSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setSortOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleSignout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };


    useEffect(() => {
        getproblems();
    }, [open])

    useEffect(() => {
        let filtered = allProblems;

        if (searchTags.length > 0) {
            const lowercaseTags = searchTags.map(t => t.trim().toLowerCase());
            filtered = filtered.filter((p: any) => {
                const pTags = p.tags?.map((t: string) => t.trim().toLowerCase()) || [];
                return lowercaseTags.every(st =>
                    pTags.some((pt: string) => pt.includes(st) || st.includes(pt))
                );
            });
        }

        if (searchTitle.trim()) {
            const query = searchTitle.toLowerCase();
            filtered = filtered.filter((p: any) =>
                p.title?.toLowerCase().includes(query)
            );
        }

        setProblems(applySorting(filtered, sortOrder));
    }, [searchTags, searchTitle, allProblems, sortOrder]);

    async function getproblems() {
        let Pres = await axios.get("http://localhost:3001/dashboard", {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        const fetched = Pres.data.problems.reverse();
        setAllProblems(fetched);
    }

    const currentSort = SORT_OPTIONS.find(o => o.value === sortOrder)!;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <div id="navbar" className="sticky top-0 z-40">
                <div className="w-full border-b bg-white dark:bg-gray-900 dark:border-gray-800 px-8 py-3 flex items-center justify-between relative shadow-sm h-[73px] transition-colors duration-300">

                    {/* Left - Logo */}
                    <div className="flex items-center gap-3 w-auto md:w-1/4">
                       
                        <a className="group text-black dark:text-white text-lg tracking hidden sm:block" href="/dashboard" data-discover="true">
                            100<span className="text-primary"><label className="text-blue-600 dark:text-blue-400">x</label></span>School
                        </a>
                    </div>

                    {/* Middle - Search Bar Engine */}
                    <div className="flex-1 max-w-2xl px-4 flex justify-center w-full md:w-1/2">
                        <SearchBar tags={searchTags} onTagsChange={setSearchTags} />
                    </div>

                    {/* Right - Controls */}
                    <div className="flex items-center justify-end gap-4 w-auto md:w-1/4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer shrink-0"
                            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                        >
                            {theme === "light" ? (
                                <Moon size={18} className="text-gray-600" />
                            ) : (
                                <Sun size={18} className="text-yellow-400" />
                            )}
                        </button>

                        <button
                            onClick={() => { setOpen(true) }}
                            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                        >
                            <Plus size={16} /> Create
                        </button>

                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform cursor-pointer"
                            >
                                A
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                                        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Account</p>
                                    </div>
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-none text-left">
                                        <User size={16} /> Profile
                                    </button>
                                    <button
                                        onClick={handleSignout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-none text-left cursor-pointer"
                                    >
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {
                open ? <CreatePostDialog open={open} onClose={() => setOpen(false)} /> : null
            }

            <div className="flex items-start">
                <Sidebar
                    activeTags={searchTags}
                    onToggleTag={(tag) => {
                        setSearchTags(prev => {
                            const normalized = tag.toLowerCase();
                            if (prev.some(t => t.toLowerCase() === normalized)) {
                                return prev.filter(t => t.toLowerCase() !== normalized);
                            }
                            return [...prev, tag];
                        });
                    }}
                />
                <div className="flex-1 w-full relative">
                    <div className="max-w-4xl mx-auto mt-10 px-6 pb-12">

                        {/* Search + Sort Row */}
                        <div className="flex items-center gap-3 mb-8">
                            {/* Title Search Bar */}
                            <div className="flex-1 flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                                <Search size={18} className="text-gray-400 dark:text-gray-500 mr-3 shrink-0" />
                                <input
                                    type="text"
                                    value={searchTitle}
                                    onChange={(e) => setSearchTitle(e.target.value)}
                                    placeholder="Search problems by title (e.g., 'Two Sum')..."
                                    className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-[15px]"
                                />
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative" ref={sortRef}>
                                <button
                                    onClick={() => setSortOpen(!sortOpen)}
                                    className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap"
                                >
                                    <ArrowUpDown size={16} className="text-gray-400 dark:text-gray-500" />
                                    <span className="hidden sm:inline">{currentSort.label}</span>
                                </button>

                                {sortOpen && (
                                    <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50 min-w-[190px] animate-in fade-in slide-in-from-top-1 duration-150">
                                        {SORT_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => {
                                                    setSortOrder(opt.value);
                                                    setSortOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors border-none
                                                    ${sortOrder === opt.value
                                                        ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-semibold"
                                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                                                    }`}
                                            >
                                                <span className={sortOrder === opt.value ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}>{opt.icon}</span>
                                                {opt.label}
                                                {sortOrder === opt.value && (
                                                    <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M5 12l5 5L20 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {problems.map((problem, index) => (
                                <ProblemCard key={index} {...problem} onRefresh={getproblems} />
                            ))}
                            {problems.length === 0 && (
                                <div className="text-center py-12 text-gray-400 dark:text-gray-500 italic">No problems found matching your search criteria.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

