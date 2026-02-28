import { describe, expect, it } from "vitest";
import { isBlacklisted } from "./blacklist.js";

describe("isBlacklisted", () => {
	it("returns false for empty patterns", () => {
		expect(isBlacklisted("https://example.com", [])).toBe(false);
	});

	it("matches exact hostname", () => {
		expect(isBlacklisted("https://slack.com/messages", ["slack.com"])).toBe(
			true,
		);
	});

	it("does not match different hostname", () => {
		expect(isBlacklisted("https://example.com", ["slack.com"])).toBe(false);
	});

	it("matches wildcard subdomain", () => {
		expect(
			isBlacklisted("https://docs.google.com/document/d/1", ["*.google.com"]),
		).toBe(true);
	});

	it("does not match fake subdomain", () => {
		expect(isBlacklisted("https://google.com.evil.com", ["*.google.com"])).toBe(
			false,
		);
	});

	it("matches pattern with path", () => {
		expect(
			isBlacklisted("https://docs.google.com/docs/foo", [
				"*.google.com/docs/*",
			]),
		).toBe(true);
	});

	it("does not match pattern with wrong path", () => {
		expect(
			isBlacklisted("https://docs.google.com/sheets/foo", [
				"*.google.com/docs/*",
			]),
		).toBe(false);
	});

	it("returns false for invalid URL", () => {
		expect(isBlacklisted("not-a-url", ["example.com"])).toBe(false);
	});

	it("matches any of multiple patterns", () => {
		expect(
			isBlacklisted("https://slack.com/channel", ["example.com", "slack.com"]),
		).toBe(true);
	});
});
