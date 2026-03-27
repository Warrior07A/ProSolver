import { useState } from "react";
import axios from "axios";
import MarkdownRenderer from "./MarkdownRenderer/MarkdownRenderer";
import EditDialog from "./EditDialog";
import Toast from "./Toast";
import pencil from "./Images/pencil.svg"
import { PencilIcon } from "lucide-react";
export interface Card {
    _id?: string;
    title: string;
    description: string;
    polygon_link?: string;
    polygonLink?: string;
    tags: string[];
    onRefresh?: () => void;
}

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l5 5L20 7" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

export function ProblemCard( props : Card) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const CHAR_LIMIT = 250;
  
  const isLong = props.description && props.description.length > CHAR_LIMIT;
  
  const link = props.polygon_link || props.polygonLink || "";

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete("http://localhost:3001/delete", {
        data: { title: props.title },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      setToast({ message: `"${props.title}" has been deleted.`, type: "success" });
      setDeleteConfirm(false);
      setTimeout(() => {
        props.onRefresh && props.onRefresh();
      }, 800);
    } catch (err: any) {
      console.error("Failed to delete:", err);
      setToast({ message: err?.response?.data?.error || "Failed to delete problem", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex justify-between items-start hover:shadow-md transition bg-white dark:bg-gray-900 overflow-hidden text-left">
        <div className="space-y-3 flex-1 pr-6 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{props.title}</h2>
          
          <div className="text-gray-600 dark:text-gray-300 text-sm">
            <div 
              className={`relative transition-all duration-300 ${!isExpanded && isLong ? "max-h-32 overflow-hidden" : ""}`}
            >
              <MarkdownRenderer text={props.description} />
              
              {!isExpanded && isLong && (
                <div className="absolute -bottom-1 left-0 right-0 h-10 bg-linear-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />
              )}
            </div>
            
            {isLong && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-[13px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          <div>
            <a
              href={link}
              target="_blank"
              className="text-blue-600 dark:text-blue-400 text-sm underline"
            >
              Polygon Link
            </a>
          </div>

          <div className="flex gap-2 flex-wrap pt-1">
            {props.tags?.map((tag, i) => (
              <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border px-2.5 py-1.5 text-gray-700 dark:text-gray-300 font-medium rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex  gap-2 shrink-0">
          <button 
            onClick={handleCopy}
            className={`border rounded-md px-3 py-1 text-sm font-medium cursor-pointer flex items-center gap-1.5 transition-all duration-200
              ${copied 
                ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400" 
                : "border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {/* {copied ? "Copied!" : "Copy"} */}
          </button>
          
          <button 
            onClick={() => setEditOpen(true)}
            className="border border-gray-200 dark:border-gray-800 rounded-md px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium cursor-pointer"
          >
            <PencilIcon size={18}/>
            {/* <svg  xmlns={pencil} className=" fill-blue-500 ">
              {/* <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /> */}
            {/* </svg>     */} 
          </button>

          <button 
            onClick={() => setDeleteConfirm(true)}
            className="border border-red-200 dark:border-red-900/50 rounded-md px-3 py-1 text-sm font-medium cursor-pointer flex items-center gap-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200"
          >
            <TrashIcon />
          </button>
        </div>

        {editOpen && (
          <EditDialog 
            open={editOpen} 
            onClose={() => setEditOpen(false)} 
            onSuccess={() => { props.onRefresh && props.onRefresh(); }}
            problem={{
              _id: props._id || "",
              title: props.title,
              description: props.description,
              polygon_link: link,
              tags: props.tags
            }}
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center p-4 transition-colors"
          onClick={(e) => e.target === e.currentTarget && !deleting && setDeleteConfirm(false)}
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden transition-colors"
            style={{ animation: "dialogSlideUp 0.2s ease-out" }}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-2">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 dark:text-red-400">
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
              </div>
              <h3 className="text-[16px] font-semibold text-gray-900 dark:text-white text-center">Delete Problem</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1.5 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-gray-700 dark:text-gray-300">"{props.title}"</span>? This action cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 px-6 py-5">
              <button
                onClick={() => setDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 text-[13px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
