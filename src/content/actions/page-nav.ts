import type { ActionRegistry } from "../../core/action-registry.js";

type Direction = "next" | "prev";

const nextPatterns = /^(next|次|›|»|→|>>|>)$/i;
const prevPatterns = /^(prev|previous|前|‹|«|←|<<|<)$/i;

function findPageLink(direction: Direction): string | undefined {
  const rel = direction === "next" ? "next" : "prev";
  const textPattern = direction === "next" ? nextPatterns : prevPatterns;

  // 1. <link rel="next|prev">
  const link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (link?.href) return link.href;

  // 2. <a rel="next|prev">
  const anchor = document.querySelector<HTMLAnchorElement>(`a[rel="${rel}"]`);
  if (anchor?.href) return anchor.href;

  // 3. <a> with matching text content
  const anchors = document.querySelectorAll<HTMLAnchorElement>("a[href]");
  for (const a of anchors) {
    const text = a.textContent?.trim() ?? "";
    if (textPattern.test(text)) return a.href;
  }

  return undefined;
}

export function registerPageNavActions(registry: ActionRegistry): void {
  registry.register("next-page", () => {
    const url = findPageLink("next");
    if (url) location.href = url;
  });
  registry.register("prev-page", () => {
    const url = findPageLink("prev");
    if (url) location.href = url;
  });
}
