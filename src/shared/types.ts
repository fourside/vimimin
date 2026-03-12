export type Mode = "normal" | "insert" | "hint" | "search";

export type ModeEvent =
  | "focus-input"
  | "blur-input"
  | "escape"
  | "enter-hint"
  | "hint-complete"
  | "enter-search"
  | "search-complete";

export type HintActionType =
  | "click"
  | "new-tab"
  | "copy-url"
  | "copy-text"
  | "copy-markdown";
