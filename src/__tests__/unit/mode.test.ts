import { describe, expect, it } from "vitest";
import { nextMode } from "../../core/mode.js";

describe("nextMode", () => {
	describe("normal mode", () => {
		it("stays normal on keypress", () => {
			expect(nextMode("normal", "keypress")).toBe("normal");
		});

		it("transitions to insert on focus-input", () => {
			expect(nextMode("normal", "focus-input")).toBe("insert");
		});

		it("stays normal on escape", () => {
			expect(nextMode("normal", "escape")).toBe("normal");
		});
	});

	describe("insert mode", () => {
		it("stays insert on keypress", () => {
			expect(nextMode("insert", "keypress")).toBe("insert");
		});

		it("stays insert on focus-input", () => {
			expect(nextMode("insert", "focus-input")).toBe("insert");
		});

		it("transitions to normal on escape", () => {
			expect(nextMode("insert", "escape")).toBe("normal");
		});
	});
});
