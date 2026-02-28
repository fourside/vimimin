import { describe, expect, it } from "vitest";
import { generateLabels } from "./hint-label.js";

describe("generateLabels", () => {
	it("returns empty array for count 0", () => {
		expect(generateLabels(0)).toEqual([]);
	});

	it("returns empty array for negative count", () => {
		expect(generateLabels(-1)).toEqual([]);
	});

	it("returns single-char labels when count <= 9", () => {
		const labels = generateLabels(5);
		expect(labels).toEqual(["a", "s", "d", "f", "g"]);
	});

	it("returns all 9 single-char labels for count 9", () => {
		const labels = generateLabels(9);
		expect(labels).toEqual(["a", "s", "d", "f", "g", "h", "j", "k", "l"]);
	});

	it("returns 2-char labels when count > 9", () => {
		const labels = generateLabels(10);
		expect(labels).toHaveLength(10);
		for (const label of labels) {
			expect(label).toHaveLength(2);
		}
	});

	it("generates unique labels", () => {
		const labels = generateLabels(50);
		const unique = new Set(labels);
		expect(unique.size).toBe(50);
	});

	it("only uses home row characters", () => {
		const labels = generateLabels(30);
		const validChars = new Set("asdfghjkl".split(""));
		for (const label of labels) {
			for (const ch of label) {
				expect(validChars.has(ch)).toBe(true);
			}
		}
	});

	it("returns 3-char labels when count > 81", () => {
		const labels = generateLabels(82);
		expect(labels).toHaveLength(82);
		for (const label of labels) {
			expect(label).toHaveLength(3);
		}
	});
});
