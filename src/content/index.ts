import { ActionRegistry } from "../core/action-registry.js";
import { mergeKeymap, mergeSiteinfos, validateConfig } from "../core/config.js";
import { defaultKeymap } from "../core/keymap.js";
import { defaultSiteinfos } from "../core/siteinfo.js";
import { formatMarkdownLink } from "../core/yank.js";
import type { BackgroundResponse } from "../shared/messages.js";
import { isBackgroundMessage } from "../shared/messages.js";
import { applyLdrize } from "./actions/ldrize.js";
import { registerPageNavActions } from "./actions/page-nav.js";
import { registerScrollActions } from "./actions/scroll.js";
import { setupController } from "./controller.js";

declare const __E2E__: boolean;

(async () => {
  let keymap = defaultKeymap;
  let siteinfos = defaultSiteinfos;

  try {
    const stored = await browser.storage.local.get("userConfig");
    if (stored.userConfig) {
      const config = validateConfig(stored.userConfig);
      keymap = mergeKeymap(defaultKeymap, config.keymap);
      siteinfos = mergeSiteinfos(defaultSiteinfos, config.siteinfo);
    }
  } catch (e) {
    console.warn("vimimin: failed to load user config, using defaults", e);
  }

  const registry = new ActionRegistry();
  registerScrollActions(registry);
  applyLdrize(registry, siteinfos);
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

  const controller = setupController(keymap, registry);

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
    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "vimimin-e2e-set-storage") {
        browser.storage.local
          .set({ userConfig: event.data.config })
          .then(() => {
            window.postMessage(
              { type: "vimimin-e2e-storage-done" },
              window.location.origin,
            );
          });
      }
    });
  }
})();
