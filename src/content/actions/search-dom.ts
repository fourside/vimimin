import { findMatches } from "../../core/search-match.js";

const HIGHLIGHT_CLASS = "vimimin-search-highlight";
const CURRENT_CLASS = "vimimin-search-current";

function injectStyles(): void {
  if (document.getElementById("vimimin-search-style")) return;
  const style = document.createElement("style");
  style.id = "vimimin-search-style";
  style.textContent = [
    `.${HIGHLIGHT_CLASS} { background: #ffd54f; color: #000; border-radius: 2px; }`,
    `.${CURRENT_CLASS} { background: #ff6f00; color: #fff; border-radius: 2px; }`,
  ].join("\n");
  document.head.appendChild(style);
}

function collectTextNodes(): Text[] {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node: Node | null = walker.nextNode();
  while (node) {
    if (node.nodeValue && node.nodeValue.trim() !== "") {
      const el = node.parentElement;
      if (el?.checkVisibility()) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 1 && rect.height > 1) {
          nodes.push(node as Text);
        }
      }
    }
    node = walker.nextNode();
  }
  return nodes;
}

export class SearchHighlighter {
  private marks: HTMLElement[] = [];

  highlight(query: string): number {
    this.clear();
    if (query === "") return 0;

    injectStyles();
    const textNodes = collectTextNodes();

    for (const textNode of textNodes) {
      const text = textNode.nodeValue ?? "";
      const matches = findMatches(query, text);
      if (matches.length === 0) continue;

      const parent = textNode.parentNode;
      if (!parent) continue;

      const fragment = document.createDocumentFragment();
      let lastEnd = 0;

      for (const match of matches) {
        if (match.start < lastEnd) continue;
        if (match.start > lastEnd) {
          fragment.appendChild(
            document.createTextNode(text.slice(lastEnd, match.start)),
          );
        }
        const mark = document.createElement("mark");
        mark.className = HIGHLIGHT_CLASS;
        mark.textContent = text.slice(match.start, match.start + match.length);
        fragment.appendChild(mark);
        this.marks.push(mark);
        lastEnd = match.start + match.length;
      }

      if (lastEnd < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastEnd)));
      }

      parent.replaceChild(fragment, textNode);
    }

    return this.marks.length;
  }

  setCurrent(index: number): void {
    for (const mark of this.marks) {
      mark.className = HIGHLIGHT_CLASS;
    }
    const current = this.marks[index];
    if (current) {
      current.className = CURRENT_CLASS;
      current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  get count(): number {
    return this.marks.length;
  }

  clear(): void {
    for (const mark of this.marks) {
      const parent = mark.parentNode;
      if (!parent) continue;
      const text = document.createTextNode(mark.textContent ?? "");
      parent.replaceChild(text, mark);
      parent.normalize();
    }
    this.marks = [];
    document.getElementById("vimimin-search-style")?.remove();
  }
}
