import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Tag, ChevronDown, Search, Plus, Link as LinkIconLucide } from 'lucide-react';

const PRESET_TAGS = [
    "Arrays", "String", "Hash Table", "Linked List", "Two Pointers",
    "Sliding Window", "Stack", "Queue", "Binary Search", "Tree",
    "Binary Tree", "BST", "Tries", "Heap", "Priority Queue",
    "Backtracking", "Graphs", "BFS", "DFS", "Dijkstra",
    "Bellman-Ford", "Floyd-Warshall", "Minimum Spanning Tree",
    "Topological Sort", "Dynamic Programming", "Bit Manipulation",
    "Greedy", "Math", "Number Theory", "Geometry", "Recursion",
    "Sorting", "Segment Tree", "Fenwick Tree", "Disjoint Set Union (DSU)"
];

interface EditProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    problem: {
        _id: string;
        title: string;
        description: string;
        polygon_link: string;
        tags: string[];
    };
}

function EditDialog({ open, onClose, onSuccess, problem }: EditProps) {
    const [title, setTitle] = useState(problem?.title || "");
    const [description, setDescription] = useState(problem?.description || "");
    const [polygonLink, setPolygonLink] = useState(problem?.polygon_link || "");
    const [activeTags, setActiveTags] = useState<Set<string>>(new Set(problem?.tags || []));
    const [newTag, setNewTag] = useState("");
    const [customTags, setCustomTags] = useState<string[]>(
        (problem?.tags || []).filter(t => !PRESET_TAGS.includes(t))
    );

    const [titleError, setTitleError] = useState(false);
    const [descError, setDescError] = useState(false);
    const [polyError, setPolyError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [tagSearch, setTagSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (open) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [open, onClose]);

    useEffect(() => {
        if (open && problem) {
            setTitle(problem.title || "");
            setDescription(problem.description || "");
            setPolygonLink(problem.polygon_link || "");
            setActiveTags(new Set(problem.tags || []));
            setCustomTags((problem.tags || []).filter(t => !PRESET_TAGS.includes(t)));
        }
    }, [open, problem]);

    const allPresets = [...PRESET_TAGS, ...customTags];

    const toggleTag = (tag: string) => {
        setActiveTags((prev) => {
            const next = new Set(prev);
            next.has(tag) ? next.delete(tag) : next.add(tag);
            return next;
        });
    };

    const removeTag = (tag: string) => {
        setActiveTags((prev) => {
            const next = new Set(prev);
            next.delete(tag);
            return next;
        });
    };

    const addCustomTag = () => {
        const trimmed = newTag.trim();
        if (!trimmed) return;
        if (!allPresets.includes(trimmed)) {
            setCustomTags((prev) => [...prev, trimmed]);
        }
        setActiveTags((prev) => new Set([...prev, trimmed]));
        setNewTag("");
    };

    async function editques() {
        try {
            let a: string[] = [];
            activeTags.forEach((ele: any) => {
                a.push(ele);
            });

            let Probres = await axios.put("http://localhost:3001/edit", {
                problem_id: problem._id,
                title: title,
                description: description,
                link: polygonLink,
                tags: a
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            if (Probres.status === 200) {
                setSuccess(true);
                onSuccess();
                handleClose();
            }
        } catch (e) {
            console.log(e);
            alert("Error saving: " + e);
        }
    }

    const handleSubmit = () => {
        if (!title.trim()) {
            setTitleError(true);
            setTimeout(() => setTitleError(false), 1500);
            return;
        }
        if (!description.trim()) {
            setDescError(true);
            setTimeout(() => setDescError(false), 1500);
            return;
        }
        if (!polygonLink.trim()) {
            setPolyError(true);
            setTimeout(() => setPolyError(false), 1500);
            return;
        }

        editques();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/45 dark:bg-black/60 z-50 flex items-center justify-center p-6 transition-colors duration-300"
                    onClick={(e) => e.target === e.currentTarget && handleClose()}
                >
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto animate-slide-up text-left transition-colors duration-300">
                        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h2 className="text-[17px] font-semibold text-gray-900 dark:text-white">Edit Post</h2>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Update your problem details</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-[30px] h-[30px] rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer border-none"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="px-6 py-5 flex flex-col gap-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 tracking-widest uppercase mb-1.5">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Two Sum — sliding window O(n) approach"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={`w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-colors
                                        ${titleError
                                            ? "border border-red-400 dark:border-red-500/50 focus:border-red-500"
                                            : "border border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500"
                                        }
                                    `}
                                />
                                {titleError && <p className="text-xs text-red-500 dark:text-red-400 mt-1">Title is required</p>}
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 tracking-widest uppercase mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Walk through your approach..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none resize-y leading-relaxed transition-colors
                                        ${descError
                                            ? "border border-red-400 dark:border-red-500/50 focus:border-red-500"
                                            : "border border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500"
                                        }
                                    `}
                                />
                                {descError && <p className="text-xs text-red-500 dark:text-red-400 mt-1">Description is required</p>}
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 tracking-widest uppercase mb-1.5">
                                    Polygon Link
                                </label>
                                <div className={`flex items-center border rounded-lg bg-gray-50 dark:bg-gray-800 overflow-hidden transition-colors
                                    ${polyError
                                        ? "border-red-400 dark:border-red-500/50 focus-within:border-red-500"
                                        : "border-gray-200 dark:border-gray-700 focus-within:border-gray-400 dark:focus-within:border-gray-500"
                                    }
                                `}>
                                    <span className="px-2.5 text-gray-400 dark:text-gray-500 border-r border-gray-200 dark:border-gray-700 flex items-center h-10">
                                        <LinkIconLucide size={16} />
                                    </span>
                                    <input
                                        type="url"
                                        placeholder="https://polygon.codeforces.com/..."
                                        value={polygonLink}
                                        onChange={(e) => setPolygonLink(e.target.value)}
                                        className="flex-1 px-3 py-2.5 text-[13px] font-mono bg-transparent text-gray-900 dark:text-gray-200 outline-none border-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                    />
                                    {polyError && <p className="text-xs text-red-500 dark:text-red-400 mt-1">Polygon Link is required</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 tracking-widest uppercase mb-2">
                                    Tags
                                </label>

                                {/* Selected tag pills */}
                                {activeTags.size > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {[...activeTags].map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                            >
                                                {tag}
                                                <span
                                                    onClick={() => removeTag(tag)}
                                                    className="text-blue-400 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer text-sm leading-none"
                                                >
                                                    ×
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Multi-select Dropdown */}
                                <div className="relative mb-4" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Tag size={14} />
                                            {activeTags.size > 0 ? `${activeTags.size} selected` : "Select DSA Topics..."}
                                        </span>
                                        <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                            <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <Search size={14} className="text-gray-400 mr-2" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search topics..."
                                                        value={tagSearch}
                                                        onChange={(e) => setTagSearch(e.target.value)}
                                                        className="bg-transparent border-none outline-none text-xs text-gray-900 dark:text-white placeholder:text-gray-500 w-full"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                            </div>
                                            <div className="max-h-[220px] overflow-y-auto p-1.5">
                                                {PRESET_TAGS.filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase())).map((tag) => (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        onClick={() => toggleTag(tag)}
                                                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer border-none mb-0.5
                                                            ${activeTags.has(tag)
                                                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold"
                                                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                            }`}
                                                    >
                                                        {tag}
                                                        {activeTags.has(tag) && (
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M20 6L9 17l-5-5" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                ))}
                                                {PRESET_TAGS.filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase())).length === 0 && (
                                                    <p className="text-center py-4 text-[11px] text-gray-400 italic">No matching topics found.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Create new tag */}
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <label className="block text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1">
                                        Custom Tag
                                    </label>
                                    <div className="flex gap-2 items-center">
                                        <div className="flex items-center flex-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 overflow-hidden focus-within:border-gray-400 dark:focus-within:border-gray-500 transition-colors">
                                            <span className="ml-2.5 text-gray-400 dark:text-gray-500 shrink-0">
                                                <Plus size={13} />
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="Enter new tag name..."
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addCustomTag();
                                                    }
                                                }}
                                                className="flex-1 px-2.5 py-2 text-[13px] bg-transparent text-gray-900 dark:text-gray-200 outline-none border-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addCustomTag}
                                            className="px-3.5 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer whitespace-nowrap"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1.5 ml-1">
                                        Can't find a topic? Type above and click "Add" to create a custom tag.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-[13px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-5 py-2 text-[13px] font-semibold rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const CloseIcon = () => (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export default EditDialog;
