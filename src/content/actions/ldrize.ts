import type { ActionRegistry } from "../../core/action-registry.js";
import { findItemIndex } from "../../core/ldrize.js";
import { findSiteinfo } from "../../core/siteinfo.js";

const THRESHOLD = 5;

export function applyLdrize(registry: ActionRegistry): void {
  const siteinfo = findSiteinfo(window.location.href);
  if (!siteinfo) return;

  const originalDown = registry.get("scroll-down");
  const originalUp = registry.get("scroll-up");

  registry.register("scroll-down", () => {
    const elements = document.querySelectorAll(siteinfo.selector);
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
    const elements = document.querySelectorAll(siteinfo.selector);
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
