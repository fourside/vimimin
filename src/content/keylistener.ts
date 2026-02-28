import type { ActionRegistry } from "../core/action-registry.js";
import { KeyHandler } from "../core/keyhandler.js";
import type { Keymap } from "../core/keymap.js";
import { nextMode } from "../core/mode.js";
import type { Mode } from "../shared/types.js";

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
	const handler = new KeyHandler(keymap);

	handler.onTimeout = (actionName) => {
		const action = registry.get(actionName);
		action?.();
	};

	document.addEventListener("keydown", (e) => {
		// Handle mode transitions for input focus
		if (isInputElement(e.target)) {
			mode = nextMode(mode, "focus-input");
		}

		if (mode === "insert") {
			if (e.key === "Escape") {
				mode = nextMode(mode, "escape");
				// Blur the focused input so keys work again
				if (e.target instanceof HTMLElement) {
					e.target.blur();
				}
			}
			return;
		}

		const key = toKeyNotation(e);
		const actionName = handler.feed(key, mode);
		if (actionName) {
			e.preventDefault();
			const action = registry.get(actionName);
			action?.();
		}
	});

	// Also track focus changes to detect input elements
	document.addEventListener("focusin", (e) => {
		if (isInputElement(e.target)) {
			mode = nextMode(mode, "focus-input");
			handler.reset();
		}
	});
}
