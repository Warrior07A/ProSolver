interface Card{
    title : string,
    description : string,
    polygonLink : string
    tags : string[]
}



import React from "react";

export function ProblemCard( props : Card) {
  return (
    <div className="border rounded-2xl p-6 flex justify-between items-start hover:shadow-md transition bg-white">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{props.title}</h2>

        <p className="text-gray-600 text-sm">{props.description}</p>

        <a
          href={props.polygonLink}
          target="_blank"
          className="text-blue-600 text-sm underline"
        >
          Polygon Link
        </a>

        <div className="flex gap-2 flex-wrap pt-2">
          {props.tags?.map((tag, i) => (
            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <button className="border rounded-md px-3 py-1 text-sm hover:bg-gray-100">
        Edit
      </button>
    </div>
  );
}