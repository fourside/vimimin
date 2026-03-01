import { describe, expect, it } from "vitest";
import { nextMode } from "./mode.js";

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

    it("transitions to hint on enter-hint", () => {
      expect(nextMode("normal", "enter-hint")).toBe("hint");
    });

    it("transitions to search on enter-search", () => {
      expect(nextMode("normal", "enter-search")).toBe("search");
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

  describe("hint mode", () => {
    it("transitions to normal on escape", () => {
      expect(nextMode("hint", "escape")).toBe("normal");
    });

    it("transitions to normal on hint-complete", () => {
      expect(nextMode("hint", "hint-complete")).toBe("normal");
    });

    it("stays hint on keypress", () => {
      expect(nextMode("hint", "keypress")).toBe("hint");
    });
  });

  describe("search mode", () => {
    it("transitions to normal on escape", () => {
      expect(nextMode("search", "escape")).toBe("normal");
    });

    it("transitions to normal on search-complete", () => {
      expect(nextMode("search", "search-complete")).toBe("normal");
    });

    it("stays search on keypress", () => {
      expect(nextMode("search", "keypress")).toBe("search");
    });
  });
});
