import { describe, expect, it } from "vitest";
import { isContentMessage } from "./messages.js";

describe("isContentMessage", () => {
  it("accepts valid simple message", () => {
    expect(isContentMessage({ type: "get-enabled" })).toBe(true);
  });

  it("accepts valid tab-switch message with tabId", () => {
    expect(isContentMessage({ type: "tab-switch", tabId: 42 })).toBe(true);
  });

  it("rejects null", () => {
    expect(isContentMessage(null)).toBe(false);
  });

  it("rejects string", () => {
    expect(isContentMessage("get-enabled")).toBe(false);
  });

  it("rejects object without type", () => {
    expect(isContentMessage({ foo: "bar" })).toBe(false);
  });

  it("rejects object with non-string type", () => {
    expect(isContentMessage({ type: 123 })).toBe(false);
  });

  it("rejects unknown type", () => {
    expect(isContentMessage({ type: "unknown-action" })).toBe(false);
  });

  it("rejects tab-switch without tabId", () => {
    expect(isContentMessage({ type: "tab-switch" })).toBe(false);
  });

  it("rejects tab-switch with non-number tabId", () => {
    expect(isContentMessage({ type: "tab-switch", tabId: "42" })).toBe(false);
  });

  it("accepts all valid message types", () => {
    const types = [
      "get-enabled",
      "toggle-enabled",
      "tab-next",
      "tab-prev",
      "tab-close",
      "tab-restore",
      "tab-first",
      "tab-last",
      "tab-list",
    ];
    for (const type of types) {
      expect(isContentMessage({ type })).toBe(true);
    }
  });
});
