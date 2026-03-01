import type { ActionRegistry } from "../../core/action-registry.js";

const SCROLL_AMOUNT = 60;

export function registerScrollActions(registry: ActionRegistry): void {
  registry.register("scroll-down", () => {
    window.scrollBy(0, SCROLL_AMOUNT);
  });
  registry.register("scroll-up", () => {
    window.scrollBy(0, -SCROLL_AMOUNT);
  });
  registry.register("scroll-left", () => {
    window.scrollBy(-SCROLL_AMOUNT, 0);
  });
  registry.register("scroll-right", () => {
    window.scrollBy(SCROLL_AMOUNT, 0);
  });
  registry.register("scroll-to-top", () => {
    window.scrollTo(0, 0);
  });
  registry.register("scroll-to-bottom", () => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  registry.register("scroll-half-page-down", () => {
    window.scrollBy(0, window.innerHeight / 2);
  });
  registry.register("scroll-half-page-up", () => {
    window.scrollBy(0, -window.innerHeight / 2);
  });
  registry.register("scroll-page-down", () => {
    window.scrollBy(0, window.innerHeight);
  });
  registry.register("scroll-page-up", () => {
    window.scrollBy(0, -window.innerHeight);
  });
}
