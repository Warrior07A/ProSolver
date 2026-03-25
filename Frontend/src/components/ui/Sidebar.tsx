import React from 'react';

const topics = [
    "Arrays",
    "Two Pointers",
    "Sliding Window",
    "Stack",
    "Binary Search",
    "Linked List",
    "Trees",
    "Tries",
    "Heap / Priority Queue",
    "Backtracking",
    "Graphs",
    "1-D Dynamic Programming",
    "2-D Dynamic Programming",
    "Greedy",
    "Math & Geometry",
    "Bit Manipulation"
];

interface SidebarProps {
    activeTags: string[];
    onToggleTag: (tag: string) => void;
}

export default function Sidebar({ activeTags, onToggleTag }: SidebarProps) {
    return (
        <div className="w-64 border-r border-gray-200 bg-white min-h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto px-4 py-6 hidden md:block shrink-0">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">DSA Topics</h3>
            <div className="flex flex-col space-y-1">
                {topics.map((topic, i) => {
                    const isActive = activeTags.some(t => t.toLowerCase() === topic.toLowerCase());
                    return (
                        <button
                            key={i}
                            onClick={() => onToggleTag(topic)}
                            className={`text-left px-3 py-2 text-sm rounded-lg transition-all cursor-pointer ${
                                isActive 
                                ? "bg-blue-50 text-blue-700 font-semibold" 
                                : "font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                        >
                            {topic}
                        </button>
                    );
                })}
            </div>
        </div>
    )
}
