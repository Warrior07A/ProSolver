import { useEffect, useState } from "react";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    duration?: number;
    onClose: () => void;
}

export default function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setVisible(true));

        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(onClose, 350);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgMap = {
        success: "bg-emerald-600",
        error: "bg-red-600",
        info: "bg-gray-800",
    };

    const iconMap = {
        success: (
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M6 10l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        error: (
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="1.5" />
                <path d="M10 7v4M10 13.5v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        info: (
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="1.5" />
                <path d="M10 9v4M10 7v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    };

    return (
        <div
            className="fixed top-6 right-6 z-9999 pointer-events-auto"
            style={{
                transform: visible && !exiting ? "translateX(0)" : "translateX(120%)",
                opacity: visible && !exiting ? 1 : 0,
                transition: "transform 0.35s cubic-bezier(0.21, 1.02, 0.73, 1), opacity 0.3s ease",
            }}
        >
            <div
                className={`${bgMap[type]} flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white text-sm font-medium min-w-[280px] max-w-[420px]`}
                style={{ backdropFilter: "blur(8px)" }}
            >
                <span className="shrink-0">{iconMap[type]}</span>
                <span className="flex-1">{message}</span>
                <button
                    onClick={() => {
                        setExiting(true);
                        setTimeout(onClose, 350);
                    }}
                    className="shrink-0 ml-2 text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
