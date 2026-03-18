import axios from "axios";
import { Rss } from "lucide-react";
import { useState } from "react";

const PRESET_TAGS = [
    "String", "Array", "Dynamic Programming",
    "Graph", "Binary Search", "Tree", "Greedy",
];

interface CreatePropsinPostDialog {
    open: boolean,
    onClose: () => void
}


function CreatePostDialog({ open, onClose }: CreatePropsinPostDialog) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [polygonLink, setPolygonLink] = useState("");
    const [activeTags, setActiveTags] = useState(new Set());
    const [newTag, setNewTag] = useState("");
    const [customTags, setCustomTags] = useState([]);

    const [titleError, setTitleError] = useState(false);
    const [descError, setDescError] = useState(false);
    const [polyError, setpolyError] = useState(false);

    const [success, setSuccess] = useState(false);

    const allPresets = [...PRESET_TAGS, ...customTags];

    const toggleTag = (tag) => {
        setActiveTags((prev) => {
            const next = new Set(prev);
            next.has(tag) ? next.delete(tag) : next.add(tag);
            return next;
        });
    };

    const removeTag = (tag) => {
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


    async function addques() {
        let Probres = await axios.post("http://locahost:3001/create", {
            title: title,
            description: description,
            link: polygonLink,
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        if (Probres.status == 200) {
            let ProbId = Probres.data.id; 
            let a: string[] = [];
            let arr = activeTags.forEach((ele: string) => {
                a.push(ele);
            })
            console.log(a);
           
            let tagres = await axios.post("http://locahost:3001/tagsadd", {
                title: ele,
                
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }

        })
        }

        else {
            alert("error occured try again!")
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
            setpolyError(true);
            setTimeout(() => setpolyError(false), 1500);
            return;
        }

        setSuccess(true);
        addques();
        // setTimeout(() => {
        //     resetForm();
        // }, 1800);
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setPolygonLink("");
        setActiveTags(new Set());
        setCustomTags([]);
        setNewTag("");
        setSuccess(false);
        setTitleError(false);
        setDescError(false);
        setpolyError(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-6"
                    onClick={(e) => e.target === e.currentTarget && handleClose()}
                >
                    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto animate-slide-up">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-[17px] font-semibold text-gray-900">Create a post</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Share your solution with the community</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-[30px] h-[30px] rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer border-none"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 flex flex-col gap-4">

                            {/* Title */}
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1.5">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Two Sum — sliding window O(n) approach"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={`w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 text-gray-900 outline-none transition-colors
                    ${titleError
                                            ? "border border-red-400 focus:border-red-500"
                                            : "border border-gray-200 focus:border-gray-400"
                                        }`}
                                />
                                {titleError && (
                                    <p className="text-xs text-red-500 mt-1">Title is required</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Walk through your approach, explain key insights, mention time/space complexity..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-900 outline-none focus:border-gray-400 resize-y leading-relaxed transition-colors
                   ${descError
                                            ? "border border-red-400 focus:border-red-500"
                                            : "border border-gray-200 focus:border-gray-400"
                                        }`}
                                />
                                {descError && (
                                    <p className="text-xs text-red-500 mt-1">Description is required</p>
                                )}
                            </div>

                            {/* Polygon Link */}
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1.5">
                                    Polygon Link
                                </label>
                                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden focus-within:border-gray-400 transition-colors">
                                    <span className="px-2.5 text-gray-400 border-r border-gray-200 flex items-center h-10">
                                        <LinkIcon />
                                    </span>
                                    <input
                                        type="url"
                                        placeholder="https://polygon.codeforces.com/..."
                                        value={polygonLink}
                                        onChange={(e) => setPolygonLink(e.target.value)}
                                        className={`flex-1 px-3 py-2.5 text-[13px] font-mono bg-transparent text-gray-900 outline-none border-none"
                                                ${polyError
                                                ? "border border-red-400 focus:border-red-500"
                                                : "border border-gray-200 focus:border-gray-400"
                                            }`}
                                    />
                                    {polyError && (
                                        <p className="text-xs text-red-500 mt-1">Polygon Link is required</p>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-2">
                                    Tags
                                </label>

                                {/* Selected tag pills */}
                                {activeTags.size > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {[...activeTags].map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200"
                                            >
                                                {tag}
                                                <span
                                                    onClick={() => removeTag(tag)}
                                                    className="text-blue-400 hover:text-blue-700 cursor-pointer text-sm leading-none"
                                                >
                                                    ×
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Preset tag toggles */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {allPresets.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer font-medium
                        ${activeTags.has(tag)
                                                    ? "bg-blue-50 text-blue-600 border-blue-200"
                                                    : "bg-gray-100 text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>

                                {/* Create new tag */}
                                <div className="flex gap-2 items-center">
                                    <div className="flex items-center flex-1 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden focus-within:border-gray-400 transition-colors">
                                        <span className="ml-2.5 text-gray-400 flex-shrink-0">
                                            <PlusIcon size={13} />
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Create new tag..."
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && addCustomTag()}
                                            className="flex-1 px-2.5 py-2 text-[13px] bg-transparent text-gray-900 outline-none border-none"
                                        />
                                    </div>
                                    <button
                                        onClick={addCustomTag}
                                        className="px-3.5 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:border-gray-300 transition-all cursor-pointer whitespace-nowrap"
                                    >
                                        Add tag
                                    </button>
                                </div>
                                <p className="text-[11px] text-gray-300 mt-1.5">
                                    press Enter or click "Add tag" to create
                                </p>
                            </div>
                        </div>

                        {/* Success Banner */}
                        {success && (
                            <div className="mx-6 mb-4 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-[13px] font-medium">
                                Post "{title}" published with {activeTags.size} tag{activeTags.size !== 1 ? "s" : ""}!
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-[13px] font-medium rounded-lg border border-gray-200 bg-transparent text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={success}
                                className="px-5 py-2 text-[13px] font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                Publish Post
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}

/* ── Icons ───────────────────────────────────────────── */
const PlusIcon = ({ size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const CloseIcon = () => (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const LinkIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M8.5 2.5l3 3-7 7-3-3 7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 5.5l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

export default CreatePostDialog;