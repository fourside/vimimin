import type { ActionRegistry } from "../core/action-registry.js";
import { KeyHandler } from "../core/keyhandler.js";
import type { Keymap } from "../core/keymap.js";
import { nextMode } from "../core/mode.js";
import type { Mode } from "../shared/types.js";
import { HintSession, parseHintActionType } from "./hint-session.js";
import { SearchSession } from "./search-session.js";
import { TabFinderSession } from "./tab-finder-session.js";

function isInputElement(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return false;
}

function toKeyNotation(e: KeyboardEvent): string {
  if (e.ctrlKey && e.key.length === 1) {
    return `<C-${e.key}>`;
  }
  return e.key;
}

const TAB_ACTIONS = new Set([
  "tab-next",
  "tab-prev",
  "tab-close",
  "tab-restore",
  "tab-first",
  "tab-last",
]);

type Controller = {
  setEnabled(value: boolean): void;
};

export function setupController(
  keymap: Keymap,
  registry: ActionRegistry,
): Controller {
  let enabled = true;
  let mode: Mode = "normal";
  let hintSession: HintSession | null = null;
  let searchSession: SearchSession | null = null;
  let tabFinderSession: TabFinderSession | null = null;
  const handler = new KeyHandler(keymap);

  function startHintSession(actionName: string): void {
    const actionType = parseHintActionType(actionName);
    if (!actionType) return;
    hintSession = new HintSession(actionType);
    mode = nextMode(mode, "enter-hint");
  }

  function endHintSession(): void {
    hintSession?.destroy();
    hintSession = null;
    mode = nextMode(mode, "hint-complete");
  }

  function startSearchSession(): void {
    searchSession = new SearchSession();
    mode = nextMode(mode, "enter-search");
    searchSession.start(() => {
      searchSession = null;
      mode = nextMode(mode, "search-complete");
    });
  }

  function endSearchSession(): void {
    searchSession?.destroy();
  }

  function startTabFinderSession(): void {
    tabFinderSession = new TabFinderSession();
    mode = nextMode(mode, "enter-search");
    tabFinderSession.start(() => {
      tabFinderSession = null;
      mode = nextMode(mode, "search-complete");
    });
  }

  function endTabFinderSession(): void {
    tabFinderSession?.destroy();
  }

  function handleAction(actionName: string): void {
    if (parseHintActionType(actionName)) {
      startHintSession(actionName);
    } else if (actionName === "search-start") {
      startSearchSession();
    } else if (actionName === "search-next") {
      searchSession?.next();
    } else if (actionName === "search-prev") {
      searchSession?.prev();
    } else if (actionName === "tab-finder") {
      startTabFinderSession();
    } else if (TAB_ACTIONS.has(actionName)) {
      browser.runtime.sendMessage({ type: actionName });
    } else {
      const action = registry.get(actionName);
      action?.();
    }
  }

  handler.onTimeout = (actionName) => {
    handleAction(actionName);
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && e.shiftKey) {
      e.preventDefault();
      enabled = !enabled;
      if (mode === "hint") endHintSession();
      if (mode === "search") {
        endSearchSession();
        endTabFinderSession();
      }
      handler.reset();
      browser.runtime.sendMessage({ type: "toggle-enabled" });
      return;
    }

    if (!enabled) return;

    if (isInputElement(e.target)) {
      mode = nextMode(mode, "focus-input");
    }

    if (mode === "insert") {
      if (e.key === "Escape") {
        mode = nextMode(mode, "escape");
        if (e.target instanceof HTMLElement) {
          e.target.blur();
        }
      }
      return;
    }

    if (mode === "hint") {
      e.preventDefault();
      if (e.key === "Escape") {
        endHintSession();
        return;
      }
      if (hintSession) {
        const result = hintSession.feedKey(e.key);
        if (result === "complete" || result === "cancel") {
          hintSession = null;
          mode = nextMode(mode, "hint-complete");
        }
      }
      return;
    }

    if (mode === "search") {
      return;
    }

    const key = toKeyNotation(e);
    const actionName = handler.feed(key, mode);
    if (actionName) {
      e.preventDefault();
      handleAction(actionName);
    }
  });

  document.addEventListener("focusin", (e) => {
    if (isInputElement(e.target)) {
      if (mode === "hint") {
        endHintSession();
      }
      mode = nextMode(mode, "focus-input");
      handler.reset();
    }
  });

  return {
    setEnabled(value: boolean) {
      enabled = value;
    },
  };
}
