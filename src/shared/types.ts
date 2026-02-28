export type Mode = "normal" | "insert" | "hint" | "search";

export type ModeEvent =
	| "keypress"
	| "focus-input"
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
