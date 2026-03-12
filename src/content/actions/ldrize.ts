import type { ActionRegistry } from "../../core/action-registry.js";
import { findItemIndex } from "../../core/ldrize.js";
import type { Siteinfo } from "../../core/siteinfo.js";
import { findSiteinfo } from "../../core/siteinfo.js";

const THRESHOLD = 5;
const CACHE_TTL_MS = 2000;

export function applyLdrize(
  registry: ActionRegistry,
  siteinfos?: readonly Siteinfo[],
): void {
  const siteinfo = findSiteinfo(window.location.href, siteinfos);
  if (!siteinfo) return;

  const { selector } = siteinfo;
  let cachedElements: NodeListOf<Element> | undefined;
  let cacheTime = 0;

  function getElements(): NodeListOf<Element> | undefined {
    const now = performance.now();
    if (!cachedElements || now - cacheTime > CACHE_TTL_MS) {
      try {
        cachedElements = document.querySelectorAll(selector);
      } catch {
        return undefined;
      }
      cacheTime = now;
    }
    return cachedElements;
  }

  const originalDown = registry.get("scroll-down");
  const originalUp = registry.get("scroll-up");

  registry.register("scroll-down", () => {
    const elements = getElements();
    if (!elements) {
      originalDown?.();
      return;
    }
    const rects = Array.from(elements, (el) => el.getBoundingClientRect());
    const index = findItemIndex(rects, THRESHOLD, "next");
    const rect = index !== undefined ? rects[index] : undefined;
    if (rect) {
      window.scrollBy(0, rect.top);
    } else {
      originalDown?.();
    }
  });

  registry.register("scroll-up", () => {
    const elements = getElements();
    if (!elements) {
      originalUp?.();
      return;
    }
    const rects = Array.from(elements, (el) => el.getBoundingClientRect());
    const index = findItemIndex(rects, THRESHOLD, "prev");
    const rect = index !== undefined ? rects[index] : undefined;
    if (rect) {
      window.scrollBy(0, rect.top);
    } else {
      originalUp?.();
    }
  });
}
