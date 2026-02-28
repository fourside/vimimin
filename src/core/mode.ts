import type { Mode, ModeEvent } from "../shared/types.js";

export function nextMode(current: Mode, event: ModeEvent): Mode {
	switch (current) {
		case "normal":
			switch (event) {
				case "focus-input":
					return "insert";
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
	}
}
