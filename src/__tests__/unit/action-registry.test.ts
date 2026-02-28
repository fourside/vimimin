import { describe, expect, it, vi } from "vitest";
import { ActionRegistry } from "../../core/action-registry.js";

describe("ActionRegistry", () => {
	it("registers and retrieves an action", () => {
		const registry = new ActionRegistry();
		const action = vi.fn();
		registry.register("scroll-down", action);

		expect(registry.has("scroll-down")).toBe(true);
		expect(registry.get("scroll-down")).toBe(action);
	});

	it("returns undefined for unregistered action", () => {
		const registry = new ActionRegistry();

		expect(registry.has("nonexistent")).toBe(false);
		expect(registry.get("nonexistent")).toBeUndefined();
	});

	it("overwrites existing action with same name", () => {
		const registry = new ActionRegistry();
		const action1 = vi.fn();
		const action2 = vi.fn();
		registry.register("scroll-down", action1);
		registry.register("scroll-down", action2);

		expect(registry.get("scroll-down")).toBe(action2);
	});
});
