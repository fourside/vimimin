import { describe, expect, it } from "vitest";
import { fuzzyScore } from "./fuzzy.js";

describe("fuzzyScore", () => {
	it("returns 0 for empty query", () => {
		expect(fuzzyScore("", "anything")).toBe(0);
	});

	it("returns 0 when query does not match", () => {
		expect(fuzzyScore("xyz", "hello")).toBe(0);
	});

	it("returns positive score for matching query", () => {
		expect(fuzzyScore("hlo", "hello")).toBeGreaterThan(0);
	});

	it("is case-insensitive", () => {
		expect(fuzzyScore("GML", "Gmail")).toBeGreaterThan(0);
	});

	it("scores consecutive matches higher than scattered", () => {
		const consecutive = fuzzyScore("gma", "Gmail");
		const scattered = fuzzyScore("gml", "Gmail");
		expect(consecutive).toBeGreaterThan(scattered);
	});

	it("scores start-of-string match higher", () => {
		const startMatch = fuzzyScore("g", "Gmail");
		const midMatch = fuzzyScore("m", "Gmail");
		expect(startMatch).toBeGreaterThan(midMatch);
	});

	it("gives bonus for word boundary match", () => {
		const wordBoundary = fuzzyScore("w", "hello world");
		const midWord = fuzzyScore("o", "hello world");
		expect(wordBoundary).toBeGreaterThan(midWord);
	});

	it("returns 0 when query is longer than target", () => {
		expect(fuzzyScore("abcdef", "abc")).toBe(0);
	});

	it("matches full exact string", () => {
		expect(fuzzyScore("hello", "hello")).toBeGreaterThan(0);
	});

	it("gives path separator bonus", () => {
		const pathMatch = fuzzyScore("i", "example.com/inbox");
		const midMatch = fuzzyScore("n", "example.com/inbox");
		expect(pathMatch).toBeGreaterThan(midMatch);
	});
});
