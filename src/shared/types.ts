export type Mode = "normal" | "insert" | "hint";

export type ModeEvent =
	| "keypress"
	| "focus-input"
	| "escape"
	| "enter-hint"
	| "hint-complete";

export type HintActionType =
	| "click"
	| "new-tab"
	| "copy-url"
	| "copy-text"
	| "copy-markdown";
