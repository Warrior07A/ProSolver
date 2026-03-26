import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

const SUGGESTED_TAGS = [
  "Array", "String", "Dynamic Programming", "Graph", "Binary Search", 
  "Tree", "Two Pointers", "Sliding Window", "Greedy", "Backtracking",
  "Math"
];

interface SearchBarProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function SearchBar({ tags, onTagsChange }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      
      const exists = tags.some(t => t.toLowerCase() === newTag.toLowerCase());
      if (!exists) {
        onTagsChange([...tags, newTag]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const addSuggestedTag = (tag: string) => {
    const exists = tags.some(t => t.toLowerCase() === tag.toLowerCase());
    if (!exists) {
      onTagsChange([...tags, tag]);
    }
    setInputValue("");
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 dark:bg-black/40 backdrop-blur-sm z-40 transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <div ref={containerRef} className="relative w-full z-50 flex flex-col items-center">
        
        <div 
          className={`relative w-full flex flex-wrap items-center bg-gray-50 dark:bg-gray-800 border transition-all duration-200 min-h-[44px] px-3 py-1.5 cursor-text
            ${isOpen ? "border-blue-500 bg-white dark:bg-gray-900 ring-4 ring-blue-500/10 dark:ring-blue-500/20 rounded-t-xl rounded-b-none" : "border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"}
          `}
          onClick={() => setIsOpen(true)}
        >
          <Search size={16} className={`mr-2 shrink-0 ${isOpen ? "text-blue-500" : "text-gray-400 dark:text-gray-500"}`} />
          
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2.5 py-1 rounded text-[13px] font-medium mr-2 my-0.5 border border-gray-200 dark:border-gray-600 shadow-sm animate-fade-in">
              {tag}
              <button 
                onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                className="hover:text-red-500 transition-colors cursor-pointer text-gray-400 dark:text-gray-400 ml-0.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <X size={13} />
              </button>
            </span>
          ))}

          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={tags.length === 0 ? "Search tags... (Press Enter to lock)" : "Add more tags..."}
            className="flex-1 bg-transparent border-none outline-none text-[13px] min-w-[150px] py-1 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border border-t-0 border-blue-500 dark:border-blue-500/50 rounded-b-xl shadow-lg overflow-hidden flex flex-col pt-3 pb-5 px-5 animate-slide-down">
            <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Suggested Topics</h4>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => addSuggestedTag(tag)}
                  className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer shadow-sm"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

