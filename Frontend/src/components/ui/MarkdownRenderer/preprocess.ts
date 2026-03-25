export function preprocessPolygonMathAware(text: string = ""): string {
  const parts: { math: boolean; text: string }[] = [];

  let i = 0;
  const len = text.length;

  function findNextDelimiter(pos: number) {
    const candidates: { idx: number; type: string }[] = [];

    const idxDisplay = text.indexOf("$$", pos);
    if (idxDisplay !== -1) candidates.push({ idx: idxDisplay, type: "$$" });

    const idxDollar = text.indexOf("$", pos);
    if (idxDollar !== -1) candidates.push({ idx: idxDollar, type: "$" });

    const idxParen = text.indexOf("\\(", pos);
    if (idxParen !== -1) candidates.push({ idx: idxParen, type: "\\(" });

    const idxBracket = text.indexOf("\\[", pos);
    if (idxBracket !== -1) candidates.push({ idx: idxBracket, type: "\\[" });

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => a.idx - b.idx);
    return candidates[0];
  }

  while (i < len) {
    const next = findNextDelimiter(i);

    if (!next) {
      parts.push({ math: false, text: text.slice(i) });
      break;
    }

    if (next.idx > i) {
      parts.push({ math: false, text: text.slice(i, next.idx) });
    }

    if (next.type === "$$") {
      const end = text.indexOf("$$", next.idx + 2);
      if (end === -1) break;

      parts.push({ math: true, text: text.slice(next.idx, end + 2) });
      i = end + 2;
    } else if (next.type === "$") {
      const end = text.indexOf("$", next.idx + 1);
      if (end === -1) break;

      parts.push({ math: true, text: text.slice(next.idx, end + 1) });
      i = end + 1;
    } else {
      i = next.idx + 2;
    }
  }

  return parts
    .map((p) => (p.math ? p.text : preprocessPolygon(p.text)))
    .join("");
}

function preprocessPolygon(text: string): string {
  let s = text;

  s = s.replace(/\\InputFile/g, "### Input");
  s = s.replace(/\\OutputFile/g, "### Output");
  s = s.replace(/\\Note/g, "### Note");

  s = s.replace(/\\textbf\{([^}]*)\}/g, "**$1**");
  s = s.replace(/\\textit\{([^}]*)\}/g, "*$1*");

  s = s.replace(/\\item\s*/g, "- ");

  return s;
}