import { ActionRegistry } from "../core/action-registry.js";
import { defaultKeymap } from "../core/keymap.js";
import { formatMarkdownLink } from "../core/yank.js";
import type { BackgroundResponse } from "../shared/messages.js";
import { isBackgroundMessage } from "../shared/messages.js";
import { applyLdrize } from "./actions/ldrize.js";
import { registerPageNavActions } from "./actions/page-nav.js";
import { registerScrollActions } from "./actions/scroll.js";
import { setupController } from "./controller.js";

const registry = new ActionRegistry();
registerScrollActions(registry);
applyLdrize(registry);
registerPageNavActions(registry);

registry.register("yank-url", () => {
  navigator.clipboard.writeText(window.location.href).catch(() => {});
});

registry.register("yank-markdown", () => {
  const text = formatMarkdownLink(document.title, window.location.href);
  navigator.clipboard.writeText(text).catch(() => {});
});

registry.register("open-clipboard-url", () => {
  navigator.clipboard
    .readText()
    .then((text) => {
      const url = text.trim();
      if (url) {
        browser.runtime.sendMessage({ type: "tab-open", url });
      }
    })
    .catch(() => {});
});

registry.register("reload", () => {
  location.reload();
});

registry.register("go-back", () => {
  history.back();
});

registry.register("go-forward", () => {
  history.forward();
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

browser.runtime.onMessage.addListener((message) => {
  if (isBackgroundMessage(message)) {
    controller.setEnabled(message.enabled);
  }
  return undefined;
});

if (__E2E__) {
  document.documentElement.dataset.vimiminLoaded = "true";
}
