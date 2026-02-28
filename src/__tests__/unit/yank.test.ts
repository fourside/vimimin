import { describe, expect, it } from "vitest";
import { formatMarkdownLink } from "../../core/yank.js";

describe("formatMarkdownLink", () => {
	it("formats a simple link", () => {
		expect(formatMarkdownLink("Example", "https://example.com")).toBe(
			"[Example](https://example.com)",
		);
	});

	it("escapes brackets in title", () => {
		expect(formatMarkdownLink("[foo] bar", "https://example.com")).toBe(
			"[\\[foo\\] bar](https://example.com)",
		);
	});

	it("handles empty title", () => {
		expect(formatMarkdownLink("", "https://example.com")).toBe(
			"[](https://example.com)",
		);
	});
});
