import type { ActionRegistry } from "../core/action-registry.js";
import { KeyHandler } from "../core/keyhandler.js";
import type { Keymap } from "../core/keymap.js";
import { nextMode } from "../core/mode.js";
import type { Mode } from "../shared/types.js";
import { HintSession, parseHintActionType } from "./hint-session.js";

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

export function setupKeyListener(
	keymap: Keymap,
	registry: ActionRegistry,
): void {
	let mode: Mode = "normal";
	let hintSession: HintSession | null = null;
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

	function handleAction(actionName: string): void {
		if (parseHintActionType(actionName)) {
			startHintSession(actionName);
		} else {
			const action = registry.get(actionName);
			action?.();
		}
	}

	handler.onTimeout = (actionName) => {
		handleAction(actionName);
	};

	document.addEventListener("keydown", (e) => {
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
}
