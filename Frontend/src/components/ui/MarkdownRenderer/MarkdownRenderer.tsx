import { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import "./MarkdownRenderer.css";
import { preprocessPolygonMathAware } from "./preprocess";

interface MarkdownRendererProps {
  text: string;
}

declare global {
  interface Window {
    MathJax: any;
  }
}

export default function MarkdownRenderer({ text }: MarkdownRendererProps) {

  const containerRef = useRef<HTMLDivElement | null>(null);

  const processed = preprocessPolygonMathAware(text);

  useEffect(() => {
    const renderMath = () => {
      if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
        if (typeof window.MathJax.typesetClear === "function") {
            window.MathJax.typesetClear([containerRef.current]);
        }
        window.MathJax.typesetPromise([containerRef.current]).catch(console.error);
      }
    };

    if (!document.getElementById("mathjax-script")) {
      window.MathJax = {
        tex: {
          inlineMath: [["$", "$"], ["\\(", "\\)"]],
          displayMath: [["$$", "$$"], ["\\[", "\\]"]],
        },
      };

      const script = document.createElement("script");
      script.id = "mathjax-script";
      script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
      script.async = true;

      script.onload = () => {
        // Wait briefly for MathJax internal initialization
        setTimeout(renderMath, 100);
      };

      document.head.appendChild(script);
    } else {
      // Script is either loading or loaded. 
      // If it's loaded, typesetPromise will exist. If loading, MathJax's global auto-render will catch it.
      if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
        renderMath();
      }
    }

  }, [processed]);

  return (

    <div
      ref={containerRef}
      className="markdown-renderer"
    >

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {processed}
      </ReactMarkdown>

    </div>

  );
}