import type { Mode } from "../shared/types.js";

/** Maps a key (or key sequence joined by " ") to an action name. */
export type KeyBindings = Record<string, string>;

export type Keymap = Record<Mode, KeyBindings>;

export const defaultKeymap: Keymap = {
  normal: {
    j: "scroll-down",
    k: "scroll-up",
    h: "scroll-left",
    l: "scroll-right",
    "g g": "scroll-to-top",
    G: "scroll-to-bottom",
    "<C-d>": "scroll-half-page-down",
    "<C-u>": "scroll-half-page-up",
    "<C-f>": "scroll-page-down",
    "<C-b>": "scroll-page-up",
    f: "hint-click",
    F: "hint-new-tab",
    "; y": "hint-copy-url",
    "; Y": "hint-copy-text",
    "; m": "hint-copy-markdown",
    y: "yank-url",
    Y: "yank-markdown",
    "/": "search-start",
    n: "search-next",
    N: "search-prev",
    "g t": "tab-next",
    "g T": "tab-prev",
    d: "tab-close",
    u: "tab-restore",
    "g 0": "tab-first",
    "g $": "tab-last",
    r: "reload",
    b: "tab-finder",
  },
  insert: {},
  hint: {},
  search: {},
};
