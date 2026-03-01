import { ActionRegistry } from "../core/action-registry.js";
import { defaultKeymap } from "../core/keymap.js";
import { formatMarkdownLink } from "../core/yank.js";
import type { BackgroundResponse } from "../shared/messages.js";
import { registerScrollActions } from "./actions/scroll.js";
import { setupController } from "./controller.js";

const registry = new ActionRegistry();
registerScrollActions(registry);

registry.register("yank-url", () => {
  navigator.clipboard.writeText(window.location.href).catch(() => {});
});

registry.register("yank-markdown", () => {
  const text = formatMarkdownLink(document.title, window.location.href);
  navigator.clipboard.writeText(text).catch(() => {});
});

declare const __E2E__: boolean;

const controller = setupController(defaultKeymap, registry);

browser.runtime.sendMessage({ type: "get-enabled" }).then((response) => {
  if (
    typeof response === "object" &&
    response !== null &&
    typeof (response as Record<string, unknown>).enabled === "boolean"
  ) {
    controller.setEnabled((response as BackgroundResponse).enabled);
  }
});

if (__E2E__) {
  document.documentElement.dataset.vimiminLoaded = "true";
}
