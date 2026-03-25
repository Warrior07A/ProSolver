import CreatePostDialog from "@/components/ui/CreatePostDialog";
import { ProblemCard } from "@/components/ui/ProblemCard";
import Sidebar from "../components/ui/Sidebar";
import { SearchBar } from "../components/ui/SearchBar";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {

    const [allProblems, setAllProblems] = useState<any[]>([]);
    const [problems, setProblems] = useState<any[]>([]);

    const [open, setOpen] = useState(false);
    const [searchTags, setSearchTags] = useState<string[]>([]);
    const [searchTitle, setSearchTitle] = useState("");

    useEffect(() => {
        getproblems();
    }, [open])

    useEffect(() => {
        let filtered = allProblems;

        if (searchTags.length > 0) {
            const lowercaseTags = searchTags.map(t => t.trim().toLowerCase());
            filtered = filtered.filter((p: any) => {
                const pTags = p.tags?.map((t: string) => t.trim().toLowerCase()) || [];
                // Check if every search tag matches at least one problem tag (bi-directional substring matching handles Plurals like "Array" vs "Arrays")
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

        setProblems(filtered);
    }, [searchTags, searchTitle, allProblems]);

    async function getproblems() {
        let Pres = await axios.get("http://localhost:3001/dashboard", {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        const fetched = Pres.data.problems.reverse();
        setAllProblems(fetched);
        setProblems(fetched);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div id="navbar" className="sticky top-0 z-40">
                <div className="w-full border-b bg-white px-8 py-3 flex items-center justify-between relative shadow-sm h-[73px]">
                    
                    {/* Left - Logo */}
                    <div className="flex items-center gap-5 w-auto md:w-1/4">
                        <div className="w-10 h-10 rounded-full border flex items-center justify-center text-xs">
                        </div>
                        <a className="group text-black text-lg tracking hidden sm:block" href="/dashboard" data-discover="true">
                            100<span className="text-primary"><label className="text-blue-800">x</label></span>School
                        </a>
                    </div>

                    {/* Middle - Search Bar Engine (Takes 50% width) */}
                    <div className="flex-1 max-w-2xl px-4 flex justify-center w-full md:w-1/2">
                        <SearchBar tags={searchTags} onTagsChange={setSearchTags} />
                    </div>

                    {/* Right - Controls */}
                    <div className="flex items-center justify-end gap-6 w-auto md:w-1/4">
                        <button
                            onClick={() => { setOpen(true) }}
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                        >
                            <Plus size={16} /> Create
                        </button>

                        <div className="w-10 h-10 rounded-full bg-gray-200 hidden sm:flex items-center justify-center font-semibold shrink-0">
                            A
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
                        
                        {/* Title Search Bar */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm mb-8 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                            <Search size={18} className="text-gray-400 mr-3 shrink-0" />
                            <input 
                                type="text"
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                                placeholder="Search problems by title (e.g., 'Two Sum')..."
                                className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 text-[15px]"
                            />
                        </div>

                        <div className="space-y-6">
                            {problems.map((problem, index) => (
                                <ProblemCard key={index} {...problem} onRefresh={getproblems} />
                            ))}
                            {problems.length === 0 && (
                                <div className="text-center py-12 text-gray-400 italic">No problems found matching your search criteria.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
