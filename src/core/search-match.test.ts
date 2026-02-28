import { describe, expect, it } from "vitest";
import { findMatches } from "./search-match.js";

describe("findMatches", () => {
	it("returns empty array for empty query", () => {
		expect(findMatches("", "hello world")).toEqual([]);
	});

	it("finds a single match", () => {
		expect(findMatches("world", "hello world")).toEqual([
			{ start: 6, length: 5 },
		]);
	});

	it("finds multiple matches", () => {
		expect(findMatches("ab", "ab cd ab ef ab")).toEqual([
			{ start: 0, length: 2 },
			{ start: 6, length: 2 },
			{ start: 12, length: 2 },
		]);
	});

	it("is case-insensitive", () => {
		expect(findMatches("Hello", "HELLO hello Hello")).toEqual([
			{ start: 0, length: 5 },
			{ start: 6, length: 5 },
			{ start: 12, length: 5 },
		]);
	});

	it("returns empty array when no match", () => {
		expect(findMatches("xyz", "hello world")).toEqual([]);
	});

	it("finds overlapping matches", () => {
		expect(findMatches("aa", "aaa")).toEqual([
			{ start: 0, length: 2 },
			{ start: 1, length: 2 },
		]);
	});

	it("handles query longer than text", () => {
		expect(findMatches("long query", "short")).toEqual([]);
	});
});
