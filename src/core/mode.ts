import type { Mode, ModeEvent } from "../shared/types.js";

export function nextMode(current: Mode, event: ModeEvent): Mode {
	switch (current) {
		case "normal":
			switch (event) {
				case "focus-input":
					return "insert";
				case "enter-hint":
					return "hint";
				default:
					return "normal";
			}
		case "insert":
			switch (event) {
				case "escape":
					return "normal";
				default:
					return "insert";
			}
		case "hint":
			switch (event) {
				case "escape":
				case "hint-complete":
					return "normal";
				default:
					return "hint";
			}
	}
}
