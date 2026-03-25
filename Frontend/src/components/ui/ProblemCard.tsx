import { useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer/MarkdownRenderer";

interface Card{
    title : string,
    description : string,
    polygonLink : string
    tags : string[]
}

export function ProblemCard( props : Card) {
  const [isExpanded, setIsExpanded] = useState(false);
  const CHAR_LIMIT = 250;
  
  // Predict if the markdown text is long enough to warrant truncation
  const isLong = props.description && props.description.length > CHAR_LIMIT;

  return (
    <div className="border rounded-2xl p-6 flex justify-between items-start hover:shadow-md transition bg-white overflow-hidden">
      <div className="space-y-3 flex-1 pr-6 min-w-0">
        <h2 className="text-lg font-semibold">{props.title}</h2>
        
        <div className="text-gray-600 text-sm">
          <div 
            className={`relative transition-all duration-300 ${!isExpanded && isLong ? "max-h-32 overflow-hidden" : ""}`}
          >
            <MarkdownRenderer text={props.description} />
            
            {/* Visual fade-out effect when collapsed */}
            {!isExpanded && isLong && (
              <div className="absolute -bottom-1 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </div>
          
          {isLong && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 text-[13px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        <div>
          <a
            href={props.polygonLink}
            target="_blank"
            className="text-blue-600 text-sm underline"
          >
            Polygon Link
          </a>
        </div>

        <div className="flex gap-2 flex-wrap pt-1">
          {props.tags?.map((tag, i) => (
            <span key={i} className="text-xs bg-gray-100 px-2.5 py-1.5 text-gray-700 font-medium rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <button className="border rounded-md px-3 py-1 text-sm hover:bg-gray-100 font-medium shrink-0">
        Edit
      </button>
    </div>
  );
}